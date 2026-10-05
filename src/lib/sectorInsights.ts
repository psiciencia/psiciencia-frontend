// Contenido de la página /sectores: problemas que se repiten en todos los sectores y
// diagnóstico de madurez de datos.
import type { IconName } from '#lib/components/Icon.svelte';

export type ProblemId = 'pronostico' | 'riesgo' | 'anomalias' | 'segmentacion' | 'personalizacion' | 'texto-imagen';

export interface CrossProblem {
	id: ProblemId;
	label: string;
	icon: IconName;
	question: string;
	technique: string;
	metric: string;
	examples: { sector: string; slug: string; text: string }[];
}

/** Seis tipos de problema que aparecen, con distinto nombre, en casi cualquier sector. */
export const crossProblems: CrossProblem[] = [
	{
		id: 'pronostico',
		label: 'Pronóstico',
		icon: 'pulse',
		question: '¿Cuánto habrá mañana, la semana que viene o el próximo trimestre?',
		technique: 'Series temporales (ETS, ARIMA, Prophet, gradient boosting)',
		metric: 'Error porcentual medio (MAPE) frente a lo real',
		examples: [
			{ sector: 'Salud', slug: 'salud', text: 'Llegadas a urgencias por día para dimensionar turnos.' },
			{ sector: 'Empresa', slug: 'empresa', text: 'Demanda por producto y tienda para planificar compras.' },
			{ sector: 'Agro', slug: 'agro', text: 'Humedad del suelo y necesidad de riego en los próximos días.' },
			{ sector: 'Educación', slug: 'educacion', text: 'Matrícula esperada para planificar grupos y docentes.' },
			{ sector: 'Industria', slug: 'industria', text: 'Consumo energético de la planta por franja horaria.' },
			{ sector: 'Psicología', slug: 'psicologia', text: 'Demanda de atención en un servicio de salud mental.' }
		]
	},
	{
		id: 'riesgo',
		label: 'Riesgo y priorización',
		icon: 'scale',
		question: '¿A quién (o a qué) conviene atender primero?',
		technique: 'Clasificación (regresión logística, gradient boosting) con probabilidades calibradas',
		metric: 'Recall y precisión en el grupo priorizado',
		examples: [
			{ sector: 'Educación', slug: 'educacion', text: 'Estudiantes con riesgo de abandono para tutorías.' },
			{ sector: 'Salud', slug: 'salud', text: 'Pacientes con riesgo de reingreso tras el alta.' },
			{ sector: 'Psicología', slug: 'psicologia', text: 'Pacientes que no progresan según lo esperado.' },
			{ sector: 'Empresa', slug: 'empresa', text: 'Clientes con probabilidad de darse de baja.' },
			{ sector: 'Finanzas', slug: 'finanzas', text: 'Solicitudes de crédito con mayor riesgo de impago.' }
		]
	},
	{
		id: 'anomalias',
		label: 'Detección de anomalías',
		icon: 'sensor',
		question: '¿Algo se está comportando distinto de lo normal?',
		technique: 'Modelos de normalidad, isolation forest, autoencoders, control estadístico',
		metric: 'Antelación de la alerta y tasa de falsas alarmas',
		examples: [
			{ sector: 'Industria', slug: 'industria', text: 'Vibración de un rodamiento que anticipa una avería.' },
			{ sector: 'Salud', slug: 'salud', text: 'Frecuencia cardiaca en reposo que se aleja de la línea base.' },
			{ sector: 'Finanzas', slug: 'finanzas', text: 'Transacciones con patrón de fraude.' },
			{ sector: 'Agro', slug: 'agro', text: 'Actividad de un animal que indica enfermedad.' },
			{ sector: 'Psicología', slug: 'psicologia', text: 'Cambios bruscos de sueño o actividad en el seguimiento.' }
		]
	},
	{
		id: 'segmentacion',
		label: 'Segmentación y perfiles',
		icon: 'users',
		question: '¿Qué grupos con necesidades parecidas existen?',
		technique: 'Clustering (k-means, mezclas gaussianas), análisis de perfiles latentes',
		metric: 'Estabilidad de los grupos y utilidad para decidir',
		examples: [
			{ sector: 'Empresa', slug: 'empresa', text: 'Clientes según recencia, frecuencia y valor (RFM).' },
			{ sector: 'Educación', slug: 'educacion', text: 'Perfiles de estudio según el uso de la plataforma.' },
			{ sector: 'Psicología', slug: 'psicologia', text: 'Perfiles de síntomas para orientar el tratamiento.' },
			{ sector: 'Agro', slug: 'agro', text: 'Zonas de manejo homogéneo dentro de una finca.' },
			{ sector: 'Sector público', slug: 'sector-publico', text: 'Territorios con necesidades sociales similares.' }
		]
	},
	{
		id: 'personalizacion',
		label: 'Recomendación y personalización',
		icon: 'hand',
		question: '¿Qué es lo más adecuado para esta persona en este momento?',
		technique: 'Sistemas de recomendación, bandits, teoría de respuesta al ítem',
		metric: 'Mejora frente a un grupo de control (test A/B)',
		examples: [
			{ sector: 'Educación', slug: 'educacion', text: 'Ejercicios ajustados al nivel de cada estudiante.' },
			{ sector: 'Psicología', slug: 'psicologia', text: 'Tests adaptativos más cortos y precisos.' },
			{ sector: 'Marketing', slug: 'marketing', text: 'Contenidos y ofertas según intereses.' },
			{ sector: 'Salud', slug: 'salud', text: 'Recordatorios de adherencia en el momento oportuno.' }
		]
	},
	{
		id: 'texto-imagen',
		label: 'Texto e imágenes',
		icon: 'eye',
		question: '¿Qué dicen los textos y qué muestran las imágenes, a escala?',
		technique: 'Procesamiento de lenguaje natural y visión por computador',
		metric: 'Exactitud frente a revisión humana',
		examples: [
			{ sector: 'Psicología', slug: 'psicologia', text: 'Temas y emociones en respuestas abiertas o diarios.' },
			{ sector: 'Salud', slug: 'salud', text: 'Apoyo a la lectura de imágenes médicas.' },
			{ sector: 'Industria', slug: 'industria', text: 'Defectos en piezas detectados con cámaras.' },
			{ sector: 'Agro', slug: 'agro', text: 'Plagas y enfermedades en fotos de hojas.' },
			{ sector: 'Empresa', slug: 'empresa', text: 'Clasificación automática de reclamos de clientes.' }
		]
	}
];

