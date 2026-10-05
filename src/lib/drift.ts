import type { DriftSummary } from '#lib/types.ts';

// Con referencias de hasta 1000 filas Evidently usa tests estadísticos (K-S o chi-cuadrado) y
// ValueDrift devuelve un p-value: hay drift si es menor que 0.05. Con referencias mayores usa
// distancias (Wasserstein / Jensen-Shannon) y no se puede deducir el veredicto por columna.
const PVALUE_REFERENCE_LIMIT = 1000;
const PVALUE_THRESHOLD = 0.05;

export function summarizeDrift(
	metrics: { metric_id: string; value: unknown }[],
	referenceRows: number,
	currentRows: number
): DriftSummary {
	const usesPValue = referenceRows <= PVALUE_REFERENCE_LIMIT;
	const columns = metrics
		.map((metric) => ({ match: metric.metric_id.match(/^ValueDrift\(column=(.+)\)$/), value: metric.value }))
		.filter((m) => m.match && typeof m.value === 'number')
		.map((m) => {
			const score = m.value as number;
			return { column: m.match![1], score, drifted: usesPValue ? score < PVALUE_THRESHOLD : null };
		});

	const count = metrics.find((m) => m.metric_id.startsWith('DriftedColumnsCount'))?.value as
		| { count: number; share: number }
		| undefined;

	return {
		drifted: count?.count ?? 0,
		share: count?.share ?? 0,
		total: columns.length,
		columns,
		rows: currentRows
	};
}
