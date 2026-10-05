<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { breadcrumbs } from '#lib/seo.ts';
	import BarChart from '#lib/components/charts/BarChart.svelte';
	import Histogram from '#lib/components/charts/Histogram.svelte';
	import LineChart from '#lib/components/charts/LineChart.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import SectorIllustration from '#lib/components/illustrations/SectorIllustration.svelte';
	import { formatNumber, formatPercent } from '#lib/format.ts';
	import PhotoHero from '#lib/components/PhotoHero.svelte';
	import { photos, type PhotoKey } from '#lib/photos.ts';
	import { reveal } from '#lib/reveal.ts';
	import { sectors } from '#lib/sectors.ts';
	import { demandForecast, dropoutRisk, restingHeartRate, soilMoisture, vibration } from '#lib/showcase.ts';
	import { technologies, type SectorKey } from '#lib/technologies.ts';

	let { data } = $props();
	const sector = $derived(data.sector);
	const page = $derived(sector.page!);
	const variant = $derived(sector.slug as 'industria' | 'empresa' | 'educacion' | 'salud' | 'agro');
	const techApps = $derived(
		technologies
			.map((tech) => ({ tech, apps: tech.apps[sector.slug as SectorKey] ?? [] }))
			.filter((t) => t.apps.length)
	);
	const others = $derived(sectors.filter((s) => s.slug !== sector.slug && (s.page || s.slug === 'psicologia')));
</script>

<Seo
	title={page.headline}
	description={sector.summary}
	image="/og/{sector.slug}.jpg"
	imageAlt={photos[sector.slug as PhotoKey].alt}
	type="article"
	jsonLd={[breadcrumbs([['Inicio', '/'], ['Sectores', '/sectores'], [sector.name, `/sectores/${sector.slug}`]])]}
/>

