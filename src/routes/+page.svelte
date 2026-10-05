<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { faqPage, organization, website } from '#lib/seo.ts';
	import BarChart from '#lib/components/charts/BarChart.svelte';
	import LineChart from '#lib/components/charts/LineChart.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import HeroIllustration from '#lib/components/illustrations/HeroIllustration.svelte';
	import NetworkIllustration from '#lib/components/illustrations/NetworkIllustration.svelte';
	import Histogram from '#lib/components/charts/Histogram.svelte';
	import SectorIllustration from '#lib/components/illustrations/SectorIllustration.svelte';
	import Spotlight from '#lib/components/Spotlight.svelte';
	import CountUp from '#lib/components/CountUp.svelte';
	import LogoCarousel from '#lib/components/LogoCarousel.svelte';
	import { reveal } from '#lib/reveal.ts';
	import TechIllustration from '#lib/components/illustrations/TechIllustration.svelte';
	import { technologies } from '#lib/technologies.ts';
	import { formatMetric, formatNumber } from '#lib/format.ts';
	import { sectorBySlug, sectors } from '#lib/sectors.ts';
	import { clinicalMonitoring, demandForecast, dropoutRisk, vibration } from '#lib/showcase.ts';

	let { data } = $props();

	const psychologyAreas = [
		{
			icon: 'clipboard',
			title: 'Psicología clínica',
			text: 'Seguimiento sesión a sesión para detectar a tiempo a quien no está mejorando.',
			explain:
				'El seguimiento rutinario de resultados (ROM) aplica un cuestionario breve en cada sesión. Un modelo compara la evolución del paciente con la trayectoria esperada para casos similares y avisa al terapeuta si se desvía, para revisar el plan de tratamiento antes de que el paciente abandone.'
		},
		{
			icon: 'scale',
			title: 'Psicometría',
			text: 'Tests más fiables y válidos con análisis factorial y teoría de respuesta al ítem.',
			explain:
				'La psicometría es ciencia de datos aplicada a la medición: el análisis factorial comprueba que los ítems miden el constructo esperado, el alfa de Cronbach u omega estiman la fiabilidad, y la teoría de respuesta al ítem (TRI) permite tests adaptativos más cortos y precisos.'
		},
		{
			icon: 'flask',
			title: 'Investigación',
			text: 'Del análisis de experimentos al procesamiento de lenguaje natural sobre textos.',
			explain:
				'Modelos mixtos para datos longitudinales, tamaños del efecto y meta-análisis, y NLP para analizar entrevistas o diarios a gran escala. Además, la investigación reproducible (código y datos versionados) es exactamente lo que aporta una plataforma como MLflow.'
		},
		{
			icon: 'users',
			title: 'Psicología organizacional',
			text: 'Bienestar laboral, clima y prevención del burnout con people analytics.',
			explain:
				'Encuestas de clima y bienestar, combinadas de forma agregada y anónima, permiten identificar qué factores se asocian al burnout en cada área y priorizar intervenciones. La clave ética: resultados por equipos, nunca vigilancia individual.'
		}
	] as const;

	const ethics = [
		{ icon: 'hand', title: 'Consentimiento informado', text: 'Las personas saben qué datos se usan y para qué.' },
		{ icon: 'lock', title: 'Privacidad', text: 'Datos sensibles anonimizados, cifrados y con acceso mínimo.' },
		{ icon: 'eye', title: 'Supervisión humana', text: 'El modelo sugiere; el profesional decide.' },
		{ icon: 'scale', title: 'Equidad', text: 'Se comprueba que el modelo funcione igual para todos los grupos.' }
	] as const;

	const faqs = [
		{
			q: '¿Necesito muchos datos para empezar?',
			a: 'No siempre. Muchos proyectos útiles empiezan con los datos que ya existen (hojas de cálculo, sistemas de gestión, cuestionarios). El primer paso es un diagnóstico: qué datos hay, con qué calidad y qué pregunta pueden responder.'
		},
		{
			q: '¿Los modelos reemplazan al profesional?',
			a: 'No. Un modelo es una herramienta de apoyo: prioriza, alerta y cuantifica. La decisión final —clínica, pedagógica o de negocio— la toma una persona con el contexto completo. Por eso mostramos explicaciones y márgenes de error, no solo un número.'
		},
		{
			q: '¿Qué pasa con la privacidad de los datos?',
			a: 'Trabajamos con el principio de mínimo dato necesario: anonimización, acceso restringido y cumplimiento de la normativa de protección de datos aplicable. Los datos sensibles (como los de salud mental) requieren consentimiento explícito y medidas reforzadas.'
		},
		{
			q: '¿Cómo sé que el modelo sigue funcionando bien?',
			a: 'Con monitoreo continuo. Esta misma plataforma compara los datos nuevos con los de entrenamiento (drift) y registra cada versión del modelo con sus métricas, para reentrenar cuando el rendimiento cae.'
		},
		{
			q: '¿Cuánto tarda un proyecto?',
			a: 'Depende del alcance y del estado de los datos. Lo habitual es empezar con un piloto acotado, medir su impacto y escalar solo si aporta valor.'
		},
		{
			q: '¿Qué es exactamente la ciencia de datos?',
			a: 'Es la combinación de estadística, programación y conocimiento del dominio para extraer conocimiento de los datos y convertirlo en decisiones: desde un análisis descriptivo hasta un modelo de machine learning en producción.'
		}
	];

	const education = sectorBySlug('educacion')!;
	const business = sectorBySlug('empresa')!;
	const industry = sectorBySlug('industria')!;

	const r2 = $derived(data.model?.metrics.r2);
	const r2Points = $derived(
		(data.history?.versions ?? [])
			.filter((v) => v.metrics.r2 !== undefined)
			.map((v) => ({ x: v.version, y: v.metrics.r2, highlight: v.aliases.length ? `@${v.aliases[0]}` : undefined }))
	);
	const runsByExperiment = $derived(
		(data.platform?.experiments ?? []).map((e) => ({ label: e.name, value: e.runs })).sort((a, b) => b.value - a.value)
	);

	const services = [
		{
			icon: 'data',
			title: 'Ciencia de datos',
			text: 'Exploración, limpieza e ingeniería de variables para convertir datos crudos en señales útiles.',
			explain:
				'Antes de entrenar, los datos se analizan y se preparan: se detectan valores atípicos, se eligen las variables y se separa un conjunto de test que el modelo nunca ve durante el entrenamiento.\n\nEn este proyecto, los scripts src/prepare_*.py generan el dataset de entrenamiento y el de referencia que luego usa el monitoreo.'
		},
		{
			icon: 'brain',
			title: 'Machine learning',
			text: 'Modelos de regresión y clasificación evaluados con métricas claras y comparables entre versiones.',
			explain:
				'Cada entrenamiento es un "run" de MLflow: guarda los hiperparámetros (por ejemplo alpha o n_estimators), las métricas de test (R², MAE, MSE) y el propio modelo.\n\nAsí se puede comparar objetivamente qué configuración funciona mejor.'
		},
		{
			icon: 'rocket',
			title: 'MLOps',
			text: 'Del notebook a producción: modelos versionados, promovidos con alias y servidos por una API.',
			explain:
				'MLOps aplica a los modelos las prácticas de ingeniería de software: versiones, trazabilidad y despliegues reversibles.\n\nAquí el Model Registry de MLflow numera cada versión y el alias @champion indica cuál está en producción. Cambiar de modelo es mover el alias, sin tocar código.'
		},
		{
			icon: 'pulse',
			title: 'Monitoreo',
			text: 'Detección de drift para saber cuándo los datos reales dejan de parecerse a los de entrenamiento.',
			explain:
				'Un modelo se degrada en silencio cuando el mundo cambia: precios que suben, clientes distintos, sensores descalibrados.\n\nEvidently compara la distribución de los datos nuevos con la de referencia y avisa qué variables cambiaron, para decidir cuándo reentrenar.'
		}
	] as const;

	const steps = [
		{
			title: 'Datos',
			text: 'Se preparan el dataset de entrenamiento y el de referencia.',
			explain:
				'El dataset de entrenamiento incluye la variable objetivo (por ejemplo, el precio). El de referencia contiene solo las variables de entrada y sirve como "foto" de los datos normales para el monitoreo.'
		},
		{
			title: 'Experimentación',
			text: 'Cada entrenamiento queda registrado en MLflow.',
			explain:
				'mlflow.start_run() abre un run; log_param y log_metrics guardan la configuración y los resultados en PostgreSQL. Los archivos del modelo (model.pkl, MLmodel) se guardan en MinIO.'
		},
		{
			title: 'Registro',
			text: 'El mejor modelo se versiona y se promueve.',
			explain:
				'Con registered_model_name, MLflow crea una versión nueva (v1, v2…). Tras comparar métricas, el alias @champion se mueve a la versión elegida. Revertir es volver a mover el alias.'
		},
		{
			title: 'Servicio',
			text: 'FastAPI carga el modelo y esta web lo usa.',
			explain:
				'La API carga models:/<nombre>@champion desde MLflow y expone /predict. Esta interfaz (SvelteKit) llama a la API desde el servidor, así el navegador nunca accede directamente a ella.'
		},
		{
			title: 'Monitoreo',
			text: 'Se vigila que los datos no cambien.',
			explain:
				'Con nuevos datos se ejecuta un test estadístico por variable (Kolmogórov-Smirnov o chi-cuadrado). Si varias variables cambian de distribución, es señal de que el modelo debe reentrenarse.'
		}
	];

	const stack = [
		{ name: 'scikit-learn', role: 'Modelos de ML' },
		{ name: 'MLflow', role: 'Tracking y registry' },
		{ name: 'PostgreSQL', role: 'Metadatos' },
		{ name: 'MinIO', role: 'Artefactos (S3)' },
		{ name: 'FastAPI', role: 'API de inferencia' },
		{ name: 'Evidently', role: 'Drift de datos' },
		{ name: 'SvelteKit', role: 'Interfaz web' },
		{ name: 'Docker', role: 'Orquestación' }
	];
