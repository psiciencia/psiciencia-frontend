import { fail } from '@sveltejs/kit';
import { CsvError, checkColumns, parseNumericCsv } from '#lib/csv.ts';
import { summarizeDrift } from '#lib/drift.ts';
import { ApiError, api, optional } from '#lib/server/api.ts';
import { compareWithReference } from '#lib/stats.ts';
import type { DistributionComparison } from '#lib/types.ts';
import type { Actions } from './$types';

const MAX_ROWS = 50_000;

export const actions: Actions = {
	default: async ({ request }) => {
		const file = (await request.formData()).get('file');
		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Selecciona un archivo CSV.' });
		}

		try {
			const model = await api.model();
			if (!model.reference) {
				return fail(503, { error: 'La API no tiene dataset de referencia (REFERENCE_DATA_FILE).' });
			}
			const { columns, rows } = parseNumericCsv(await file.text(), MAX_ROWS);
			checkColumns(columns, Object.keys(model.reference.features));

			const [report, distribution] = await Promise.all([api.drift(rows), optional(api.distribution())]);

			// Distribución actual vs. referencia (en proporciones), con los mismos intervalos.
			const comparisons: DistributionComparison[] = Object.entries(distribution?.histograms ?? {}).map(
				([column, reference]) => ({
					column,
					...compareWithReference(
						reference,
						rows.map((r) => r[column])
					)
				})
			);

			return {
				filename: file.name,
				summary: summarizeDrift(report.metrics, model.reference.rows, rows.length),
				comparisons
			};
		} catch (error) {
			if (error instanceof CsvError) return fail(400, { error: error.message });
			if (error instanceof ApiError) return fail(502, { error: error.message });
			throw error;
		}
	}
};