export interface MaturityQuestion {
	id: string;
	question: string;
	options: string[];
}

/** Cinco preguntas, cada opción vale 0, 1 o 2 puntos (en orden). */
export const maturityQuestions: MaturityQuestion[] = [
	{
		id: 'datos',
		question: '¿Dónde están hoy los datos de tu organización?',
		options: ['En papel o en hojas sueltas', 'En hojas de cálculo y sistemas separados', 'En una base de datos centralizada y documentada']
	},
	{
		id: 'calidad',
		question: '¿Confías en la calidad de esos datos?',
		options: ['No sabemos si son correctos', 'Bastante, pero con errores conocidos', 'Sí, hay controles y responsables']
	},
	{
		id: 'uso',
		question: '¿Cómo se usan los datos para decidir?',
		options: ['Casi no se usan', 'Informes y tableros del pasado', 'Pronósticos o modelos que anticipan']
	},
	{
		id: 'equipo',
		question: '¿Quién trabaja con los datos?',
		options: ['Nadie de forma específica', 'Personas que hacen análisis en sus ratos libres', 'Un equipo o perfil dedicado']
	},
	{
		id: 'gobierno',
		question: '¿Cómo gestionáis la privacidad y el consentimiento?',
		options: ['No está definido', 'Hay normas, pero se aplican de forma desigual', 'Políticas claras, revisadas y cumplidas']
	}
];

export const maturityLevels = [
	{
		min: 0,
		label: 'Inicial',
		text: 'El primer paso no es un modelo, sino ordenar los datos: inventario de fuentes, una base común y responsables de su calidad.',
		next: ['Inventariar qué datos existen y dónde', 'Digitalizar y centralizar lo esencial', 'Definir una pregunta de negocio concreta']
	},
	{
		min: 4,
		label: 'En desarrollo',
		text: 'Hay datos y se usan para mirar atrás. Es el momento de un piloto acotado que anticipe algo útil y medible.',
		next: ['Elegir un caso con impacto claro', 'Construir un primer modelo y compararlo con lo actual', 'Medir el resultado frente a un grupo de control']
	},
	{
		min: 8,
		label: 'Avanzado',
		text: 'La base está lista para llevar modelos a producción de forma sostenible: versionado, monitoreo y mejora continua.',
		next: ['Plataforma MLOps (registro y versionado de modelos)', 'Monitoreo de drift y del rendimiento real', 'Escalar a nuevas áreas e integrar IoT o simulación']
	}
];
