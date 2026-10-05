import { fail } from '@sveltejs/kit';
import { CsvError, checkColumns, parseNumericCsv } from '#lib/csv.ts';
import { ApiError, api } from '#lib/server/api.ts';
import type { Row } from '#lib/types.ts';
import type { Actions } from './$types';

const MAX_ROWS = 10_000;

export const actions: Actions = {
	default: async ({ request }) => {
		const file = (await request.formData()).get('file');
		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Selecciona un archivo CSV.' });
		}

		try {
			const model = await api.model();
			const expected = model.input_schema.map((c) => c.name);
			const { columns, rows } = parseNumericCsv(await file.text(), MAX_ROWS);
			checkColumns(columns, expected);

			const { predictions } = await api.predict(rows);
			return {
				filename: file.name,
				columns: [...expected, 'prediction'],
				rows: rows.map((row, i): Row => ({ ...row, prediction: predictions[i] }))
			};
		} catch (error) {
			if (error instanceof CsvError) return fail(400, { error: error.message });
			if (error instanceof ApiError) return fail(502, { error: error.message });
			throw error;
		}
	}
};
