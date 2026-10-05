<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { breadcrumbs } from '#lib/seo.ts';
	import BarChart from '#lib/components/charts/BarChart.svelte';
	import LineChart from '#lib/components/charts/LineChart.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import SectorIllustration from '#lib/components/illustrations/SectorIllustration.svelte';
	import PhotoHero from '#lib/components/PhotoHero.svelte';
	import { photos } from '#lib/photos.ts';
	import { reveal } from '#lib/reveal.ts';
	import { formatNumber, formatPercent } from '#lib/format.ts';
	import { burnoutDrivers, clinicalMonitoring, itemLoadings, moodDiary } from '#lib/showcase.ts';

	const reasons = [
		{
			icon: 'scale',
			title: 'Medición más precisa',
			text: 'Instrumentos validados estadísticamente, más cortos y con menos error.',
			explain:
				'Un test psicológico es un instrumento de medida. La psicometría moderna (análisis factorial, TRI) cuantifica su fiabilidad y permite versiones adaptativas: cada persona responde solo los ítems que más información aportan sobre ella.'
		},
		{
			icon: 'pulse',
			title: 'Intervención temprana',
			text: 'Señales de alerta antes de que el problema se agrave o la persona abandone.',
			explain:
				'Los modelos detectan desviaciones respecto a lo esperado: un paciente que no mejora, un estudiante que se desconecta, un equipo con señales de burnout. Llegar antes multiplica las opciones de ayudar.'
		},
		{
			icon: 'flask',
			title: 'Práctica basada en evidencia',
			text: 'Decisiones apoyadas en datos propios, no solo en la intuición.',
			explain:
				'Medir los resultados de cada intervención permite saber qué funciona, para quién y en qué condiciones. Es la base de la práctica basada en evidencia y de la mejora continua de un servicio.'
		}
	] as const;

	const sources = [
		{ icon: 'clipboard', title: 'Cuestionarios y escalas', text: 'Síntomas, personalidad, bienestar, clima laboral.' },
		{ icon: 'chat', title: 'Texto y lenguaje', text: 'Entrevistas, diarios y respuestas abiertas (con NLP).' },
		{ icon: 'pulse', title: 'Apps y EMA', text: 'Estado de ánimo registrado varias veces al día.' },
		{ icon: 'heart', title: 'Psicofisiología', text: 'Sueño, ritmo cardiaco y actividad de wearables.' },
		{ icon: 'school', title: 'Registros educativos', text: 'Rendimiento, asistencia y uso de plataformas.' },
		{ icon: 'brain', title: 'Datos experimentales', text: 'Tiempos de reacción, tareas cognitivas, EEG.' }
	] as const;

	const areas = [
		{
			title: 'Clínica y psicoterapia',
			text: 'Seguimiento de resultados, riesgo de abandono y apoyo a la planificación del tratamiento.',
			explain:
				'El seguimiento rutinario de resultados (ROM) y los sistemas de retroalimentación al terapeuta tienen respaldo en la investigación como forma de mejorar los resultados en los pacientes que no progresan. La ciencia de datos los hace automáticos y visuales.'
		},
		{
			title: 'Psicometría y evaluación',
			text: 'Construcción y validación de tests, baremos y tests adaptativos.',
			explain:
				'Análisis factorial exploratorio y confirmatorio, fiabilidad (alfa, omega), invarianza entre grupos (que el test mida igual a hombres y mujeres, o en distintos países) y TRI para bancos de ítems.'
		},
		{
			title: 'Investigación psicológica',
			text: 'Diseños longitudinales, meta-análisis y ciencia abierta.',
			explain:
				'Modelos mixtos para medidas repetidas, análisis de redes de síntomas, meta-análisis y, sobre todo, reproducibilidad: código, datos y resultados versionados para que cualquiera pueda repetir el análisis.'
		},
		{
			title: 'Psicología organizacional',
			text: 'Bienestar, clima, rotación y desarrollo del talento.',
			explain:
				'People analytics con datos agregados y anónimos: qué factores se asocian al bienestar o a la rotación en cada área, y si las intervenciones (formación, cambios de horario) los mejoran.'
		},
		{
			title: 'Psicología educativa',
			text: 'Dificultades de aprendizaje, orientación y prevención del abandono.',
			explain:
				'Cribados tempranos de dificultades de lectura o cálculo, perfiles de motivación y modelos de alerta temprana de abandono que ponen al orientador en contacto con el estudiante a tiempo.'
		},
		{
			title: 'Salud mental digital',
			text: 'Apps, teleterapia y evaluación ecológica momentánea.',
			explain:
				'Las apps permiten registrar el estado de ánimo en la vida real (EMA) y no solo en consulta. Los datos revelan patrones —días de la semana, sueño, actividad— útiles para la persona y para su terapeuta.'
		}
	];

	const steps = [
		{ title: 'Pregunta', text: '¿Qué decisión queremos mejorar? Definida con los profesionales.' },
		{ title: 'Instrumentos y consentimiento', text: 'Qué se mide, con qué escalas y con qué permiso.' },
		{ title: 'Recolección', text: 'Datos limpios, seudonimizados y con trazabilidad.' },
		{ title: 'Análisis y modelado', text: 'Estadística y machine learning interpretables.' },
		{ title: 'Validación', text: 'Precisión, sesgos entre grupos y revisión clínica.' },
		{ title: 'Implementación', text: 'Uso con supervisión humana y monitoreo continuo.' }
	];

	const techniques = [
		'Análisis factorial (EFA / CFA)',
		'Teoría de respuesta al ítem',
		'Modelos mixtos',
		'Análisis de redes psicológicas',
		'Regresión logística',
		'Árboles y gradient boosting interpretables',
		'Procesamiento de lenguaje natural',
		'Series temporales (EMA)',
		'Clustering de perfiles',
		'Inferencia causal'
	];

	const ethics = [
		{
			icon: 'hand',
			title: 'Consentimiento informado',
			text: 'Cada persona sabe qué datos se usan, para qué y cómo retirarlos.',
			explain: 'Las personas deben saber qué datos se recogen, para qué se usan, quién los ve y cómo retirar su consentimiento. Los datos de salud mental se consideran especialmente sensibles en la mayoría de normativas de protección de datos.'
		},
		{
			icon: 'lock',
			title: 'Privacidad y seguridad',
			text: 'Seudonimización, cifrado y mínimo dato necesario.',
			explain: 'Seudonimización, cifrado, acceso por roles y el principio de mínimo dato necesario. Los análisis organizacionales se reportan solo de forma agregada, con grupos suficientemente grandes para impedir identificar a nadie.'
		},
		{
			icon: 'eye',
			title: 'Supervisión humana',
			text: 'El modelo alerta; el profesional evalúa y decide.',
			explain: 'Ningún modelo debe diagnosticar ni decidir un tratamiento por sí solo. Las alertas llegan al profesional, que las contrasta con su conocimiento del caso.'
		},
		{
			icon: 'scale',
			title: 'Equidad y sesgos',
			text: 'Rendimiento revisado por grupos antes de usar el modelo.',
			explain: 'Un modelo entrenado con datos de un grupo puede funcionar peor en otro. Se evalúa su rendimiento por sexo, edad, origen u otras variables relevantes antes de usarlo.'
		},
		{
			icon: 'flask',
			title: 'Explicabilidad',
			text: 'Se entiende por qué el modelo señala un caso.',
			explain: 'Preferimos modelos interpretables o explicados: el profesional debe poder entender por qué el modelo señala un caso (por ejemplo, qué ítems o qué cambio de tendencia).'
		},
		{
			icon: 'shield',
			title: 'Validez y transparencia',
			text: 'Datos, validación y límites de cada modelo documentados.',
			explain: 'Documentamos con qué datos se entrenó cada modelo, cómo se validó y cuáles son sus límites, igual que se documenta la validez de un test psicológico.'
		}
	] as const;

	const notDo = [
		'No diagnostica: apoya la evaluación que hace un profesional.',
		'No sustituye la relación terapéutica ni el juicio clínico.',
		'No "lee la mente": trabaja con lo que se mide, con su margen de error.',
		'No se usa para vigilar a personas concretas en el trabajo.'
	];
