// Tecnologías que amplían la ciencia de datos (realidad extendida, simulación, IoT) y sus
// aplicaciones por sector. Alimenta /tecnologias y /tecnologias/<slug>.
import type { IconName } from '#lib/components/Icon.svelte';

export type TechSlug = 'realidad-extendida' | 'simulacion' | 'iot';
export type SectorKey = 'psicologia' | 'salud' | 'educacion' | 'industria' | 'agro' | 'empresa' | 'investigacion';

export const sectorTabs: { id: SectorKey; label: string; icon: IconName }[] = [
	{ id: 'psicologia', label: 'Psicología', icon: 'brain' },
	{ id: 'salud', label: 'Salud', icon: 'heart' },
	{ id: 'educacion', label: 'Educación', icon: 'school' },
	{ id: 'industria', label: 'Industria', icon: 'factory' },
	{ id: 'agro', label: 'Agro', icon: 'leaf' },
	{ id: 'empresa', label: 'Empresa y economía', icon: 'briefcase' },
	{ id: 'investigacion', label: 'Investigación', icon: 'flask' }
];

export interface TechApp {
	title: string;
	text: string;
	/** Qué datos genera o consume la aplicación. */
	data: string;
	/** Técnica de ciencia de datos principal. */
	technique: string;
}

export interface Technology {
	slug: TechSlug;
	name: string;
	short: string;
	icon: IconName;
	tagline: string;
	/** Meta description (≈150 caracteres). */
	seoDescription: string;
	lead: string;
	what: string;
	/** Cómo se relaciona con la ciencia de datos: en ambos sentidos. */
	relations: { title: string; text: string; explain: string }[];
	pipeline: { title: string; text: string }[];
	dataTypes: string[];
	apps: Record<SectorKey, TechApp[]>;
	challenges: { title: string; text: string }[];
}

