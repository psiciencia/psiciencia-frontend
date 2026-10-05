import { fail } from '@sveltejs/kit';
import { isInteger } from '#lib/format.ts';
import { ApiError, api, optional } from '#lib/server/api.ts';
import type { Curve, ModelInfo, Row } from '#lib/types.ts';
import type { Actions, PageServerLoad } from './$types';

const SWEEP_POINTS = 15;

export const load: PageServerLoad = async () => ({ evaluation: await optional(api.evaluation()) });

/**
 * Análisis what-if: para cada variable se recorre su rango de referencia manteniendo las demás fijas
 * (curva ICE local). Todas las filas se envían en una sola llamada a /predict.
 */
function sweepRows(model: ModelInfo, row: Row) {
	const sweeps: { feature: string; values: number[] }[] = [];
	for (const column of model.input_schema) {
		const stats = model.reference?.features[column.name];
		if (!stats) continue;
		let values: number[];
		if (isInteger(column.type) && stats.max - stats.min <= 30) {
			values = Array.from({ length: stats.max - stats.min + 1 }, (_, i) => stats.min + i);
		} else {
			values = Array.from({ length: SWEEP_POINTS }, (_, i) => stats.min + ((stats.max - stats.min) * i) / (SWEEP_POINTS - 1));
			if (isInteger(column.type)) values = values.map(Math.round);
		}
		values = [...new Set([...values, row[column.name]])].sort((a, b) => a - b);
		sweeps.push({ feature: column.name, values });
	}
	const rows = sweeps.flatMap((s) => s.values.map((v) => ({ ...row, [s.feature]: v })));
	return { sweeps, rows };
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		let model: ModelInfo;
		try {
			model = await api.model();
		} catch (error) {
			return fail(503, { error: error instanceof ApiError ? error.message : 'API no disponible.' });
		}

		const row: Row = {};
		for (const column of model.input_schema) {
			const value = Number(form.get(column.name));
			if (form.get(column.name) === '' || !Number.isFinite(value)) {
				return fail(400, { error: `"${column.name}" debe ser un número.` });
			}
			row[column.name] = value;
		}

		try {
			const { sweeps, rows } = sweepRows(model, row);
			const { predictions } = await api.predict([row, ...rows]);
			let offset = 1;
			const curves: Curve[] = sweeps.map((s) => {
				const points = s.values.map((x, i) => ({ x, y: predictions[offset + i] }));
				offset += s.values.length;
				return { feature: s.feature, points, current: row[s.feature] };
			});
			return { prediction: predictions[0], input: row, version: model.version, curves };
		} catch (error) {
			return fail(502, { error: error instanceof ApiError ? error.message : 'La predicción falló.' });
		}
	}
};
