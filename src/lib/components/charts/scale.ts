/** Escala lineal: dominio [d0, d1] → rango [r0, r1]. */
export function linear(d0: number, d1: number, r0: number, r1: number) {
	const k = (r1 - r0) / (d1 - d0 || 1);
	return (value: number) => r0 + (value - d0) * k;
}

/** Ticks "redondos" (1, 2, 5 × 10^n) que cubren [min, max]. */
export function niceTicks(min: number, max: number, count = 4): number[] {
	if (min === max) {
		const pad = Math.abs(min) * 0.05 || 1;
		min -= pad;
		max += pad;
	}
	const rough = (max - min) / count;
	const magnitude = 10 ** Math.floor(Math.log10(rough));
	const residual = rough / magnitude;
	const step = (residual >= 7.5 ? 10 : residual >= 3.5 ? 5 : residual >= 1.5 ? 2 : 1) * magnitude;
	const start = Math.floor(min / step) * step;
	const ticks: number[] = [];
	for (let v = start; v <= max + step * 0.5; v += step) ticks.push(Number(v.toPrecision(12)));
	return ticks;
}

const compactFormat = new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 });
const smallFormat = new Intl.NumberFormat('es', { maximumSignificantDigits: 3 });

/** Etiquetas de eje: 250 mil, 1,2 M, 0,98… */
export const tickFormat = (value: number) =>
	Math.abs(value) >= 1000 ? compactFormat.format(value) : smallFormat.format(value);

/** Formato de ticks con los decimales justos para que dos ticks contiguos nunca se lean iguales. */
export function formatterFor(ticks: number[]) {
	const step = ticks.length > 1 ? Math.abs(ticks[1] - ticks[0]) : 1;
	const maxAbs = Math.max(...ticks.map(Math.abs));
	if (maxAbs >= 1000) {
		const unit = maxAbs >= 1e6 ? 1e6 : 1e3;
		const digits = Math.min(3, Math.max(0, Math.ceil(-Math.log10(step / unit))));
		const f = new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: digits, minimumFractionDigits: 0 });
		return (v: number) => f.format(v);
	}
	const digits = Math.min(6, Math.max(0, Math.ceil(-Math.log10(step))));
	const f = new Intl.NumberFormat('es', { minimumFractionDigits: digits, maximumFractionDigits: digits });
	return (v: number) => f.format(v);
}

/** Barra con el extremo de datos redondeado (4px) y la base recta. */
export function barPath(x: number, y: number, w: number, h: number, direction: 'right' | 'up'): string {
	if (w <= 0 || h <= 0) return '';
	if (direction === 'right') {
		const r = Math.min(4, w, h / 2);
		return `M${x},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h - r}A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x}Z`;
	}
	const r = Math.min(4, h, w / 2);
	return `M${x},${y + h}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h}Z`;
}

/** Posición del puntero relativa a un contenedor. */
export function pointerIn(element: HTMLElement, event: PointerEvent) {
	const rect = element.getBoundingClientRect();
	return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}
