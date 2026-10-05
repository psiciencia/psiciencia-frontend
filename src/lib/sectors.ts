// Contenido de los sectores: tarjetas de la landing y páginas /sectores/<slug>.
export type SectorIcon =
	| 'brain'
	| 'school'
	| 'briefcase'
	| 'factory'
	| 'heart'
	| 'coins'
	| 'megaphone'
	| 'landmark'
	| 'leaf';

export interface UseCase {
	title: string;
	text: string;
	technique: string;
	explain: string;
}

export interface Sector {
	slug: string;
	name: string;
	icon: SectorIcon;
	tagline: string;
	summary: string;
	examples: string[];
	/** Solo los sectores con página propia. */
	page?: {
		headline: string;
		lead: string;
		challenges: { title: string; text: string }[];
		useCases: UseCase[];
		metrics: { name: string; text: string }[];
		techniques: string[];
	};
}

export const sectors: Sector[] = [
	{
		slug: 'psicologia',
		name: 'Psicología',
		icon: 'brain',
		tagline: 'Medir mejor, intervenir antes y con evidencia.',
		summary:
			'La psicología genera datos valiosos: cuestionarios, sesiones, diarios, textos, señales fisiológicas. La ciencia de datos ayuda a validar instrumentos, seguir la evolución de cada paciente y apoyar decisiones clínicas, siempre con supervisión profesional.',
		examples: ['Seguimiento de resultados terapéuticos', 'Validación de tests psicométricos', 'Prevención de burnout']
	},
	{
		slug: 'educacion',
		name: 'Educación',
		icon: 'school',
		tagline: 'Detectar a tiempo a quien necesita apoyo.',
		summary:
			'Instituciones educativas que usan sus datos académicos para anticipar el abandono, personalizar el aprendizaje y evaluar qué intervenciones funcionan.',
		examples: ['Alerta temprana de abandono', 'Analítica del aprendizaje', 'Evaluación de programas'],
		page: {
			headline: 'Ciencia de datos para la educación',
			lead: 'Las instituciones educativas acumulan datos de asistencia, calificaciones y uso de plataformas virtuales. Bien analizados, permiten actuar antes de que un estudiante abandone y medir qué estrategias pedagógicas funcionan de verdad.',
			challenges: [
				{ title: 'Abandono detectado tarde', text: 'Cuando el abandono aparece en los registros, ya es demasiado tarde para intervenir.' },
				{ title: 'Datos dispersos', text: 'Notas, asistencia y plataforma virtual viven en sistemas distintos que nadie cruza.' },
				{ title: 'Intervenciones sin evaluar', text: 'Tutorías y programas de apoyo se mantienen sin saber si mejoran los resultados.' }
			],
			useCases: [
				{
					title: 'Alerta temprana de abandono',
					text: 'Un modelo estima el riesgo de cada estudiante en las primeras semanas del curso.',
					technique: 'Clasificación (regresión logística, gradient boosting)',
					explain: 'Con datos de cohortes anteriores se entrena un modelo que aprende qué patrones precedieron al abandono: inasistencias, notas del primer parcial, entregas tardías. El resultado es una lista priorizada para el equipo de tutorías, no una etiqueta para el estudiante.'
				},
				{
					title: 'Analítica del aprendizaje',
					text: 'Patrones de uso de la plataforma que anticipan el rendimiento.',
					technique: 'Clustering y series temporales',
					explain: 'Agrupando a los estudiantes según cómo interactúan con los materiales (cuándo estudian, cuánto, qué recursos usan) aparecen perfiles que ayudan a diseñar apoyos específicos para cada grupo.'
				},
				{
					title: 'Evaluación de programas',
					text: '¿La tutoría mejoró la retención? Medirlo con rigor.',
					technique: 'Inferencia causal (diferencias en diferencias, emparejamiento)',
					explain: 'Comparar a quienes recibieron un programa con quienes no lo recibieron no basta: los grupos suelen ser distintos de partida. Las técnicas de inferencia causal estiman el efecto real del programa controlando esas diferencias.'
				},
				{
					title: 'Personalización de contenidos',
					text: 'Recomendar ejercicios según el nivel de cada estudiante.',
					technique: 'Sistemas de recomendación, teoría de respuesta al ítem',
					explain: 'La teoría de respuesta al ítem estima a la vez la dificultad de cada ejercicio y la habilidad de cada estudiante. Con eso se pueden proponer ejercicios ni demasiado fáciles ni demasiado difíciles.'
				}
			],
			metrics: [
				{ name: 'Recall del modelo', text: 'Qué proporción de los estudiantes que abandonaron fue detectada a tiempo.' },
				{ name: 'Tasa de retención', text: 'Evolución por cohorte antes y después de las intervenciones.' },
				{ name: 'Equidad', text: 'Que el modelo funcione igual de bien en todos los grupos de estudiantes.' }
			],
			techniques: ['Regresión logística', 'Gradient boosting', 'Clustering', 'Teoría de respuesta al ítem', 'Inferencia causal', 'Series temporales']
		}
	},
	{
		slug: 'empresa',
		name: 'Empresa',
		icon: 'briefcase',
		tagline: 'Decisiones de negocio basadas en evidencia.',
		summary:
			'Pronóstico de demanda, segmentación de clientes, prevención de fuga y precios: la ciencia de datos convierte los datos de ventas y clientes en decisiones medibles.',
		examples: ['Pronóstico de demanda', 'Prevención de fuga de clientes', 'Segmentación y precios'],
		page: {
			headline: 'Ciencia de datos para la empresa',
			lead: 'Ventas, clientes, inventario y marketing generan datos todos los días. La ciencia de datos los convierte en pronósticos, segmentos y alertas que ayudan a decidir con menos incertidumbre.',
			challenges: [
				{ title: 'Inventario descuadrado', text: 'Exceso de stock en unos productos y roturas en otros por planificar "a ojo".' },
				{ title: 'Clientes que se van sin avisar', text: 'La fuga se detecta cuando el cliente ya canceló.' },
				{ title: 'Reportes que no deciden', text: 'Muchos dashboards describen el pasado pero no anticipan el futuro.' }
			],
			useCases: [
				{
					title: 'Pronóstico de demanda',
					text: 'Anticipar ventas por producto, tienda y mes.',
					technique: 'Series temporales (ETS, Prophet, gradient boosting)',
					explain: 'Un modelo de series temporales separa tendencia, estacionalidad y efectos especiales (festivos, promociones). El pronóstico alimenta compras e inventario y se compara cada mes con la realidad para reentrenar.'
				},
				{
					title: 'Prevención de fuga (churn)',
					text: 'Identificar qué clientes tienen alta probabilidad de irse.',
					technique: 'Clasificación y análisis de supervivencia',
					explain: 'El modelo aprende de clientes que se fueron en el pasado (menos uso, reclamos, cambios de plan) y puntúa a los actuales. El equipo comercial prioriza a quienes tienen más riesgo y más valor.'
				},
				{
					title: 'Segmentación de clientes',
					text: 'Grupos con necesidades y comportamientos parecidos.',
					technique: 'Clustering (k-means, RFM)',
					explain: 'La segmentación RFM (recencia, frecuencia, valor monetario) o el clustering agrupan a los clientes para personalizar ofertas y comunicación, en lugar de tratar a todos igual.'
				},
				{
					title: 'Precios y valoración',
					text: 'Estimar el precio justo de un producto o un activo.',
					technique: 'Regresión (como el modelo de viviendas de esta plataforma)',
					explain: 'Es exactamente lo que hace el modelo housing_model de esta plataforma: estimar un precio a partir de características. Con el análisis what-if se ve cómo cambia el precio al modificar cada variable.'
				}
			],
			metrics: [
				{ name: 'Error de pronóstico (MAPE)', text: 'Error porcentual medio entre lo pronosticado y lo vendido.' },
				{ name: 'Lift del modelo de churn', text: 'Cuántas veces más fugas encuentra el modelo que una selección al azar.' },
				{ name: 'Impacto en negocio', text: 'Ahorro en inventario o clientes retenidos, medido con un grupo de control.' }
			],
			techniques: ['Series temporales', 'Clasificación', 'Análisis de supervivencia', 'Clustering / RFM', 'Regresión', 'Tests A/B']
		}
	},
	{
		slug: 'industria',
		name: 'Industria',
		icon: 'factory',
		tagline: 'Máquinas que avisan antes de fallar.',
		summary:
			'Sensores, líneas de producción y consumo energético: modelos que anticipan averías, detectan defectos y optimizan procesos.',
		examples: ['Mantenimiento predictivo', 'Control de calidad', 'Eficiencia energética'],
		page: {
			headline: 'Ciencia de datos para la industria',
			lead: 'Las plantas industriales ya registran miles de lecturas por minuto de vibración, temperatura o consumo. La ciencia de datos convierte esas señales en alertas tempranas, menos paradas no planificadas y procesos más eficientes.',
			challenges: [
				{ title: 'Paradas no planificadas', text: 'Una avería inesperada detiene la línea y dispara los costos.' },
				{ title: 'Mantenimiento por calendario', text: 'Se cambian piezas que aún funcionan… y fallan otras que no tocaban.' },
				{ title: 'Defectos detectados al final', text: 'La inspección manual llega tarde y no escala.' }
			],
			useCases: [
				{
					title: 'Mantenimiento predictivo',
					text: 'Detectar la degradación de un equipo antes de la avería.',
					technique: 'Detección de anomalías, modelos de vida útil remanente',
					explain: 'Un modelo aprende cómo es la señal normal de cada máquina. Cuando la vibración o la temperatura empiezan a desviarse de ese patrón, genera una alerta con horas o días de antelación, antes de que la señal cruce el umbral de alarma tradicional.'
				},
				{
					title: 'Control de calidad automático',
					text: 'Inspección visual de piezas con visión por computador.',
					technique: 'Redes neuronales convolucionales',
					explain: 'Cámaras en la línea toman imágenes de cada pieza y un modelo de visión clasifica si tiene defectos (grietas, rayas, deformaciones). Inspecciona el 100 % de la producción y deja a las personas los casos dudosos.'
				},
				{
					title: 'Eficiencia energética',
					text: 'Predecir y reducir el consumo de la planta.',
					technique: 'Regresión y optimización',
					explain: 'Modelando el consumo en función de la producción, la temperatura y el horario, se detectan derroches y se planifican los procesos intensivos en las horas de energía más barata.'
				},
				{
					title: 'Optimización de procesos',
					text: 'Ajustar parámetros de máquina para maximizar el rendimiento.',
					technique: 'Modelos sustitutos y optimización bayesiana',
					explain: 'En lugar de probar combinaciones de parámetros en la línea real, se entrena un modelo con datos históricos y se usa para buscar la configuración que maximiza el rendimiento con el mínimo de ensayos.'
				}
			],
			metrics: [
				{ name: 'Antelación de la alerta', text: 'Horas entre la alerta del modelo y el fallo o la alarma tradicional.' },
				{ name: 'Falsas alarmas', text: 'Alertas que no correspondían a un problema real (precisión del modelo).' },
				{ name: 'Disponibilidad (OEE)', text: 'Tiempo productivo de la línea antes y después del sistema predictivo.' }
			],
			techniques: ['Detección de anomalías', 'Series temporales', 'Visión por computador', 'Optimización bayesiana', 'Gemelos digitales', 'Edge ML']
		}
	},
	{
		slug: 'salud',
		name: 'Salud',
		icon: 'heart',
		tagline: 'Apoyo a la decisión clínica, del hospital al hogar.',
		summary:
			'Monitorización remota con wearables, predicción de reingresos, gestión de camas y análisis de imágenes médicas, siempre como apoyo al criterio clínico.',
		examples: ['Monitorización remota (IoT)', 'Riesgo de reingreso', 'Rehabilitación con realidad virtual'],
		page: {
			headline: 'Ciencia de datos para la salud',
			lead: 'La salud genera datos en el hospital (historias clínicas, imágenes, laboratorio) y, cada vez más, fuera de él (wearables, apps). La ciencia de datos los integra para anticipar complicaciones, organizar mejor los recursos y seguir a los pacientes en su vida diaria.',
			challenges: [
				{ title: 'Deterioro detectado tarde', text: 'Los cambios en un paciente crónico se ven en la consulta, semanas después.' },
				{ title: 'Recursos saturados', text: 'Urgencias, camas y quirófanos se planifican sin anticipar la demanda.' },
				{ title: 'Datos fragmentados', text: 'Información clínica, de laboratorio y de dispositivos en sistemas que no se hablan.' }
			],
			useCases: [
				{
					title: 'Monitorización remota de pacientes',
					text: 'Wearables que avisan cuando las constantes se desvían de la línea base personal.',
					technique: 'IoT + detección de anomalías personalizada',
					explain: 'En lugar de un umbral igual para todos, el modelo aprende la normalidad de cada paciente (su frecuencia cardiaca en reposo, su peso, su saturación) y alerta cuando la tendencia se aleja de ella. Es especialmente útil en insuficiencia cardiaca o EPOC.'
				},
				{
					title: 'Riesgo de reingreso',
					text: 'Identificar al alta a los pacientes con más probabilidad de volver.',
					technique: 'Clasificación (gradient boosting, regresión logística)',
					explain: 'Con datos del ingreso (diagnósticos, medicación, ingresos previos, apoyo social) se estima el riesgo de reingreso a 30 días. Los de mayor riesgo reciben seguimiento telefónico o una visita precoz.'
				},
				{
					title: 'Gestión de camas y urgencias',
					text: 'Pronóstico de demanda y simulación del flujo de pacientes.',
					technique: 'Series temporales + simulación de eventos discretos',
					explain: 'Un pronóstico estima cuántos pacientes llegarán cada día; una simulación prueba cómo cambian las esperas si se abre una consulta o se reorganiza el triaje, antes de hacerlo en la realidad.'
				},
				{
					title: 'Rehabilitación con realidad virtual',
					text: 'Ejercicios gamificados con medición objetiva del progreso.',
					technique: 'Realidad virtual + análisis de cinemática',
					explain: 'Los sensores del visor miden con precisión el rango y la velocidad de movimiento en cada sesión. El terapeuta ve la curva de recuperación y la dificultad se adapta al progreso del paciente.'
				}
			],
			metrics: [
				{ name: 'Sensibilidad de las alertas', text: 'Proporción de deterioros reales que el sistema detectó a tiempo.' },
				{ name: 'Falsas alarmas', text: 'Alertas innecesarias: si son muchas, el personal deja de atenderlas.' },
				{ name: 'Resultados clínicos', text: 'Reingresos, estancia media o tiempos de espera, medidos frente a un grupo de control.' }
			],
			techniques: ['Detección de anomalías', 'Clasificación', 'Series temporales', 'Simulación de eventos discretos', 'Visión por computador', 'Análisis de supervivencia']
		}
	},
	{
		slug: 'agro',
		name: 'Agro',
		icon: 'leaf',
		tagline: 'Producir más con menos agua y menos insumos.',
		summary:
			'Sensores de suelo, estaciones meteorológicas, drones y satélites: agricultura y ganadería de precisión basadas en datos.',
		examples: ['Riego de precisión (IoT)', 'Predicción de rendimiento', 'Detección temprana de plagas'],
		page: {
			headline: 'Ciencia de datos para el agro',
			lead: 'El campo se ha llenado de sensores: humedad del suelo, estaciones meteorológicas, collares en el ganado, drones e imágenes de satélite. La ciencia de datos convierte esas lecturas en decisiones de riego, fertilización y cosecha parcela a parcela.',
			challenges: [
				{ title: 'Agua escasa', text: 'Se riega por calendario, no según lo que el suelo y el cultivo necesitan.' },
				{ title: 'Plagas detectadas tarde', text: 'Cuando la plaga se ve a simple vista, el daño ya está hecho.' },
				{ title: 'Incertidumbre climática', text: 'Sequías y olas de calor cada vez más frecuentes complican la planificación.' }
			],
			useCases: [
				{
					title: 'Riego de precisión',
					text: 'Regar solo cuando el suelo lo necesita, según sensores y pronóstico.',
					technique: 'IoT + pronóstico de humedad',
					explain: 'Sondas a distintas profundidades miden la humedad del suelo. Un modelo combina esas lecturas con el pronóstico de lluvia y evapotranspiración y programa el riego justo antes de que el cultivo entre en estrés hídrico, sin regar cuando va a llover.'
				},
				{
					title: 'Mapas de vigor con drones y satélite',
					text: 'Índices como el NDVI revelan zonas con estrés antes de que se vean.',
					technique: 'Visión por computador y análisis geoespacial',
					explain: 'Las cámaras multiespectrales captan luz que el ojo no ve. El NDVI (índice de vegetación) cuantifica el vigor de cada zona: las manchas de bajo vigor señalan dónde revisar por plagas, falta de nutrientes o problemas de riego.'
				},
				{
					title: 'Predicción de rendimiento',
					text: 'Estimar la cosecha semanas antes para planificar logística y ventas.',
					technique: 'Regresión con datos climáticos y de imagen',
					explain: 'Un modelo aprende la relación entre clima, suelo, manejo e imágenes de temporadas anteriores y la cosecha obtenida. Con los datos de la temporada en curso proyecta el rendimiento por parcela.'
				},
				{
					title: 'Ganadería de precisión',
					text: 'Collares y sensores que detectan enfermedad, celo o estrés térmico.',
					technique: 'Clasificación de comportamiento animal',
					explain: 'Los acelerómetros registran cuánto come, rumia y se mueve cada animal. Cambios en esos patrones anticipan enfermedades o indican el momento óptimo de inseminación.'
				}
			],
			metrics: [
				{ name: 'Agua por kilo producido', text: 'Eficiencia del riego antes y después del sistema.' },
				{ name: 'Error de predicción de cosecha', text: 'Diferencia entre lo estimado y lo cosechado.' },
				{ name: 'Antelación en la detección', text: 'Días entre la alerta del modelo y la detección visual.' }
			],
			techniques: ['IoT y edge ML', 'Series temporales', 'Visión por computador', 'Análisis geoespacial', 'Modelos de cultivo', 'Optimización']
		}
	},
	{
		slug: 'finanzas',
		name: 'Finanzas',
		icon: 'coins',
		tagline: 'Riesgo y fraude bajo control.',
		summary: 'Scoring de crédito, detección de fraude en tiempo real y pronóstico de flujo de caja.',
		examples: ['Scoring crediticio', 'Detección de fraude', 'Flujo de caja']
	},
	{
		slug: 'marketing',
		name: 'Marketing',
		icon: 'megaphone',
		tagline: 'El mensaje correcto a la persona correcta.',
		summary: 'Atribución de campañas, recomendaciones personalizadas y análisis de sentimiento en redes sociales.',
		examples: ['Atribución de campañas', 'Recomendaciones', 'Análisis de sentimiento']
	},
	{
		slug: 'sector-publico',
		name: 'Sector público',
		icon: 'landmark',
		tagline: 'Políticas públicas basadas en evidencia.',
		summary: 'Focalización de programas sociales, planificación urbana y evaluación del impacto de políticas.',
		examples: ['Focalización de programas', 'Movilidad urbana', 'Evaluación de impacto']
	}
];

export const sectorBySlug = (slug: string) => sectors.find((s) => s.slug === slug);
