// Datos SINTÉTICOS para los ejemplos ilustrativos de la landing y de las páginas por sector.
// No son datos reales de pacientes, alumnos, clientes ni máquinas: se generan con una semilla fija
// para que las gráficas sean estables entre visitas. Cada gráfica que los usa lo indica.
import { histogram } from '#lib/stats.ts';

/** Generador pseudoaleatorio determinista (LCG). */
function seeded(seed: number) {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296;
		return state / 4294967296;
	};
}

const round = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

/**
 * Psicología clínica — seguimiento de resultados (ROM). Puntuación de un cuestionario de
 * síntomas depresivos (escala 0–27, como el PHQ-9) a lo largo de las sesiones, frente a la
 * trayectoria esperada para pacientes con una puntuación inicial similar.
 */
export const clinicalMonitoring = (() => {
	const sessions = Array.from({ length: 12 }, (_, i) => i + 1);
	const expected = sessions.map((s) => ({ x: s, y: round(6 + 14 * Math.exp(-(s - 1) / 4.5)) }));
	const scores = [20, 19, 19, 18, 19, 19, 17, 14, 12, 10, 9, 8];
	return {
		patient: sessions.map((s, i) => ({ x: s, y: scores[i] })),
		expected,
		alertSession: 5,
		cutoff: 10
	};
})();

/** Psicometría — cargas factoriales de los ítems de un cuestionario piloto (análisis factorial). */
export const itemLoadings = [
	{ label: 'Ítem 1', value: 0.78 },
	{ label: 'Ítem 2', value: 0.72 },
	{ label: 'Ítem 3', value: 0.69 },
	{ label: 'Ítem 4', value: 0.81 },
	{ label: 'Ítem 5', value: 0.64 },
	{ label: 'Ítem 6', value: 0.22, note: 'Carga baja: revisar redacción o eliminar' },
	{ label: 'Ítem 7', value: 0.58 },
	{ label: 'Ítem 8', value: 0.47 }
];

/** Psicología organizacional — importancia de factores asociados al riesgo de burnout. */
export const burnoutDrivers = [
	{ label: 'Carga de trabajo', value: 0.31 },
	{ label: 'Falta de autonomía', value: 0.19 },
	{ label: 'Poco reconocimiento', value: 0.16 },
	{ label: 'Conflicto trabajo-familia', value: 0.14 },
	{ label: 'Apoyo del supervisor', value: 0.12 },
	{ label: 'Ambigüedad de rol', value: 0.08 }
];

/** Evaluación ecológica momentánea (EMA): estado de ánimo diario (1–10) registrado en una app. */
export const moodDiary = (() => {
	const random = seeded(11);
	return Array.from({ length: 28 }, (_, i) => {
		const day = i + 1;
		const trend = 4.6 + day * 0.08;
		const weekly = day % 7 === 1 ? -0.9 : day % 7 === 6 || day % 7 === 0 ? 0.6 : 0;
		return { x: day, y: round(Math.min(10, Math.max(1, trend + weekly + (random() - 0.5) * 1.2))) };
	});
})();

/** Industria — vibración RMS (mm/s) de un rodamiento: el modelo detecta la anomalía antes del umbral. */
export const vibration = (() => {
	const random = seeded(23);
	const points = Array.from({ length: 72 }, (_, i) => {
		const hour = i + 1;
		const degradation = hour > 46 ? 0.06 * (hour - 46) ** 1.45 : 0;
		return { x: hour, y: round(2.1 + degradation + (random() - 0.5) * 0.35, 2) };
	});
	return { points, earlyWarning: 52, alarm: 4.5 };
})();

/** Empresa — demanda mensual real vs. pronóstico (incluye 3 meses hacia adelante). */
export const demandForecast = (() => {
	const random = seeded(5);
	const months = 24;
	const base = (m: number) => 1200 + m * 18 + 260 * Math.sin(((m - 3) / 12) * 2 * Math.PI);
	const actual = Array.from({ length: months - 3 }, (_, i) => ({ x: i + 1, y: Math.round(base(i + 1) + (random() - 0.5) * 140) }));
	const forecast = Array.from({ length: months }, (_, i) => ({ x: i + 1, y: Math.round(base(i + 1)) }));
	return { actual, forecast };
})();