</script>

<Seo
	title="Ciencia de datos y machine learning"
	description="Ciencia de datos y machine learning en producción para psicología, salud, educación, empresa, industria y agro: modelos trazables y monitoreados."
	jsonLd={[organization(), website(), faqPage(faqs)]}
/>

<section class="hero">
	<div class="hero-text">
		<span class="eyebrow">Ciencia de datos · Machine learning · MLOps</span>
		<h1>Convertimos datos en modelos que funcionan en producción</h1>
		<p class="hero-lead">
			PsiCiencia Tech es una plataforma de ciencia de datos que cubre el ciclo de vida completo de un modelo:
			experimentación, registro, despliegue y monitoreo. Cada predicción se puede rastrear hasta el experimento que la
			originó.
		</p>
		<div class="ctas">
			<a class="button" href="/predict">Probar una predicción</a>
			<a class="button secondary" href="/model">Explorar el modelo</a>
		</div>
		<ul class="checks">
			<li>Experimentos trazables</li>
			<li>Modelos versionados</li>
			<li>Drift monitorizado</li>
		</ul>
	</div>
	<div class="hero-art">
		<HeroIllustration />
	</div>
</section>

<section aria-labelledby="numbers-title" class="block">
	<h2 id="numbers-title" class="section-title" use:reveal>La plataforma en números</h2>
	<div class="numbers">
		<InfoCard
			title="Precisión del modelo en producción"
			level={3}
			compact
			explain={'R² (coeficiente de determinación) indica qué proporción de la variación del valor real explica el modelo, medido en datos de test que no vio al entrenar.\n\n1 sería una predicción perfecta; 0, no mejor que predecir siempre la media.'}
		>
			<div class="hero-figure">{#if r2 !== undefined}<CountUp value={r2} format={formatMetric} duration={1600} />{:else}—{/if}</div>
			<p class="muted-note">R² en test · {data.model?.name ?? 'sin modelo'} v{data.model?.version ?? '?'}</p>
		</InfoCard>
		<InfoCard
			title="Experimentos"
			level={3}
			compact
			explain="Un experimento agrupa todos los entrenamientos de un mismo problema (por ejemplo, predecir precios de viviendas), para compararlos entre sí."
		>
			<div class="stat-value">{#if data.platform}<CountUp value={data.platform.experiments.length} />{:else}—{/if}</div>
		</InfoCard>
		<InfoCard
			title="Entrenamientos (runs)"
			level={3}
			compact
			explain="Cada run es una ejecución de entrenamiento con su configuración, métricas y artefactos guardados en MLflow. Más runs = más alternativas evaluadas."
		>
			<div class="stat-value">{#if data.platform}<CountUp value={data.platform.total_runs} />{:else}—{/if}</div>
		</InfoCard>
		<InfoCard
			title="Versiones registradas"
			level={3}
			compact
			explain="Modelos que pasaron al Model Registry. Cada versión es inmutable: si algo falla en producción, se puede volver a una versión anterior."
		>
			<div class="stat-value">{#if data.platform}<CountUp value={data.platform.total_versions} />{:else}—{/if}</div>
			<p class="muted-note">en {data.platform?.registered_models.length ?? '—'} modelos</p>
		</InfoCard>
	</div>
</section>

<LogoCarousel />

<section id="sectores" aria-labelledby="sectors-title" class="block">
	<span class="eyebrow">Sectores</span>
	<h2 use:reveal id="sectors-title" class="section-title">Ciencia de datos en todas las áreas</h2>
	<p class="section-lead">
		Los mismos principios —medir bien, modelar con rigor y vigilar en producción— sirven para pacientes, estudiantes,
		clientes o máquinas. Pasa el cursor por cada sector para ver cómo se aplica.
	</p>
	<div class="sector-grid" use:reveal>
		{#each sectors as sector (sector.slug)}
			<InfoCard title={sector.name} level={3} compact explain={sector.summary}>
				<div class="sector-head">
					<span class="service-icon small"><Icon name={sector.icon} size={22} /></span>
					<p class="sector-tagline">{sector.tagline}</p>
				</div>
				<ul class="sector-examples">
					{#each sector.examples as example (example)}<li>{example}</li>{/each}
				</ul>
				{#if sector.page || sector.slug === 'psicologia'}
					<a class="sector-link" href="/sectores/{sector.slug}">Ver casos de uso →</a>
				{/if}
			</InfoCard>
		{/each}
	</div>
	<p class="tech-more"><a href="/sectores">Ver la página de sectores: problemas comunes, comparativa y diagnóstico de madurez →</a></p>
</section>

<section aria-labelledby="psy-title" class="block psychology">
	<div class="psy-intro">
		<div>
			<span class="eyebrow">Sector destacado</span>
			<h2 use:reveal id="psy-title" class="section-title big">Psicología basada en datos</h2>
			<p class="psy-lead">
				La psicología siempre ha medido: cuestionarios, escalas, observaciones. Hoy además genera datos de apps, diarios
				digitales, textos y wearables. La ciencia de datos ayuda a convertir esa información en <strong
					>mejores instrumentos, alertas tempranas y decisiones con evidencia</strong
				>, sin sustituir el juicio clínico.
			</p>
			<div class="ctas">
				<a class="button" href="/sectores/psicologia">Explorar psicología y datos</a>
			</div>
		</div>
		<div class="psy-art"><SectorIllustration variant="psicologia" /></div>
	</div>

	<div class="psy-areas" use:reveal>
		{#each psychologyAreas as area (area.title)}
			<InfoCard title={area.title} level={3} compact explain={area.explain}>
				<div class="service-icon"><Icon name={area.icon} size={24} /></div>
				<p class="service-text">{area.text}</p>
			</InfoCard>
		{/each}
	</div>

	<div class="psy-example" use:reveal>
		<InfoCard
			title="Ejemplo: alerta temprana en psicoterapia"
			subtitle="Ejemplo ilustrativo · datos sintéticos de un paciente ficticio"
			explain={'Puntuación de síntomas (escala 0–27, más alto = peor) en cada sesión, frente a la trayectoria esperada para pacientes que empezaron con una puntuación parecida.\n\nEn la sesión 5 el paciente se aleja de lo esperado: el sistema lo señala y el terapeuta ajusta el plan. A partir de ahí la puntuación baja y cruza el punto de corte de 10, por debajo del cual los síntomas se consideran leves.'}
		>
			<LineChart
				points={clinicalMonitoring.patient}
				name="Paciente"
				secondary={{ name: 'Trayectoria esperada', points: clinicalMonitoring.expected }}
				yThreshold={{ value: clinicalMonitoring.cutoff, label: 'punto de corte (10)' }}
				marker={{ x: clinicalMonitoring.alertSession, label: 'alerta: fuera de trayectoria' }}
				yDomain={[0, 25]}
				format={(v) => formatNumber(v)}
				xFormat={(v) => `S${v}`}
				xName="Sesión"
				yName="Puntuación"
				height={240}
				ariaLabel="Puntuación de síntomas por sesión frente a la trayectoria esperada"
			/>
		</InfoCard>
		<div class="ethics">
			<h3>Ética primero</h3>
			<p class="service-text">Los datos psicológicos son de los más sensibles que existen. Cada proyecto se diseña con:</p>
			<ul>
				{#each ethics as item (item.title)}
					<li>
						<span class="service-icon small"><Icon name={item.icon} size={20} /></span>
						<span><strong>{item.title}.</strong> {item.text}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<section aria-labelledby="spot-title" class="block">
	<h2 use:reveal id="spot-title" class="section-title">Casos por sector</h2>
	<p class="section-lead">Tres ejemplos de cómo un modelo bien construido cambia el día a día de una organización.</p>

	<Spotlight
		sector={education}
		chartTitle="Riesgo de abandono por estudiante"
		chartExplain={'Cada barra agrupa a los estudiantes según la probabilidad de abandono que estima el modelo. La línea marca el umbral de alerta (0,6): quienes lo superan pasan a la lista de tutorías.\n\nEl modelo no decide quién abandona; prioriza a quién conviene llamar primero.'}
	>
		{#snippet chart()}
			<Histogram
				bins={dropoutRisk.bins}
				series={[{ name: 'Estudiantes', values: dropoutRisk.counts }]}
				format={(v) => String(Math.round(v))}
				marker={{ value: dropoutRisk.threshold, label: `alerta · ${dropoutRisk.flagged} de ${dropoutRisk.total}` }}
				height={170}
				ariaLabel="Distribución del riesgo de abandono estimado"
			/>
		{/snippet}
	</Spotlight>

	<Spotlight
		sector={business}
		reverse
		chartTitle="Demanda real vs. pronóstico"
		chartExplain={'Ventas mensuales reales (azul) y el pronóstico del modelo (naranja), que capta la tendencia y la estacionalidad y se extiende tres meses hacia adelante.\n\nCon ese horizonte, compras e inventario se planifican antes de que llegue el pico de demanda.'}
	>
		{#snippet chart()}
			<LineChart
				points={demandForecast.actual}
				name="Ventas reales"
				secondary={{ name: 'Pronóstico', points: demandForecast.forecast }}
				format={formatNumber}
				xFormat={(v) => `M${v}`}
				xName="Mes"
				yName="Unidades"
				height={190}
				ariaLabel="Ventas mensuales reales frente al pronóstico"
			/>
		{/snippet}
	</Spotlight>

	<Spotlight
		sector={industry}
		chartTitle="Vibración de un rodamiento"
		chartExplain={'Lectura de vibración (mm/s) de un sensor durante 72 horas. El umbral de alarma tradicional (4,5) salta tarde; el modelo de anomalías detecta el cambio de patrón horas antes (línea vertical).\n\nEsa antelación permite programar el mantenimiento en lugar de sufrir una parada.'}
	>
		{#snippet chart()}
			<LineChart
				points={vibration.points}
				yThreshold={{ value: vibration.alarm, label: 'alarma 4,5 mm/s' }}
				marker={{ x: vibration.earlyWarning, label: 'alerta del modelo' }}
				format={(v) => `${formatNumber(v)} mm/s`}
				xFormat={(v) => `${v} h`}
				xTicks="nice"
				xName="Hora"
				yName="Vibración"
				height={190}
				ariaLabel="Vibración del rodamiento por hora con umbral de alarma"
			/>
		{/snippet}
	</Spotlight>
</section>

<section aria-labelledby="tech-title" class="block">
	<span class="eyebrow">Tecnologías</span>
	<h2 use:reveal id="tech-title" class="section-title">Realidad extendida, simulación e IoT</h2>
	<p class="section-lead">
		Tres tecnologías que multiplican lo que la ciencia de datos puede hacer: medir el mundo real de forma continua, explorar
		escenarios antes de que ocurran y vivir experiencias inmersivas que generan datos y muestran resultados en contexto.
	</p>
	<div class="tech-grid" use:reveal>
		{#each technologies as tech (tech.slug)}
			<a class="tech-tile" href="/tecnologias/{tech.slug}">
				<div class="tech-art"><TechIllustration variant={tech.slug} /></div>
				<span class="tech-name"><Icon name={tech.icon} size={20} /> {tech.short}</span>
				<p>{tech.tagline}</p>
				<span class="tech-sectors">Psicología · Salud · Educación · Industria · Agro · Empresa · Investigación</span>
				<span class="sector-link">Ver aplicaciones por sector →</span>
			</a>
		{/each}
	</div>
	<p class="tech-more"><a href="/tecnologias">Ver el mapa completo de tecnologías por sector →</a></p>
</section>

<section aria-labelledby="services-title" class="block">
	<h2 use:reveal id="services-title" class="section-title">Qué hacemos</h2>
	<p class="section-lead">Acompañamos cada modelo desde los datos hasta su vigilancia en producción.</p>
	<div class="services" use:reveal>
		{#each services as service (service.title)}
			<InfoCard title={service.title} level={3} compact explain={service.explain}>
				<div class="service-icon"><Icon name={service.icon} size={26} /></div>
				<p class="service-text">{service.text}</p>
			</InfoCard>
		{/each}
	</div>
</section>

<section aria-labelledby="how-title" class="block">
	<h2 use:reveal id="how-title" class="section-title">Cómo funciona</h2>
	<p class="section-lead">El recorrido de un modelo en esta plataforma. Pasa el cursor por cada paso para ver el detalle técnico.</p>
	<ol class="steps" use:reveal>
		{#each steps as step, i (step.title)}
			<li>
				<InfoCard title="{i + 1}. {step.title}" level={3} compact explain={step.explain}>
					<p class="service-text">{step.text}</p>
				</InfoCard>
			</li>
		{/each}
	</ol>
</section>

<section aria-labelledby="live-title" class="block">
	<h2 use:reveal id="live-title" class="section-title">Resultados en vivo</h2>
	<p class="section-lead">Datos leídos en tiempo real desde MLflow.</p>
	<div class="charts" use:reveal>
		<InfoCard
			title="Evolución del modelo en producción"
			subtitle="R² en test por versión de {data.history?.name ?? 'modelo'}"
			explain={'Cada punto es una versión registrada del modelo y su R² sobre datos de test. La versión marcada como @champion es la que responde a las predicciones.\n\nSi una versión nueva no mejora, no se promueve: el alias se queda donde está.'}
		>
			{#if r2Points.length}
				<LineChart points={r2Points} format={formatMetric} xFormat={(v) => `v${v}`} xName="Versión" yName="R²" ariaLabel="R² en test por versión del modelo" />
			{:else}
				<p class="muted-note">Aún no hay versiones con métricas.</p>
			{/if}
		</InfoCard>
		<InfoCard
			title="Actividad por experimento"
			subtitle="Número de entrenamientos registrados"
			explain="Cuántos runs se han ejecutado en cada experimento. Un experimento con muchos runs indica una búsqueda activa de la mejor configuración de hiperparámetros."
		>
			{#if runsByExperiment.length}
				<BarChart data={runsByExperiment} format={(v) => String(v)} valueName="Runs" ariaLabel="Runs por experimento" />
			{:else}
				<p class="muted-note">No hay experimentos registrados.</p>
			{/if}
		</InfoCard>
	</div>
</section>

<section aria-labelledby="faq-title" class="block">
	<h2 use:reveal id="faq-title" class="section-title">Preguntas frecuentes</h2>
	<div class="faq" use:reveal>
		{#each faqs as faq (faq.q)}
			<details>
				<summary>{faq.q}</summary>
				<p>{faq.a}</p>
			</details>
		{/each}
	</div>
</section>

<section aria-labelledby="about-title" class="block about" use:reveal>
	<div class="about-art"><NetworkIllustration /></div>
	<div>
		<h2 id="about-title" class="section-title">Sobre PsiCiencia Tech</h2>
		<p>
			Nacimos para cerrar la brecha entre el análisis de datos y el software en producción. Muchos modelos se quedan en un
			notebook; nuestro objetivo es que cada modelo útil llegue a las personas que toman decisiones, con garantías de
			calidad y sin cajas negras.
		</p>
		<ul class="principles">
			<li><Icon name="flask" size={20} /><span><strong>Reproducible.</strong> Cada resultado puede repetirse con los mismos datos y parámetros.</span></li>
			<li><Icon name="registry" size={20} /><span><strong>Trazable.</strong> Toda predicción apunta a una versión y a un experimento concretos.</span></li>
			<li><Icon name="pulse" size={20} /><span><strong>Vigilado.</strong> El drift se mide antes de que afecte a las decisiones.</span></li>
			<li><Icon name="shield" size={20} /><span><strong>Seguro.</strong> Credenciales fuera del código y servicios en red privada.</span></li>
		</ul>
	</div>
</section>

<section aria-labelledby="stack-title" class="block">
	<h2 use:reveal id="stack-title" class="section-title">Tecnología</h2>
	<div class="stack">
		{#each stack as item (item.name)}
			<div class="chip"><strong>{item.name}</strong><span>{item.role}</span></div>
		{/each}
	</div>
</section>

<section class="cta-band" use:reveal>
	<div>
		<h2>¿Quieres ver el modelo en acción?</h2>
		<p>Haz una predicción, sube un lote de datos o comprueba si tus datos han cambiado.</p>
	</div>
	<div class="ctas">
		<a class="button" href="/predict">Hacer una predicción</a>
		<a class="button secondary" href="/drift">Analizar drift</a>
	</div>
</section>

<style>
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		align-items: center;
		gap: 2rem;
		padding: 2rem 0 2.5rem;
	}

	@media (max-width: 860px) {
		.hero {
			grid-template-columns: minmax(0, 1fr);
			padding-top: 0.5rem;
		}
	}

	.eyebrow {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--brand-1);
		background: color-mix(in srgb, var(--brand-1) 12%, transparent);
		border-radius: 999px;
		padding: 0.3rem 0.8rem;
		margin-bottom: 1rem;
	}

	.hero h1 {
		font-size: clamp(2rem, 4.5vw, 3rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		margin: 0 0 1rem;
	}

	.hero-lead {
		font-size: 1.1rem;
		color: var(--text-muted);
		max-width: 52ch;
		margin: 0 0 1.5rem;
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.ctas .button {
		padding: 0.75rem 1.3rem;
	}

	.checks {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.checks li::before {
		content: '✓';
		color: var(--ok);
		font-weight: 700;
		margin-right: 0.4rem;
	}

	.hero-art {
		display: grid;
		place-items: center;
	}

	.block {
		margin: 2.5rem 0;
	}

	.section-title {
		font-size: 1.5rem;
		letter-spacing: -0.01em;
		margin: 0 0 0.35rem;
	}

	.section-lead {
		color: var(--text-muted);
		margin: 0 0 1.25rem;
	}

	.numbers {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1.4fr repeat(3, 1fr);
		margin-top: 1rem;
	}

	@media (max-width: 860px) {
		.numbers {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 480px) {
		.numbers {
			grid-template-columns: 1fr;
		}
	}

	.numbers :global(.card) {
		margin: 0;
	}

	.hero-figure {
		font-size: 3rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.services {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
	}

	.services :global(.card),
	.steps :global(.card) {
		margin: 0;
		height: 100%;
	}

	.service-icon {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: 12px;
		color: var(--brand-1);
		background: color-mix(in srgb, var(--brand-1) 12%, transparent);
		margin-bottom: 0.75rem;
	}

	.service-text {
		color: var(--text-muted);
		margin: 0;
	}

	.steps {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		counter-reset: step;
	}

	@media (max-width: 960px) {
		.steps {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}

	.steps li {
		position: relative;
	}

	@media (min-width: 961px) {
		.steps li:not(:last-child)::after {
			content: '→';
			position: absolute;
			right: -0.85rem;
			top: 50%;
			transform: translateY(-50%);
			color: var(--text-muted);
			font-weight: 700;
			z-index: 1;
		}
	}

	.charts {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	}

	.charts :global(.card) {
		margin: 0;
	}

	.about {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
		gap: 2rem;
		align-items: center;
	}

	@media (max-width: 860px) {
		.about {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.about p {
		color: var(--text-muted);
		font-size: 1.02rem;
	}

	.principles {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		gap: 0.75rem;
	}

	.principles li {
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
	}

	.principles :global(svg) {
		flex: none;
		color: var(--brand-2);
		margin-top: 2px;
	}

	.stack {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		margin-top: 1rem;
	}

	.chip {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.8rem 1rem;
		display: flex;
		flex-direction: column;
	}

	.chip span {
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	.section-title.big {
		font-size: clamp(1.7rem, 3.5vw, 2.3rem);
	}

	.sector-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	}

	.sector-grid :global(.card),
	.psy-areas :global(.card) {
		margin: 0;
		height: 100%;
	}

	.sector-head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.6rem;
	}

	.service-icon.small {
		flex: none;
		width: 38px;
		height: 38px;
		margin: 0;
		border-radius: 10px;
	}

	.sector-tagline {
		margin: 0;
		font-weight: 600;
		font-size: 0.92rem;
	}

	.sector-examples {
		margin: 0 0 0.6rem;
		padding-left: 1.1rem;
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.sector-link {
		font-weight: 600;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.psychology {
		background: linear-gradient(180deg, color-mix(in srgb, var(--brand-2) 8%, transparent), transparent 70%);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 2rem clamp(1rem, 3vw, 2.5rem);
	}

	.psy-intro {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		gap: 2rem;
		align-items: center;
	}

	@media (max-width: 860px) {
		.psy-intro {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.psy-lead {
		font-size: 1.05rem;
		color: var(--text-muted);
		margin: 0.5rem 0 1.25rem;
	}

	.psy-lead strong {
		color: var(--text);
	}

	.psy-art {
		max-width: 440px;
		width: 100%;
		margin: 0 auto;
	}

	.psy-areas {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		margin: 1.5rem 0;
	}

	.psy-example {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
		gap: 1rem;
		align-items: start;
	}

	@media (max-width: 860px) {
		.psy-example {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.psy-example :global(.card) {
		margin: 0;
	}

	.ethics {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.25rem;
	}

	.ethics h3 {
		margin: 0 0 0.35rem;
		font-size: 1.05rem;
	}

	.ethics ul {
		list-style: none;
		padding: 0;
		margin: 0.75rem 0 0;
		display: grid;
		gap: 0.75rem;
	}

	.ethics li {
		display: flex;
		gap: 0.65rem;
		align-items: flex-start;
		font-size: 0.92rem;
	}

	.tech-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.tech-tile {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 1rem 1.2rem 1.25rem;
		color: var(--text);
		text-decoration: none;
		transition:
			border-color 0.15s,
			transform 0.15s;
	}

	.tech-tile:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
	}

	.tech-art {
		max-width: 280px;
		margin: 0 auto;
		width: 100%;
	}

	.tech-name {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--brand-1);
	}

	.tech-tile p {
		margin: 0;
		color: var(--text-muted);
	}

	.tech-sectors {
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.tech-more {
		margin: 1rem 0 0;
		font-weight: 600;
	}

	.faq {
		display: grid;
		gap: 0.6rem;
		margin-top: 1rem;
	}

	.faq details {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.9rem 1.1rem;
	}

	.faq summary {
		cursor: pointer;
		font-weight: 600;
	}

	.faq p {
		margin: 0.6rem 0 0;
		color: var(--text-muted);
	}

	.cta-band {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1.25rem;
		padding: 2rem;
		border-radius: 16px;
		background: linear-gradient(135deg, #2a78d6, #1baf7a);
		color: #fff;
		margin: 3rem 0 1rem;
	}

	.cta-band h2 {
		margin: 0 0 0.35rem;
		font-size: 1.4rem;
	}

	.cta-band p {
		margin: 0;
		opacity: 0.92;
	}

	.cta-band .button {
		background: #fff;
		color: #184f95;
	}

	.cta-band .button.secondary {
		background: rgb(255 255 255 / 16%);
		color: #fff;
		border: 1px solid rgb(255 255 255 / 55%);
	}
</style>