export const technologies: Technology[] = [
	{
		slug: 'realidad-extendida',
		name: 'Realidad extendida (AR / VR / MR)',
		short: 'Realidad extendida',
		icon: 'vr',
		tagline: 'Entornos inmersivos que generan datos de comportamiento y muestran los datos donde se necesitan.',
		seoDescription: 'Realidad virtual, aumentada y mixta con ciencia de datos: terapia de exposición, rehabilitación, formación y mantenimiento asistido.',
		lead: 'La realidad virtual (VR) crea entornos completos; la aumentada (AR) superpone información al mundo real; la mixta (MR) combina ambas. Para la ciencia de datos son a la vez una fuente de datos de comportamiento muy rica y una nueva forma de visualizar y actuar sobre los resultados de un modelo.',
		what: 'Un visor de VR registra decenas de veces por segundo la posición de la cabeza y las manos, hacia dónde mira la persona, cuánto tarda en reaccionar y qué decisiones toma. Combinado con sensores fisiológicos, describe con precisión cómo alguien vive una situación, en condiciones controladas y repetibles.',
		relations: [
			{
				title: 'XR como fuente de datos',
				text: 'Seguimiento de mirada, movimiento, tiempos de reacción y decisiones.',
				explain: 'Cada sesión inmersiva produce series temporales de alta frecuencia: posición 6DoF de cabeza y manos, eye tracking, interacciones y, con sensores, frecuencia cardiaca o actividad electrodérmica. Son datos ideales para modelos de comportamiento, atención o habilidad.'
			},
			{
				title: 'Ciencia de datos dentro de la experiencia',
				text: 'Modelos que adaptan en tiempo real la dificultad o la intensidad.',
				explain: 'Un modelo estima a partir de las señales el nivel de ansiedad, carga cognitiva o habilidad, y la experiencia se ajusta sola: más difícil si la persona va sobrada, más suave si está desbordada. Es aprendizaje o terapia personalizada.'
			},
			{
				title: 'XR como interfaz de los datos',
				text: 'Resultados y alertas superpuestos al mundo real o explorados en 3D.',
				explain: 'La AR muestra la predicción donde se toma la decisión: la temperatura prevista de un motor sobre el propio motor, o la ruta óptima en un almacén. La analítica inmersiva permite explorar datos complejos (redes, volúmenes médicos) en tres dimensiones.'
			}
		],
		pipeline: [
			{ title: 'Diseño del entorno', text: 'Escenario controlado y medible.' },
			{ title: 'Captura', text: 'Mirada, movimiento, respuestas, fisiología.' },
			{ title: 'Procesamiento', text: 'Limpieza, sincronización y variables.' },
			{ title: 'Modelado', text: 'Estimar estado, habilidad o riesgo.' },
			{ title: 'Adaptación', text: 'El entorno responde al modelo.' },
			{ title: 'Evaluación', text: 'Resultados medidos sesión a sesión.' }
		],
		dataTypes: ['Seguimiento ocular', 'Posición 6DoF', 'Tiempos de reacción', 'Interacciones', 'Frecuencia cardiaca', 'Actividad electrodérmica', 'Respuestas subjetivas'],
		apps: {
			psicologia: [
				{ title: 'Terapia de exposición con VR', text: 'Fobias, ansiedad y estrés postraumático tratados en entornos virtuales graduados.', data: 'Ansiedad subjetiva (SUDS), frecuencia cardiaca, actividad electrodérmica', technique: 'Modelos de habituación y ajuste adaptativo de la intensidad' },
				{ title: 'Evaluación neuropsicológica ecológica', text: 'Tareas cotidianas virtuales (hacer la compra, cocinar) para evaluar atención y funciones ejecutivas.', data: 'Errores, tiempos, rutas y patrón de mirada', technique: 'Clasificación y normas de referencia por edad' },
				{ title: 'Entrenamiento en habilidades sociales', text: 'Avatares para practicar entrevistas o conversaciones difíciles.', data: 'Mirada, voz, turnos de palabra', technique: 'Análisis de señales y feedback automático' }
			],
			salud: [
				{ title: 'Rehabilitación motora', text: 'Ejercicios gamificados tras un ictus o una lesión, con medición precisa del movimiento.', data: 'Cinemática de brazos y manos, rango articular', technique: 'Series temporales y seguimiento de la recuperación' },
				{ title: 'Cirugía guiada con AR', text: 'Imágenes del paciente (TAC, resonancia) superpuestas sobre el campo quirúrgico.', data: 'Imagen médica 3D y posición del instrumental', technique: 'Visión por computador y segmentación' },
				{ title: 'Formación clínica', text: 'Simulación de procedimientos y urgencias sin riesgo para pacientes.', data: 'Secuencia de acciones, tiempos, errores', technique: 'Evaluación automática de competencias' }
			],
			educacion: [
				{ title: 'Laboratorios virtuales', text: 'Experimentos de química o física sin coste de materiales ni riesgos.', data: 'Pasos realizados, intentos, errores', technique: 'Analítica del aprendizaje' },
				{ title: 'Aprendizaje adaptativo inmersivo', text: 'La dificultad se ajusta según el desempeño del estudiante.', data: 'Aciertos, tiempos y atención', technique: 'Teoría de respuesta al ítem y bandits' },
				{ title: 'Visitas y contextos imposibles', text: 'Recorrer el interior de una célula o una ciudad histórica.', data: 'Recorridos y tiempo de exploración', technique: 'Análisis de trayectorias' }
			],
			industria: [
				{ title: 'Mantenimiento asistido con AR', text: 'Instrucciones paso a paso y datos de sensores en vivo sobre la máquina.', data: 'Lecturas IoT, historial de averías', technique: 'Modelos predictivos mostrados en contexto' },
				{ title: 'Formación de operarios', text: 'Práctica de maniobras críticas en VR antes de tocar la línea real.', data: 'Precisión, secuencia, tiempos', technique: 'Evaluación de habilidad y curvas de aprendizaje' },
				{ title: 'Gemelo digital inmersivo', text: 'Recorrer la planta virtual con su estado actual y simulado.', data: 'Telemetría de la planta', technique: 'Integración simulación + datos en tiempo real' }
			],
			agro: [
				{ title: 'Diagnóstico en campo con AR', text: 'Apuntar el móvil a una hoja y recibir la probable plaga o enfermedad.', data: 'Imágenes de hojas y frutos', technique: 'Clasificación de imágenes' },
				{ title: 'Visualización de mapas de cultivo', text: 'Mapas de humedad o vigor (NDVI) superpuestos sobre la parcela.', data: 'Sensores de suelo, imágenes de dron o satélite', technique: 'Análisis geoespacial' }
			],
			empresa: [
				{ title: 'Comercio inmersivo', text: 'Probar muebles o ropa con AR antes de comprar.', data: 'Interacciones y conversión', technique: 'Tests A/B y modelos de recomendación' },
				{ title: 'Investigación de mercado en VR', text: 'Tiendas virtuales para estudiar dónde mira y qué elige el consumidor.', data: 'Mapas de calor de mirada, elecciones', technique: 'Modelos de elección discreta' },
				{ title: 'Analítica inmersiva', text: 'Explorar en 3D cuadros de mando y redes de datos complejas.', data: 'Datos de negocio', technique: 'Visualización y reducción de dimensionalidad' }
			],
			investigacion: [
				{ title: 'Experimentos controlados y reproducibles', text: 'El mismo estímulo exacto para todos los participantes, en cualquier laboratorio.', data: 'Conducta registrada con alta precisión temporal', technique: 'Modelos mixtos y diseño experimental' },
				{ title: 'Estudios de percepción y atención', text: 'Eye tracking integrado para medir qué se procesa y cuándo.', data: 'Fijaciones, sacadas, dilatación pupilar', technique: 'Análisis de series temporales oculares' }
			]
		},
		challenges: [
			{ title: 'Privacidad biométrica', text: 'La mirada y el movimiento pueden identificar a una persona y revelar estados emocionales: requieren protección reforzada.' },
			{ title: 'Validez ecológica', text: 'Hay que demostrar que lo que ocurre en VR se traslada a la vida real.' },
			{ title: 'Cybersickness y accesibilidad', text: 'Mareo, coste de los equipos y usuarios que no pueden usarlos.' }
		]
	},
	{
		slug: 'simulacion',
		name: 'Simulación y gemelos digitales',
		short: 'Simulación',
		icon: 'cube',
		tagline: 'Experimentar con el futuro antes de que ocurra.',
		seoDescription: 'Simulación, Monte Carlo y gemelos digitales con ciencia de datos: epidemias, cadenas de suministro, cultivos y plantas industriales.',
		lead: 'Una simulación es un modelo que reproduce cómo evoluciona un sistema: una epidemia, una cadena de suministro, un cultivo o una mente. La ciencia de datos la alimenta con datos reales, la calibra y, a su vez, aprende de los escenarios que genera.',
		what: 'Hay varias familias: Monte Carlo (miles de escenarios aleatorios para medir el riesgo), modelos basados en agentes (individuos que interactúan), eventos discretos (colas, procesos) y modelos físicos. Un gemelo digital es una simulación conectada en tiempo real a su equivalente físico mediante sensores.',
		relations: [
			{
				title: 'Datos que calibran la simulación',
				text: 'Los parámetros del modelo se estiman con datos reales.',
				explain: 'Una simulación solo es útil si se parece a la realidad. Con datos históricos se estiman sus parámetros (tasas de contagio, tiempos de proceso, rendimientos) y se valida comparando lo simulado con lo observado.'
			},
			{
				title: 'Simulaciones que generan datos',
				text: 'Datos sintéticos para entrenar modelos cuando los reales escasean.',
				explain: 'Las averías graves, los accidentes o las crisis son raros: hay pocos datos reales. Una simulación puede generar miles de casos sintéticos para entrenar modelos de detección, siempre validándolos después con datos reales.'
			},
			{
				title: 'Machine learning que acelera la simulación',
				text: 'Modelos sustitutos que emulan simulaciones costosas en milisegundos.',
				explain: 'Algunas simulaciones tardan horas. Un modelo de ML entrenado con sus resultados (surrogate) responde casi al instante, lo que permite explorar miles de escenarios u optimizar decisiones en tiempo real.'
			}
		],
		pipeline: [
			{ title: 'Pregunta', text: '¿Qué escenario queremos explorar?' },
			{ title: 'Modelo conceptual', text: 'Entidades, reglas y supuestos.' },
			{ title: 'Calibración', text: 'Parámetros estimados con datos reales.' },
			{ title: 'Validación', text: 'Lo simulado reproduce lo observado.' },
			{ title: 'Escenarios', text: 'Miles de corridas what-if.' },
			{ title: 'Decisión', text: 'Riesgos e incertidumbre cuantificados.' }
		],
		dataTypes: ['Datos históricos', 'Parámetros estimados', 'Escenarios sintéticos', 'Distribuciones de resultados', 'Telemetría en tiempo real'],
		apps: {
			psicologia: [
				{ title: 'Pacientes virtuales', text: 'Simuladores conversacionales para que terapeutas en formación practiquen la entrevista clínica.', data: 'Transcripciones y decisiones del estudiante', technique: 'Procesamiento de lenguaje natural' },
				{ title: 'Modelos computacionales de la cognición', text: 'Simular cómo se aprende o se decide para contrastar teorías con datos.', data: 'Respuestas y tiempos en tareas experimentales', technique: 'Ajuste de modelos (aprendizaje por refuerzo, modelos de difusión)' },
				{ title: 'Difusión de conductas en redes', text: 'Modelos de agentes sobre cómo se propagan hábitos o el estigma en una comunidad.', data: 'Redes sociales y encuestas', technique: 'Modelos basados en agentes' }
			],
			salud: [
				{ title: 'Epidemiología', text: 'Proyectar una epidemia y comparar el efecto de distintas intervenciones.', data: 'Casos, hospitalizaciones, movilidad', technique: 'Modelos compartimentales (SIR/SEIR) calibrados' },
				{ title: 'Flujo hospitalario', text: 'Simular urgencias o quirófanos para reducir esperas.', data: 'Llegadas, tiempos de atención, recursos', technique: 'Simulación de eventos discretos' },
				{ title: 'Ensayos in silico', text: 'Poblaciones virtuales para explorar dosis o diseños de ensayo.', data: 'Datos clínicos y farmacológicos', technique: 'Modelos farmacocinéticos y Monte Carlo' }
			],
			educacion: [
				{ title: 'Simuladores de formación', text: 'Desde vuelo hasta negociación: practicar decisiones con consecuencias simuladas.', data: 'Decisiones y resultados', technique: 'Evaluación de desempeño' },
				{ title: 'Planificación institucional', text: 'Simular matrícula, plazas y abandono bajo distintas políticas.', data: 'Histórico de matrícula y egreso', technique: 'Dinámica de sistemas' }
			],
			industria: [
				{ title: 'Gemelo digital de una línea', text: 'Réplica virtual que se actualiza con los sensores y permite probar cambios sin parar la producción.', data: 'Telemetría IoT', technique: 'Simulación + modelos predictivos' },
				{ title: 'Optimización de procesos', text: 'Encontrar la configuración óptima con pocos ensayos reales.', data: 'Parámetros y rendimiento', technique: 'Modelos sustitutos y optimización bayesiana' },
				{ title: 'Datos sintéticos de fallos', text: 'Generar ejemplos de averías raras para entrenar detectores.', data: 'Simulaciones físicas', technique: 'Aprendizaje supervisado con datos sintéticos' }
			],
			agro: [
				{ title: 'Modelos de crecimiento de cultivos', text: 'Proyectar el rendimiento según clima, suelo y manejo.', data: 'Meteorología, suelo, fenología', technique: 'Modelos de cultivo + ML' },
				{ title: 'Escenarios climáticos y de riego', text: 'Comparar estrategias de riego ante sequía.', data: 'Pronósticos climáticos, disponibilidad de agua', technique: 'Monte Carlo y optimización' }
			],
			empresa: [
				{ title: 'Riesgo financiero (Monte Carlo)', text: 'Miles de escenarios para estimar pérdidas posibles y su probabilidad.', data: 'Precios, volatilidades, correlaciones', technique: 'Simulación Monte Carlo' },
				{ title: 'Cadena de suministro', text: 'Probar el impacto de un retraso o de un nuevo almacén antes de decidir.', data: 'Pedidos, inventario, tiempos logísticos', technique: 'Eventos discretos' },
				{ title: 'Política económica', text: 'Modelos de agentes para anticipar efectos de impuestos o subsidios.', data: 'Microdatos de hogares y empresas', technique: 'Modelos basados en agentes' }
			],
			investigacion: [
				{ title: 'Experimentos in silico', text: 'Explorar hipótesis antes de invertir en un experimento real.', data: 'Parámetros de la literatura', technique: 'Simulación y análisis de sensibilidad' },
				{ title: 'Potencia estadística por simulación', text: 'Simular el estudio para saber cuántos participantes hacen falta.', data: 'Tamaños del efecto esperados', technique: 'Análisis de potencia por Monte Carlo' }
			]
		},
		challenges: [
			{ title: 'Validación', text: 'Un modelo elegante pero no validado da respuestas precisas… y equivocadas.' },
			{ title: 'Supuestos ocultos', text: 'Cada simulación descansa en supuestos que deben documentarse y comunicarse.' },
			{ title: 'Coste computacional', text: 'Las simulaciones detalladas exigen infraestructura o modelos sustitutos.' }
		]
	},
	{
		slug: 'iot',
		name: 'IoT y sensores',
		short: 'IoT y sensores',
		icon: 'sensor',
		tagline: 'Medir el mundo real de forma continua y actuar a tiempo.',
		seoDescription: 'IoT y sensores con ciencia de datos: monitorización remota de pacientes, riego de precisión, mantenimiento predictivo y fenotipado digital.',
		lead: 'El Internet de las Cosas (IoT) conecta sensores —de temperatura, humedad, vibración, movimiento, ritmo cardiaco— que envían datos de forma continua. La ciencia de datos los convierte en alertas, pronósticos y decisiones automáticas, a veces en el propio dispositivo (edge ML).',
		what: 'Un sistema IoT tiene cuatro capas: sensores que miden, una pasarela o el propio dispositivo que preprocesa, una plataforma que recibe y almacena las series temporales (por ejemplo vía MQTT) y modelos que detectan patrones y disparan acciones.',
		relations: [
			{
				title: 'Sensores como fuente de datos continua',
				text: 'Series temporales de alta frecuencia en lugar de mediciones puntuales.',
				explain: 'En lugar de una medición al mes, miles al día. Eso permite ver tendencias, ciclos y cambios bruscos que una medición puntual nunca capturaría, pero exige limpiar ruido, datos faltantes y sensores descalibrados.'
			},
			{
				title: 'Modelos que vigilan y anticipan',
				text: 'Detección de anomalías y pronósticos sobre cada flujo de datos.',
				explain: 'Para cada sensor se aprende su comportamiento normal (diario, estacional) y se avisa cuando se desvía. Los modelos de pronóstico anticipan cuándo una variable cruzará un umbral: regar antes de que el suelo se seque, revisar antes de que la máquina falle.'
			},
			{
				title: 'Inteligencia en el borde (edge)',
				text: 'Modelos ligeros que deciden en el propio dispositivo.',
				explain: 'Cuando la respuesta debe ser inmediata o la conectividad es mala (campo, quirófano, línea industrial), el modelo se ejecuta en el sensor o la pasarela. Solo se envían a la nube los resúmenes o las alertas, lo que además protege la privacidad.'
			}
		],
		pipeline: [
			{ title: 'Sensores', text: 'Miden variables físicas o fisiológicas.' },
			{ title: 'Edge', text: 'Filtrado y primeras decisiones locales.' },
			{ title: 'Ingesta', text: 'Mensajería (MQTT) y almacenamiento.' },
			{ title: 'Calidad', text: 'Ruido, huecos y calibración.' },
			{ title: 'Modelos', text: 'Anomalías, pronósticos, clasificación.' },
			{ title: 'Acción', text: 'Alertas, automatismos y paneles.' }
		],
		dataTypes: ['Temperatura y humedad', 'Vibración', 'Ritmo cardiaco', 'Acelerometría', 'GPS', 'Consumo eléctrico', 'Imágenes (dron, cámara)', 'Calidad del aire'],
		apps: {
			psicologia: [
				{ title: 'Fenotipado digital', text: 'Sueño, actividad y movilidad del móvil como indicadores del estado de ánimo, con consentimiento explícito.', data: 'Acelerometría, GPS agregado, uso del teléfono', technique: 'Series temporales y modelos personalizados' },
				{ title: 'Estrés y regulación emocional', text: 'Pulseras que detectan picos de activación y sugieren ejercicios de regulación.', data: 'Actividad electrodérmica, variabilidad cardiaca', technique: 'Detección de eventos en señales fisiológicas' },
				{ title: 'Biofeedback', text: 'Visualizar en tiempo real la propia respiración o ritmo cardiaco para aprender a regularlos.', data: 'Respiración, HRV', technique: 'Procesamiento de señales en tiempo real' }
			],
			salud: [
				{ title: 'Monitorización remota de pacientes', text: 'Wearables que avisan si las constantes se desvían de la línea base personal.', data: 'Frecuencia cardiaca, SpO₂, presión arterial, peso', technique: 'Detección de anomalías personalizada' },
				{ title: 'Detección de caídas', text: 'Acelerómetros que reconocen una caída y avisan a la familia o al servicio de emergencias.', data: 'Acelerometría y giroscopio', technique: 'Clasificación de patrones de movimiento' },
				{ title: 'Hospital conectado', text: 'Ubicación de equipos, cadena de frío de medicamentos y alertas tempranas en planta.', data: 'Temperatura, RFID, constantes', technique: 'Reglas + modelos de alerta temprana' }
			],
			educacion: [
				{ title: 'Aulas saludables', text: 'Sensores de CO₂ que indican cuándo ventilar para mantener la concentración.', data: 'CO₂, temperatura, ruido', technique: 'Pronóstico y alertas' },
				{ title: 'Campus inteligente', text: 'Ocupación de espacios y consumo energético para planificar mejor.', data: 'Aforo, consumo', technique: 'Pronóstico de demanda' }
			],
			industria: [
				{ title: 'Mantenimiento predictivo', text: 'Vibración y temperatura que anticipan la avería de un equipo.', data: 'Vibración, temperatura, corriente', technique: 'Detección de anomalías y vida útil remanente' },
				{ title: 'Eficiencia energética', text: 'Medir el consumo de cada máquina y detectar derroches.', data: 'Consumo eléctrico por equipo', technique: 'Regresión y desagregación de consumo' },
				{ title: 'Seguridad laboral', text: 'Detección de gases, fatiga o zonas de riesgo.', data: 'Sensores ambientales y wearables', technique: 'Alertas en tiempo real' }
			],
			agro: [
				{ title: 'Riego de precisión', text: 'Regar solo cuando y donde el suelo lo necesita.', data: 'Humedad del suelo, meteorología', technique: 'Pronóstico de humedad y optimización' },
				{ title: 'Monitoreo de cultivos con drones y satélite', text: 'Mapas de vigor (NDVI) que revelan estrés hídrico o plagas antes de verlas a simple vista.', data: 'Imágenes multiespectrales', technique: 'Visión por computador y análisis geoespacial' },
				{ title: 'Ganadería de precisión', text: 'Collares que detectan celo, enfermedad o estrés térmico en el ganado.', data: 'Actividad, rumia, temperatura', technique: 'Clasificación de comportamiento' }
			],
			empresa: [
				{ title: 'Logística y cadena de frío', text: 'Rastrear flotas y garantizar la temperatura de productos sensibles.', data: 'GPS, temperatura', technique: 'Optimización de rutas y alertas' },
				{ title: 'Retail y espacios', text: 'Aforo y flujo de personas para dimensionar personal y horarios.', data: 'Contadores de personas (agregados)', technique: 'Pronóstico de afluencia' },
				{ title: 'Edificios inteligentes', text: 'Climatización que aprende los patrones de uso.', data: 'Ocupación, temperatura, consumo', technique: 'Control predictivo' }
			],
			investigacion: [
				{ title: 'Estudios en la vida real', text: 'Medir conducta y fisiología fuera del laboratorio, durante semanas.', data: 'Wearables y smartphones', technique: 'Modelos multinivel para datos intensivos' },
				{ title: 'Ciencia ambiental', text: 'Redes de sensores de calidad del aire o del agua.', data: 'Contaminantes, meteorología', technique: 'Modelos espacio-temporales' }
			]
		},
		challenges: [
			{ title: 'Calidad de los datos', text: 'Sensores que se descalibran, se desconectan o miden ruido: la limpieza es la mitad del trabajo.' },
			{ title: 'Seguridad', text: 'Cada dispositivo conectado es una puerta de entrada que hay que proteger.' },
			{ title: 'Privacidad', text: 'Datos continuos de personas (ubicación, salud) exigen agregación y consentimiento.' }
		]
	}
];

