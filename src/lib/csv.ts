import type { Row } from '#lib/types.ts';

export class CsvError extends Error {}

/** Parsea un CSV numérico con cabecera (separador coma o punto y coma). */
export function parseNumericCsv(text: string, maxRows: number): { columns: string[]; rows: Row[] } {
	const lines = text
		.replace(/^﻿/, '')
		.split(/\r?\n/)
		.filter((line) => line.trim() !== '');
	if (lines.length < 2) throw new CsvError('El CSV necesita una cabecera y al menos una fila.');
	if (lines.length - 1 > maxRows) {
		throw new CsvError(`El CSV tiene ${lines.length - 1} filas; el máximo es ${maxRows}.`);
	}

	const separator = lines[0].includes(';') && !lines[0].includes(',') ? ';' : ',';
	const columns = lines[0].split(separator).map((c) => c.trim().replace(/^"|"$/g, ''));

	const rows = lines.slice(1).map((line, index) => {
		const cells = line.split(separator);
		if (cells.length !== columns.length) {
			throw new CsvError(`Fila ${index + 2}: tiene ${cells.length} columnas y la cabecera ${columns.length}.`);
		}
		const row: Row = {};
		columns.forEach((column, i) => {
			const value = Number(cells[i].trim().replace(/^"|"$/g, ''));
			if (!Number.isFinite(value)) {
				throw new CsvError(`Fila ${index + 2}, columna "${column}": "${cells[i]}" no es un número.`);
			}
			row[column] = value;
		});
		return row;
	});
	return { columns, rows };
}

/** Comprueba que el CSV tenga exactamente las columnas que espera el modelo. */
export function checkColumns(columns: string[], expected: string[]): void {
	const missing = expected.filter((c) => !columns.includes(c));
	const extra = columns.filter((c) => !expected.includes(c));
	if (missing.length || extra.length) {
		const parts = [
			missing.length ? `faltan: ${missing.join(', ')}` : '',
			extra.length ? `sobran: ${extra.join(', ')}` : ''
		].filter(Boolean);
		throw new CsvError(`Las columnas no coinciden con el modelo (${parts.join('; ')}).`);
	}
}

export function toCsv(columns: string[], rows: Row[]): string {
	return [columns.join(','), ...rows.map((row) => columns.map((c) => row[c]).join(','))].join('\n');
}