/** Educación — puntuación de riesgo de abandono de 400 estudiantes y factores del modelo. */
export const dropoutRisk = (() => {
	const random = seeded(31);
	const scores = Array.from({ length: 400 }, () => {
		// Mezcla: la mayoría con riesgo bajo, un grupo minoritario con riesgo alto.
		const high = random() < 0.18;
		const centre = high ? 0.7 : 0.22;
		const spread = high ? 0.16 : 0.13;
		const value = centre + (random() + random() + random() - 1.5) * spread;
		return Math.min(0.99, Math.max(0.01, value));
	});
	return {
		...histogram(scores, 20),
		threshold: 0.6,
		flagged: scores.filter((s) => s >= 0.6).length,
		total: scores.length,
		factors: [
			{ label: 'Asistencia a clase', value: 0.29 },
			{ label: 'Notas del primer parcial', value: 0.24 },
			{ label: 'Entregas fuera de plazo', value: 0.17 },
			{ label: 'Actividad en la plataforma', value: 0.15 },
			{ label: 'Créditos reprobados', value: 0.1 },
			{ label: 'Horas de trabajo semanal', value: 0.05 }
		]
	};
})();

/**
 * Realidad virtual — terapia de exposición para una fobia: pico de ansiedad subjetiva (SUDS, 0–100)
 * y de activación fisiológica (frecuencia cardiaca normalizada a 0–100) en cada sesión.
 * Ambas en la misma escala 0–100, por eso comparten un único eje.
 */
export const vrExposure = (() => {
	const suds = [88, 82, 74, 70, 58, 49, 41, 33, 28, 24];
	const arousal = [80, 79, 72, 66, 60, 52, 45, 39, 33, 30];
	return {
		suds: suds.map((y, i) => ({ x: i + 1, y })),
		arousal: arousal.map((y, i) => ({ x: i + 1, y })),
		levelUp: 5,
		target: 30
	};
})();

/**
 * Simulación — modelo epidemiológico SIR: porcentaje de población infectada por día sin
 * intervención (R0 = 2,5) y con medidas que reducen los contactos (R0 = 1,6).
 */
export const epidemicScenarios = (() => {
	const run = (r0: number) => {
		const gamma = 1 / 7;
		const beta = r0 * gamma;
		let s = 0.999;
		let i = 0.001;
		const points: { x: number; y: number }[] = [];
		for (let day = 0; day <= 160; day++) {
			if (day % 4 === 0) points.push({ x: day, y: round(i * 100, 2) });
			for (let step = 0; step < 4; step++) {
				const newInfections = beta * s * i * 0.25;
				const recoveries = gamma * i * 0.25;
				s -= newInfections;
				i += newInfections - recoveries;
			}
		}
		return points;
	};
	const base = run(2.5);
	const mitigated = run(1.6);
	const peak = (pts: { x: number; y: number }[]) => pts.reduce((a, b) => (b.y > a.y ? b : a));
	return { base, mitigated, basePeak: peak(base), mitigatedPeak: peak(mitigated), capacity: 6 };
})();

/** IoT agro — humedad del suelo (%) cada 6 horas durante 3 semanas, con lluvia y riegos automáticos. */
export const soilMoisture = (() => {
	const random = seeded(17);
	const threshold = 22;
	const points: { x: number; y: number }[] = [];
	const irrigations: number[] = [];
	let moisture = 34;
	for (let step = 0; step < 84; step++) {
		const day = step / 4;
		const daytime = step % 4 === 1 || step % 4 === 2;
		moisture -= (daytime ? 0.75 : 0.25) + random() * 0.15;
		if (step === 30) moisture += 12; // lluvia
		if (moisture < threshold) {
			moisture += 11; // riego automático: el modelo lo programa al acercarse al umbral
			irrigations.push(round(day, 2));
		}
		points.push({ x: round(day, 2), y: round(moisture) });
	}
	return { points, threshold, irrigations, rainDay: 7.5 };
})();

/**
 * IoT salud — frecuencia cardiaca en reposo (wearable) durante 30 días. Se aprende la línea base
 * personal y se avisa cuando la media de 3 días supera la base + 2 desviaciones.
 */
export const restingHeartRate = (() => {
	const random = seeded(41);
	const points = Array.from({ length: 30 }, (_, i) => {
		const day = i + 1;
		const shift = day >= 21 ? Math.min(9, (day - 20) * 1.6) : 0;
		return { x: day, y: round(62 + shift + (random() - 0.5) * 3) };
	});
	const baseline = points.slice(0, 20).map((p) => p.y);
	const mean = baseline.reduce((a, b) => a + b, 0) / baseline.length;
	const sd = Math.sqrt(baseline.reduce((a, b) => a + (b - mean) ** 2, 0) / baseline.length);
	const limit = round(mean + 2 * sd);
	const alertDay = points.find((p, i) => i >= 2 && (points[i].y + points[i - 1].y + points[i - 2].y) / 3 > limit)?.x ?? 24;
	return { points, limit, alertDay };
})();