export const techBySlug = (slug: string) => technologies.find((t) => t.slug === slug);

/** Paso de un caso integrado: qué aporta cada pieza. */
export interface IntegratedStep {
	role: 'iot' | 'datos' | 'simulacion' | 'xr';
	text: string;
}

export interface IntegratedCase {
	title: string;
	summary: string;
	steps: IntegratedStep[];
	outcome: string;
	kpis: string[];
}

export const stepRoles: Record<IntegratedStep['role'], { label: string; icon: IconName }> = {
	iot: { label: 'Sensores / IoT', icon: 'sensor' },
	datos: { label: 'Ciencia de datos', icon: 'brain' },
	simulacion: { label: 'Simulación', icon: 'cube' },
	xr: { label: 'Realidad extendida', icon: 'vr' }
};

/** Un escenario por sector donde las tres tecnologías trabajan juntas con la ciencia de datos. */
export const integratedCases: Record<SectorKey, IntegratedCase> = {
	psicologia: {
		title: 'Programa de manejo de la ansiedad con seguimiento continuo',
		summary: 'Un servicio de psicología combina sesiones de exposición en realidad virtual con un seguimiento entre sesiones mediante wearable y app.',
		steps: [
			{ role: 'iot', text: 'Una pulsera registra sueño, actividad y variabilidad cardiaca; la app recoge el estado de ánimo dos veces al día.' },
			{ role: 'datos', text: 'Un modelo personalizado detecta semanas de mayor activación y resume los patrones para la sesión.' },
			{ role: 'simulacion', text: 'Pacientes virtuales permiten a los terapeutas en formación practicar el protocolo antes de aplicarlo.' },
			{ role: 'xr', text: 'La exposición en VR se gradúa según la ansiedad medida en la propia sesión.' }
		],
		outcome: 'El terapeuta llega a cada sesión con información objetiva de la semana y ajusta el tratamiento con evidencia, no solo con el recuerdo del paciente.',
		kpis: ['Reducción de síntomas por sesión', 'Adherencia al registro diario', 'Abandono del tratamiento']
	},
	salud: {
		title: 'Hospital en casa para pacientes crónicos',
		summary: 'Pacientes con insuficiencia cardiaca son seguidos en su domicilio con dispositivos conectados.',
		steps: [
			{ role: 'iot', text: 'Báscula, tensiómetro y reloj envían a diario peso, presión y frecuencia cardiaca.' },
			{ role: 'datos', text: 'Un modelo compara cada lectura con la línea base del paciente y prioriza a quién llamar hoy.' },
			{ role: 'simulacion', text: 'Una simulación del servicio estima cuántas enfermeras hacen falta según el número de pacientes.' },
			{ role: 'xr', text: 'La rehabilitación cardiaca se hace con ejercicios guiados en realidad virtual desde casa.' }
		],
		outcome: 'Las descompensaciones se detectan días antes, el equipo se dimensiona con datos y el paciente sigue su rehabilitación sin desplazarse.',
		kpis: ['Reingresos a 30 días', 'Días de antelación de la alerta', 'Carga de trabajo por enfermera']
	},
	educacion: {
		title: 'Campus que aprende de sus estudiantes',
		summary: 'Una universidad integra datos académicos, de espacios y de laboratorios virtuales para apoyar a sus estudiantes.',
		steps: [
			{ role: 'iot', text: 'Sensores de CO₂ y ocupación ajustan la ventilación y el uso de las aulas.' },
			{ role: 'datos', text: 'Un modelo de alerta temprana combina asistencia, notas y actividad en la plataforma virtual.' },
			{ role: 'simulacion', text: 'Se simulan escenarios de matrícula para planificar grupos y profesorado.' },
			{ role: 'xr', text: 'Laboratorios virtuales permiten practicar sin límite y registran cada intento.' }
		],
		outcome: 'Las tutorías llegan a tiempo a quien las necesita y los recursos (aulas, docentes, laboratorios) se planifican con datos.',
		kpis: ['Retención por cohorte', 'Alertas atendidas a tiempo', 'Uso de laboratorios virtuales']
	},
	industria: {
		title: 'Gemelo digital de una línea de producción',
		summary: 'Una planta conecta su línea a un gemelo digital que predice averías y prueba cambios sin detener la producción.',
		steps: [
			{ role: 'iot', text: 'Sensores de vibración, temperatura y consumo en cada equipo envían datos cada segundo.' },
			{ role: 'datos', text: 'Modelos de anomalías estiman la vida útil remanente de cada componente.' },
			{ role: 'simulacion', text: 'El gemelo digital simula el impacto de parar un equipo o cambiar la secuencia de producción.' },
			{ role: 'xr', text: 'El técnico ve con AR el estado del equipo y las instrucciones de reparación sobre la propia máquina.' }
		],
		outcome: 'El mantenimiento se programa en el mejor momento, con la pieza y el técnico preparados, y sin paradas inesperadas.',
		kpis: ['Paradas no planificadas', 'Tiempo medio de reparación', 'Disponibilidad (OEE)']
	},
	agro: {
		title: 'Finca de precisión',
		summary: 'Una explotación agrícola integra sensores de suelo, drones y modelos de cultivo para decidir riego y cosecha.',
		steps: [
			{ role: 'iot', text: 'Sondas de humedad y una estación meteorológica miden cada hora; un dron vuela cada semana.' },
			{ role: 'datos', text: 'Modelos de visión detectan zonas de bajo vigor y un pronóstico anticipa el estrés hídrico.' },
			{ role: 'simulacion', text: 'Un modelo de cultivo compara estrategias de riego bajo distintos escenarios de lluvia.' },
			{ role: 'xr', text: 'En el campo, la AR muestra sobre la parcela las zonas a revisar y el historial de cada sector.' }
		],
		outcome: 'Se riega y se fertiliza solo donde hace falta, y la cosecha se planifica con una estimación de rendimiento por parcela.',
		kpis: ['Agua por kilo producido', 'Error de la estimación de cosecha', 'Días de antelación en plagas']
	},
	empresa: {
		title: 'Cadena de suministro resiliente',
		summary: 'Una empresa de distribución conecta su logística, sus pronósticos y sus simulaciones de escenarios.',
		steps: [
			{ role: 'iot', text: 'GPS y sensores de temperatura en camiones y almacenes; contadores de afluencia en tiendas.' },
			{ role: 'datos', text: 'Pronóstico de demanda por tienda y producto, actualizado cada día.' },
			{ role: 'simulacion', text: 'Monte Carlo y eventos discretos evalúan el riesgo de roturas de stock ante retrasos.' },
			{ role: 'xr', text: 'Los operarios de almacén reciben con AR la ruta de preparación de pedidos óptima.' }
		],
		outcome: 'Menos inventario inmovilizado, menos roturas de stock y planes de contingencia probados antes de necesitarlos.',
		kpis: ['Error de pronóstico (MAPE)', 'Roturas de stock', 'Tiempo de preparación de pedidos']
	},
	investigacion: {
		title: 'Laboratorio de conducta en el mundo real',
		summary: 'Un grupo de investigación estudia estrés y toma de decisiones combinando laboratorio virtual y medición en la vida diaria.',
		steps: [
			{ role: 'iot', text: 'Wearables y móviles registran fisiología y contexto durante semanas, con consentimiento.' },
			{ role: 'datos', text: 'Modelos multinivel separan lo que varía entre personas de lo que varía dentro de cada persona.' },
			{ role: 'simulacion', text: 'Un análisis de potencia por simulación define cuántos participantes y días hacen falta.' },
			{ role: 'xr', text: 'Tareas de decisión en VR, idénticas para todos, en condiciones controladas.' }
		],
		outcome: 'Resultados más generalizables (laboratorio + vida real) y reproducibles, con código, datos y modelos versionados.',
		kpis: ['Potencia estadística', 'Tasa de datos válidos', 'Reproducibilidad del análisis']
	}
};
