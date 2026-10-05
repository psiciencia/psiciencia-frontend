import { formatMetric } from '#lib/format.ts';
import type { Bin, ReferenceHistogram } from '#lib/types.ts';

export const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / (values.length || 1);

export function extent(values: number[]): [number, number] {
	let min = Infinity;
	let max = -Infinity;
	for (const v of values) {
		if (v < min) min = v;
		if (v > max) max = v;
	}
	return [min, max];
}

export function quantile(values: number[], q: number): number {
	const sorted = [...values].sort((a, b) => a - b);
	const position = (sorted.length - 1) * q;
	const low = Math.floor(position);
	const high = Math.ceil(position);
	return sorted[low] + (sorted[high] - sorted[low]) * (position - low);
}

/** Bins de ancho constante sobre el rango de los datos. */
export function histogram(values: number[], binCount = 20): { bins: Bin[]; counts: number[] } {
	const [min, max] = extent(values);
	const span = max - min || 1;
	const edges = Array.from({ length: binCount + 1 }, (_, i) => min + (span * i) / binCount);
	return { bins: binsFromEdges(edges), counts: countInto(values, edges) };
}

export function binsFromEdges(edges: number[]): Bin[] {
	return edges.slice(0, -1).map((start, i) => ({
		start,
		end: edges[i + 1],
		label: `${formatMetric(start)} – ${formatMetric(edges[i + 1])}`
	}));
}

/** Cuenta valores en los intervalos [e_i, e_i+1); el último incluye el máximo. */
export function countInto(values: number[], edges: number[]): number[] {
	const counts = new Array(edges.length - 1).fill(0);
	const last = edges.length - 2;
	for (const v of values) {
		if (v < edges[0] || v > edges[last + 1]) continue;
		let i = Math.floor(((v - edges[0]) / (edges[last + 1] - edges[0])) * (last + 1));
		i = Math.min(Math.max(i, 0), last);
		// Bordes no uniformes (no es el caso con np.histogram, pero se corrige por si acaso).
		while (i > 0 && v < edges[i]) i--;
		while (i < last && v >= edges[i + 1]) i++;
		counts[i]++;
	}
	return counts;
}

const shares = (counts: number[], total: number) => counts.map((c) => c / (total || 1));

/**
 * Compara una columna de datos actuales con el histograma de referencia, como proporciones.
 * Los valores fuera del rango de referencia van a bins extra "< mín" / "> máx": son justo los que
 * indican que el modelo recibe datos que nunca vio.
 */
export function compareWithReference(reference: ReferenceHistogram, values: number[]) {
	const referenceTotal = reference.counts.reduce((a, b) => a + b, 0);

	if (reference.discrete) {
		const bins: Bin[] = reference.values.map((v) => ({ label: formatMetric(v), start: v, end: v }));
		const current = reference.values.map((v) => values.filter((x) => x === v).length);
		const others = values.length - current.reduce((a, b) => a + b, 0);
		const refShares = shares(reference.counts, referenceTotal);
		if (others > 0) {
			bins.push({ label: 'otros' });
			refShares.push(0);
			current.push(others);
		}
		return { bins, reference: refShares, current: shares(current, values.length) };
	}

	const edges = reference.edges;
	const bins = binsFromEdges(edges);
	const current = countInto(values, edges);
	const refShares = shares(reference.counts, referenceTotal);
	const below = values.filter((v) => v < edges[0]).length;
	const above = values.filter((v) => v > edges[edges.length - 1]).length;
	if (below) {
		bins.unshift({ label: `< ${formatMetric(edges[0])}` });
		refShares.unshift(0);
		current.unshift(below);
	}
	if (above) {
		bins.push({ label: `> ${formatMetric(edges[edges.length - 1])}` });
		refShares.push(0);
		current.push(above);
	}
	return { bins, reference: refShares, current: shares(current, values.length) };
}