<PhotoHero photo={photos[sector.slug as PhotoKey]} title={page.headline} lead={page.lead}>
	{#snippet crumbs()}<a href="/">Inicio</a> › <a href="/sectores">Sectores</a> › {sector.name}{/snippet}
	{#snippet eyebrow()}<Icon name={sector.icon} size={16} /> Sector · {sector.name}{/snippet}
	{#snippet actions()}
		<a class="button" href="#casos">Ver casos de uso</a>
		<a class="button secondary" href="#ejemplo">Ver un ejemplo</a>
	{/snippet}
</PhotoHero>

<section class="block problem-block" aria-labelledby="challenges-title">
	<div class="art" use:reveal><SectorIllustration {variant} /></div>
	<div>
		<h2 id="challenges-title" class="section-title" use:reveal>El problema</h2>
		<div class="challenges">
			{#each page.challenges as challenge, i (challenge.title)}
				<div class="challenge" use:reveal={{ delay: i * 90 }}>
					<strong>{challenge.title}</strong>
					<p>{challenge.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section id="casos" class="block" aria-labelledby="cases-title">
	<h2 id="cases-title" class="section-title">Casos de uso</h2>
	<p class="section-lead">Pasa el cursor por cada caso para ver cómo funciona por dentro.</p>
	<div class="cases">
		{#each page.useCases as useCase (useCase.title)}
			<InfoCard title={useCase.title} level={3} compact explain={useCase.explain}>
				<p class="muted">{useCase.text}</p>
				<span class="technique">{useCase.technique}</span>
			</InfoCard>
		{/each}
	</div>
</section>

<section id="ejemplo" class="block" aria-labelledby="example-title">
	<h2 id="example-title" class="section-title">Ejemplo</h2>
	<p class="section-lead">Ejemplo ilustrativo con <strong>datos sintéticos</strong>.</p>
	{#if sector.slug === 'educacion'}
		<div class="two-col">
			<InfoCard
				title="Distribución del riesgo de abandono"
				subtitle="{dropoutRisk.flagged} de {dropoutRisk.total} estudiantes superan el umbral de alerta"
				explain={'El modelo asigna a cada estudiante una probabilidad de abandono entre 0 y 1. La mayoría tiene riesgo bajo; un grupo más pequeño se concentra por encima de 0,6, el umbral elegido para activar una tutoría.\n\nEl umbral es una decisión de la institución: más bajo detecta más casos pero genera más falsas alarmas.'}
			>
				<Histogram bins={dropoutRisk.bins} series={[{ name: 'Estudiantes', values: dropoutRisk.counts }]} format={(v) => String(Math.round(v))} marker={{ value: dropoutRisk.threshold, label: 'umbral de alerta' }} ariaLabel="Distribución del riesgo de abandono" />
			</InfoCard>
			<InfoCard
				title="¿Qué pesa más en el riesgo?"
				subtitle="Importancia de cada variable en el modelo"
				explain={'Las variables que más ayudan al modelo a distinguir a quién está en riesgo. Asistencia y notas tempranas suelen ser las señales más fuertes.\n\nEsto orienta qué datos vigilar y qué tipo de apoyo ofrecer.'}
			>
				<BarChart data={dropoutRisk.factors} format={formatPercent} valueName="Importancia" ariaLabel="Importancia de las variables en el modelo de abandono" />
			</InfoCard>
		</div>
	{:else if sector.slug === 'empresa'}
		<InfoCard
			title="Pronóstico de demanda"
			subtitle="Ventas mensuales reales y pronóstico con 3 meses de horizonte"
			explain={'El pronóstico (naranja) reproduce la tendencia de crecimiento y el patrón estacional de las ventas reales (azul), y se proyecta tres meses hacia adelante.\n\nCada mes se compara el pronóstico con lo vendido; si el error crece, el modelo se reentrena, igual que hacemos con los modelos de esta plataforma.'}
		>
			<LineChart points={demandForecast.actual} name="Ventas reales" secondary={{ name: 'Pronóstico', points: demandForecast.forecast }} format={formatNumber} xFormat={(v) => `M${v}`} xName="Mes" yName="Unidades" height={260} ariaLabel="Ventas reales frente al pronóstico" />
		</InfoCard>
	{:else if sector.slug === 'industria'}
		<InfoCard
			title="Detección temprana de una avería"
			subtitle="Vibración de un rodamiento durante 72 horas"
			explain={'Durante las primeras horas la vibración es estable. A partir de la hora 46 el rodamiento empieza a degradarse: el modelo de anomalías lo detecta en la hora 52, mucho antes de que la señal supere el umbral de alarma tradicional (4,5 mm/s).\n\nEsa diferencia es el tiempo disponible para planificar la reparación.'}
		>
			<LineChart points={vibration.points} yThreshold={{ value: vibration.alarm, label: 'alarma 4,5 mm/s' }} marker={{ x: vibration.earlyWarning, label: 'alerta del modelo' }} format={(v) => `${formatNumber(v)} mm/s`} xFormat={(v) => `${v} h`} xTicks="nice" xName="Hora" yName="Vibración" height={260} ariaLabel="Vibración por hora con umbral de alarma" />
		</InfoCard>
	{:else if sector.slug === 'salud'}
		<InfoCard
			title="Monitorización remota con un wearable"
			subtitle="Frecuencia cardiaca en reposo durante 30 días"
			explain={'El reloj registra cada día la frecuencia cardiaca en reposo. Con los primeros 20 días el modelo aprende la línea base personal del paciente y fija su umbral (base + 2 desviaciones típicas).\n\nCuando la media de tres días seguidos lo supera, se avisa al equipo clínico. Un aumento sostenido puede anticipar una infección o una descompensación días antes de que el paciente consulte.'}
		>
			<LineChart points={restingHeartRate.points} yThreshold={{ value: restingHeartRate.limit, label: `umbral personal ${formatNumber(restingHeartRate.limit)} lpm` }} marker={{ x: restingHeartRate.alertDay, label: 'alerta' }} format={(v) => `${formatNumber(v)} lpm`} xFormat={(v) => `D${v}`} xTicks="nice" xName="Día" yName="FC en reposo" height={250} ariaLabel="Frecuencia cardiaca en reposo por día con umbral personal" />
		</InfoCard>
	{:else if sector.slug === 'agro'}
		<InfoCard
			title="Riego de precisión con sensores de suelo"
			subtitle="Humedad del suelo cada 6 horas durante 3 semanas"
			explain={'La humedad baja cada día por la evapotranspiración, más rápido en las horas de sol. El día 7 llueve y el sistema no riega. Cuando el pronóstico indica que la humedad va a cruzar el umbral de estrés hídrico (22 %), programa un riego automático: cada subida brusca es un riego.\n\nSe riega solo cuando hace falta, en lugar de seguir un calendario fijo.'}
		>
			<LineChart points={soilMoisture.points} yThreshold={{ value: soilMoisture.threshold, label: 'umbral de estrés hídrico 22 %' }} marker={{ x: soilMoisture.rainDay, label: 'lluvia' }} format={(v) => `${formatNumber(v)} %`} xFormat={(v) => `D${Math.round(v)}`} xTicks="nice" xName="Día" yName="Humedad del suelo" height={250} ariaLabel="Humedad del suelo con umbral de riego" />
		</InfoCard>
	{/if}
</section>

{#if techApps.length}
	<section class="block" aria-labelledby="tech-title">
		<h2 id="tech-title" class="section-title">Tecnologías aplicadas a {sector.name.toLowerCase()}</h2>
		<p class="section-lead">Cómo la realidad extendida, la simulación y el IoT amplían lo que la ciencia de datos puede hacer en este sector.</p>
		<div class="cases">
			{#each techApps as { tech, apps } (tech.slug)}
				<a class="tech-card" href="/tecnologias/{tech.slug}#{sector.slug}">
					<span class="icon-tile"><Icon name={tech.icon} size={20} /></span>
					<strong>{tech.short}</strong>
					<ul>
						{#each apps.slice(0, 2) as app (app.title)}<li>{app.title}</li>{/each}
					</ul>
					<span class="go">Profundizar →</span>
				</a>
			{/each}
		</div>
	</section>
{/if}

<section class="block" aria-labelledby="metrics-title">
	<h2 id="metrics-title" class="section-title">Cómo medimos el éxito</h2>
	<div class="challenges">
		{#each page.metrics as metric (metric.name)}
			<div class="challenge metric">
				<strong>{metric.name}</strong>
				<p>{metric.text}</p>
			</div>
		{/each}
	</div>
	<div class="chips">
		{#each page.techniques as technique (technique)}<span class="chip">{technique}</span>{/each}
	</div>
</section>

<section class="block" aria-labelledby="others-title">
	<h2 id="others-title" class="section-title">Otros sectores</h2>
	<div class="others">
		{#each others as other (other.slug)}
			<a class="other" href="/sectores/{other.slug}">
				<span class="icon-tile"><Icon name={other.icon} size={20} /></span>
				<span><strong>{other.name}</strong><small>{other.tagline}</small></span>
			</a>
		{/each}
	</div>
</section>

<style>







	.problem-block {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr);
		gap: 2rem;
		align-items: center;
	}

	@media (max-width: 860px) {
		.problem-block {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.art {
		max-width: 360px;
		width: 100%;
		margin: 0 auto;
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

	.challenges {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		margin-top: 1rem;
	}

	.challenge {
		background: var(--surface);
		border: 1px solid var(--border);
		border-left: 4px solid var(--series-2);
		border-radius: var(--radius);
		padding: 1rem 1.1rem;
	}

	.challenge.metric {
		border-left-color: var(--series-1);
	}

	.challenge p {
		margin: 0.35rem 0 0;
		color: var(--text-muted);
	}

	.cases {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	}

	.cases :global(.card),
	.two-col :global(.card) {
		margin: 0;
		height: 100%;
	}

	.muted {
		color: var(--text-muted);
		margin: 0 0 0.6rem;
	}

	.technique {
		display: inline-block;
		font-size: 0.82rem;
		background: var(--surface-muted);
		border-radius: 6px;
		padding: 0.2rem 0.5rem;
	}

	.two-col {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.25rem;
	}

	.chip {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.4rem 0.9rem;
		font-size: 0.9rem;
	}

	.others {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		margin-top: 1rem;
	}

	.other {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.85rem 1rem;
		text-decoration: none;
		color: var(--text);
	}

	.other:hover {
		border-color: var(--accent);
	}

	.other small {
		display: block;
		color: var(--text-muted);
	}

	.tech-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.1rem;
		color: var(--text);
		text-decoration: none;
	}

	.tech-card:hover {
		border-color: var(--accent);
	}

	.tech-card ul {
		margin: 0;
		padding-left: 1.1rem;
		color: var(--text-muted);
		font-size: 0.92rem;
	}

	.tech-card .go {
		color: var(--accent);
		font-weight: 600;
		font-size: 0.9rem;
		margin-top: auto;
	}

	.icon-tile {
		flex: none;
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		color: var(--brand-1);
		background: color-mix(in srgb, var(--brand-1) 12%, transparent);
	}
</style>
