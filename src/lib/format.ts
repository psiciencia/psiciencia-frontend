const numberFormat = new Intl.NumberFormat('es', { maximumFractionDigits: 2 });
const preciseFormat = new Intl.NumberFormat('es', { maximumSignificantDigits: 4 });

export const formatNumber = (value: number) => numberFormat.format(value);

export const formatMetric = (value: number) =>
	Math.abs(value) >= 1000 ? numberFormat.format(value) : preciseFormat.format(value);

export const formatPercent = (value: number) =>
	new Intl.NumberFormat('es', { style: 'percent', maximumFractionDigits: 0 }).format(value);

export const formatDate = (millis: number) =>
	new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(millis);

/** Columnas enteras (long/integer) usan step=1 en los formularios. */
export const isInteger = (type: string) => ['long', 'integer'].includes(type);