</script>

<Seo
	title="Psicología basada en datos"
	description="Ciencia de datos y machine learning en psicología clínica, psicometría, investigación, organizacional y educativa: ejemplos, técnicas y ética."
	image="/og/psicologia.jpg"
	imageAlt={photos.psicologia.alt}
	type="article"
	jsonLd={[breadcrumbs([['Inicio', '/'], ['Sectores', '/sectores'], ['Psicología', '/sectores/psicologia']])]}
/>

<PhotoHero
	photo={photos.psicologia}
	title="Psicología basada en datos"
	lead="Medir mejor, detectar antes y decidir con evidencia. Llevamos la ciencia de datos y el machine learning a la práctica clínica, la evaluación psicológica, la investigación y las organizaciones, con la ética como punto de partida."
>
	{#snippet crumbs()}<a href="/">Inicio</a> › <a href="/sectores">Sectores</a> › Psicología{/snippet}
	{#snippet eyebrow()}<Icon name="brain" size={16} /> Sector · Psicología{/snippet}
	{#snippet actions()}
		<a class="button" href="#ejemplos">Ver ejemplos</a>
		<a class="button secondary" href="#etica">Ética y privacidad</a>
	{/snippet}
</PhotoHero>

<section class="block why" aria-labelledby="why-title">
	<div class="why-art" use:reveal><SectorIllustration variant="psicologia" /></div>
	<div>
	<h2 id="why-title" class="section-title" use:reveal>Por qué la ciencia de datos en psicología</h2>
	<div class="grid-3">
		{#each reasons as reason (reason.title)}
			<InfoCard title={reason.title} level={3} compact explain={reason.explain}>
				<div class="icon-tile"><Icon name={reason.icon} size={24} /></div>
				<p class="muted">{reason.text}</p>
			</InfoCard>
		{/each}
	</div>
	</div>
</section>

<section class="block" aria-labelledby="sources-title">
	<h2 id="sources-title" class="section-title">Fuentes de datos en psicología</h2>
	<p class="section-lead">Mucho más que cuestionarios: cada fuente responde a preguntas distintas.</p>
	<div class="sources">
		{#each sources as source (source.title)}
			<div class="source">
				<span class="icon-tile small"><Icon name={source.icon} size={20} /></span>
				<div><strong>{source.title}</strong><span>{source.text}</span></div>
			</div>
		{/each}
	</div>
</section>

<section class="block" aria-labelledby="areas-title">
	<h2 id="areas-title" class="section-title">Áreas de aplicación</h2>
	<p class="section-lead">Pasa el cursor por cada área para ver técnicas y ejemplos concretos.</p>
	<div class="grid-3">
		{#each areas as area (area.title)}
			<InfoCard title={area.title} level={3} compact explain={area.explain}>
				<p class="muted">{area.text}</p>
			</InfoCard>
		{/each}
	</div>
</section>

<section id="ejemplos" class="block" aria-labelledby="examples-title">
	<h2 id="examples-title" class="section-title">Ejemplos</h2>
	<p class="section-lead">
		Ejemplos ilustrativos con <strong>datos sintéticos</strong>: muestran el tipo de análisis, no resultados de personas
		reales.
	</p>

	<InfoCard
		title="1 · Seguimiento de resultados en psicoterapia"
		subtitle="Puntuación de síntomas por sesión (0–27) frente a la trayectoria esperada"
		explain={'En cada sesión el paciente responde un cuestionario breve de síntomas. La línea naranja es la evolución típica de pacientes que empezaron con una puntuación similar.\n\nEn la sesión 5 el paciente lleva tres sesiones estancado mientras lo esperado era mejorar: el sistema genera una alerta. El terapeuta revisa el caso, ajusta el plan y la puntuación empieza a bajar hasta cruzar el punto de corte de síntomas leves (10).'}
	>
		<LineChart
			points={clinicalMonitoring.patient}
			name="Paciente"
			secondary={{ name: 'Trayectoria esperada', points: clinicalMonitoring.expected }}
			yThreshold={{ value: clinicalMonitoring.cutoff, label: 'punto de corte (10)' }}
			marker={{ x: clinicalMonitoring.alertSession, label: 'alerta: fuera de trayectoria' }}
			yDomain={[0, 25]}
			format={formatNumber}
			xFormat={(v) => `S${v}`}
			xName="Sesión"
			yName="Puntuación"
			height={260}
			ariaLabel="Puntuación de síntomas por sesión frente a la trayectoria esperada"
		/>
	</InfoCard>

	<div class="two-col">
		<InfoCard
			title="2 · Validación de un cuestionario"
			subtitle="Carga factorial de cada ítem en un piloto"
			explain={'El análisis factorial indica cuánto refleja cada ítem el constructo que se quiere medir (por ejemplo, ansiedad). Cargas por encima de 0,40 suelen considerarse adecuadas.\n\nEl ítem 6 carga muy poco: probablemente está mal redactado o mide otra cosa, así que se revisa o se elimina antes de usar el test.'}
		>
			<BarChart data={itemLoadings} format={(v) => v.toFixed(2).replace('.', ',')} threshold={{ value: 0.4, label: 'mínimo 0,40' }} valueName="Carga factorial" ariaLabel="Carga factorial por ítem" />
		</InfoCard>
		<InfoCard
			title="3 · Factores asociados al burnout"
			subtitle="Importancia relativa en un modelo de riesgo (encuesta de clima)"
			explain={'Con una encuesta anónima de clima y bienestar se entrena un modelo que estima el riesgo de burnout por equipo. La importancia indica qué factores pesan más en ese riesgo.\n\nAsí la organización prioriza: en este ejemplo, revisar la carga de trabajo tendría más impacto que otras acciones. Importancia no es causalidad: la intervención se valida después.'}
		>
			<BarChart data={burnoutDrivers} format={formatPercent} valueName="Importancia" ariaLabel="Importancia de los factores asociados al burnout" />
		</InfoCard>
	</div>

	<InfoCard
		title="4 · Diario de estado de ánimo (EMA)"
		subtitle="Registro diario en una app durante 4 semanas (1 = muy mal, 10 = muy bien)"
		explain={'La evaluación ecológica momentánea registra el estado de ánimo en la vida diaria, no solo en consulta. Con suficientes registros aparecen patrones: aquí, una caída recurrente al inicio de cada semana y una tendencia general de mejora.\n\nPaciente y terapeuta pueden usar estos patrones para planificar estrategias concretas para esos días.'}
	>
		<LineChart
			points={moodDiary}
			format={formatNumber}
			xFormat={(v) => `D${v}`}
			xTicks="nice"
			yDomain={[0, 10]}
			xName="Día"
			yName="Estado de ánimo"
			height={220}
			ariaLabel="Estado de ánimo diario durante cuatro semanas"
		/>
	</InfoCard>
</section>

<section class="block" aria-labelledby="process-title">
	<h2 id="process-title" class="section-title">Cómo es un proyecto de datos en psicología</h2>
	<ol class="process">
		{#each steps as step, i (step.title)}
			<li>
				<span class="num">{i + 1}</span>
				<strong>{step.title}</strong>
				<span>{step.text}</span>
			</li>
		{/each}
	</ol>
</section>

<section class="block" aria-labelledby="tech-title">
	<h2 id="tech-title" class="section-title">Técnicas que utilizamos</h2>
	<div class="chips">
		{#each techniques as technique (technique)}<span class="chip">{technique}</span>{/each}
	</div>
</section>

<section id="etica" class="block" aria-labelledby="ethics-title">
	<h2 id="ethics-title" class="section-title">Ética y privacidad</h2>
	<p class="section-lead">Los datos psicológicos son de los más sensibles que existen. Estos principios no son opcionales.</p>
	<div class="grid-3">
		{#each ethics as item (item.title)}
			<InfoCard title={item.title} level={3} compact explain={item.explain}>
				<div class="ethic-row">
					<span class="icon-tile small"><Icon name={item.icon} size={20} /></span>
					<p class="muted">{item.text}</p>
				</div>
			</InfoCard>
		{/each}
	</div>
	<div class="not-do">
		<h3>Lo que la ciencia de datos no hace</h3>
		<ul>
			{#each notDo as item (item)}<li>{item}</li>{/each}
		</ul>
	</div>
</section>

<section class="cta-band">
	<div>
		<h2>¿Trabajas en psicología y tienes datos?</h2>
		<p>Empecemos por una pregunta concreta y un piloto pequeño, medible y ético.</p>
	</div>
	<div class="ctas">
		<a class="button light" href="/">Volver al inicio</a>
		<a class="button outline" href="/sectores">Ver otros sectores</a>
	</div>
</section>

<style>








	.why {
		display: grid;
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.5fr);
		gap: 2rem;
		align-items: center;
	}

	@media (max-width: 860px) {
		.why {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.why-art {
		max-width: 340px;
		width: 100%;
		margin: 0 auto;
	}

	.why .grid-3 {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.block {
		margin: 2.75rem 0;
	}

	.section-title {
		font-size: 1.5rem;
		margin: 0 0 0.35rem;
	}

	.section-lead {
		color: var(--text-muted);
		margin: 0 0 1.25rem;
	}

	.grid-3 {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		margin-top: 1rem;
	}

	.grid-3 :global(.card),
	.two-col :global(.card) {
		margin: 0;
		height: 100%;
	}

	.muted {
		color: var(--text-muted);
		margin: 0;
	}

	.icon-tile {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: 12px;
		color: var(--brand-1);
		background: color-mix(in srgb, var(--brand-1) 12%, transparent);
		margin-bottom: 0.75rem;
	}

	.icon-tile.small {
		flex: none;
		width: 38px;
		height: 38px;
		margin: 0;
	}

	.ethic-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.sources {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	}

	.source {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.85rem 1rem;
	}

	.source div {
		display: flex;
		flex-direction: column;
	}

	.source span:not(.icon-tile) {
		color: var(--text-muted);
		font-size: 0.88rem;
	}

	.two-col {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		margin-bottom: 1rem;
	}

	.process {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	}

	.process li {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1rem;
	}

	.process span:last-child {
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.num {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: linear-gradient(135deg, #2a78d6, #1baf7a);
		color: #fff;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.chip {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.4rem 0.9rem;
		font-size: 0.9rem;
	}

	.not-do {
		margin-top: 1rem;
		border-left: 4px solid var(--series-2);
		background: var(--surface);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: 1rem 1.25rem;
	}

	.not-do h3 {
		margin: 0 0 0.5rem;
		font-size: 1.05rem;
	}

	.not-do ul {
		margin: 0;
		padding-left: 1.1rem;
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

	.button.light {
		background: #fff;
		color: #184f95;
	}

	.button.outline {
		background: rgb(255 255 255 / 16%);
		color: #fff;
		border: 1px solid rgb(255 255 255 / 55%);
	}
</style>
