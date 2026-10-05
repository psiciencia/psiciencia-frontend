<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { breadcrumbs } from '#lib/seo.ts';
	import LineChart from '#lib/components/charts/LineChart.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import TechIllustration from '#lib/components/illustrations/TechIllustration.svelte';
	import PhotoHero from '#lib/components/PhotoHero.svelte';
	import Tabs from '#lib/components/Tabs.svelte';
	import { photos } from '#lib/photos.ts';
	import { reveal } from '#lib/reveal.ts';
	import { formatNumber } from '#lib/format.ts';
	import { sectorBySlug } from '#lib/sectors.ts';
	import { epidemicScenarios, soilMoisture, vrExposure } from '#lib/showcase.ts';
	import { sectorTabs, technologies } from '#lib/technologies.ts';

	let { data } = $props();
	const tech = $derived(data.tech);
	const others = $derived(technologies.filter((t) => t.slug !== tech.slug));
	const hasSectorPage = (id: string) => !!sectorBySlug(id)?.page || id === 'psicologia';
	const pct = (v: number) => `${formatNumber(v)} %`;
</script>

<Seo
	title="{tech.short} y ciencia de datos"
	description={tech.seoDescription}
	image="/og/{tech.slug}.jpg"
	imageAlt={photos[tech.slug].alt}
	type="article"
	jsonLd={[breadcrumbs([['Inicio', '/'], ['Tecnologías', '/tecnologias'], [tech.short, `/tecnologias/${tech.slug}`]])]}
/>

<PhotoHero photo={photos[tech.slug]} title={tech.name} lead={tech.lead}>
	{#snippet crumbs()}<a href="/">Inicio</a> › <a href="/tecnologias">Tecnologías</a> › {tech.short}{/snippet}
	{#snippet eyebrow()}<Icon name={tech.icon} size={16} /> Tecnología{/snippet}
	{#snippet actions()}
		<a class="button" href="#aplicaciones">Aplicaciones por sector</a>
		<a class="button secondary" href="#ejemplo">Ver un ejemplo</a>
	{/snippet}
</PhotoHero>

<section class="block what-block" aria-labelledby="what-title">
	<div use:reveal>
		<h2 id="what-title" class="section-title">Qué es y qué datos genera</h2>
		<p class="what">{tech.what}</p>
		<div class="chips">
			{#each tech.dataTypes as type (type)}<span class="chip">{type}</span>{/each}
		</div>
	</div>
	<div class="art" use:reveal={{ delay: 120 }}><TechIllustration variant={tech.slug} /></div>
</section>

<section class="block" aria-labelledby="rel-title">
	<h2 id="rel-title" class="section-title">Cómo se relaciona con la ciencia de datos</h2>
	<p class="section-lead">La relación va en los dos sentidos: la tecnología produce datos y la ciencia de datos la hace más inteligente.</p>
	<div class="card-grid">
		{#each tech.relations as relation, i (relation.title)}
			<InfoCard title="{i + 1}. {relation.title}" level={3} compact explain={relation.explain}>
				<p class="muted">{relation.text}</p>
			</InfoCard>
		{/each}
	</div>
</section>

<section class="block" aria-labelledby="pipe-title">
	<h2 id="pipe-title" class="section-title">Del dato a la decisión</h2>
	<ol class="process">
		{#each tech.pipeline as step, i (step.title)}
			<li use:reveal={{ delay: i * 80 }}><span class="num">{i + 1}</span><strong>{step.title}</strong><span>{step.text}</span></li>
		{/each}
	</ol>
</section>

<section id="aplicaciones" class="block" aria-labelledby="apps-title">
	<h2 id="apps-title" class="section-title">Aplicaciones por sector</h2>
	<p class="section-lead">Elige un sector para ver casos concretos, qué datos se usan y qué técnica de ciencia de datos hay detrás.</p>
	<Tabs tabs={sectorTabs} label="Sectores de aplicación de {tech.short}">
		{#snippet panel(sector)}
			<div class="card-grid">
				{#each tech.apps[sector] as app (app.title)}
					<article class="app-card">
						<h3>{app.title}</h3>
						<p>{app.text}</p>
						<dl>
							<dt>Datos</dt>
							<dd>{app.data}</dd>
							<dt>Ciencia de datos</dt>
							<dd>{app.technique}</dd>
						</dl>
					</article>
				{/each}
			</div>
			{#if hasSectorPage(sector)}
				<p class="sector-link"><a href="/sectores/{sector}">Ver todo sobre ciencia de datos en {sectorTabs.find((s) => s.id === sector)?.label.toLowerCase()} →</a></p>
			{/if}
		{/snippet}
	</Tabs>
</section>

<section id="ejemplo" class="block" aria-labelledby="example-title">
	<h2 id="example-title" class="section-title">Ejemplo</h2>
	<p class="section-lead">Ejemplo ilustrativo con <strong>datos sintéticos</strong>.</p>
	{#if tech.slug === 'realidad-extendida'}
		<InfoCard
			title="Terapia de exposición con realidad virtual"
			subtitle="Pico de ansiedad por sesión, en escala 0–100"
			explain={'Una persona con miedo a las alturas sigue 10 sesiones en un entorno virtual graduado. En cada sesión se registra su ansiedad subjetiva (SUDS, 0–100) y su activación fisiológica, a partir de la frecuencia cardiaca normalizada a la misma escala 0–100.\n\nAmbas bajan a medida que se produce la habituación. En la sesión 5 el sistema sube el nivel de exposición (un balcón más alto) porque las señales indican que la persona ya lo tolera. El objetivo es mantener la ansiedad por debajo de 30.'}
		>
			<LineChart
				points={vrExposure.suds}
				name="Ansiedad subjetiva (SUDS)"
				secondary={{ name: 'Activación fisiológica', points: vrExposure.arousal }}
				yThreshold={{ value: vrExposure.target, label: 'objetivo < 30' }}
				marker={{ x: vrExposure.levelUp, label: 'sube el nivel' }}
				yDomain={[0, 100]}
				format={formatNumber}
				xFormat={(v) => `S${v}`}
				xName="Sesión"
				yName="Nivel (0–100)"
				height={260}
				ariaLabel="Ansiedad subjetiva y activación fisiológica por sesión de exposición en realidad virtual"
			/>
		</InfoCard>
	{:else if tech.slug === 'simulacion'}
		<InfoCard
			title="Simulación de una epidemia: dos escenarios"
			subtitle="Porcentaje de la población infectada al mismo tiempo (modelo SIR)"
			explain={`Un modelo SIR divide a la población en susceptibles, infectados y recuperados. Sin medidas (R₀ = 2,5) el pico llega al ${formatNumber(epidemicScenarios.basePeak.y)} % de la población el día ${epidemicScenarios.basePeak.x}; reduciendo los contactos (R₀ = 1,6) se queda en ${formatNumber(epidemicScenarios.mitigatedPeak.y)} % el día ${epidemicScenarios.mitigatedPeak.x}.\n\nLa línea horizontal representa la capacidad del sistema sanitario. Simular permite comparar intervenciones antes de aplicarlas; en la práctica el modelo se calibra con los datos reales de casos.`}
		>
			<LineChart
				points={epidemicScenarios.base}
				name="Sin intervención (R₀ 2,5)"
				secondary={{ name: 'Con medidas (R₀ 1,6)', points: epidemicScenarios.mitigated }}
				yThreshold={{ value: epidemicScenarios.capacity, label: 'capacidad sanitaria' }}
				format={pct}
				xFormat={(v) => `día ${v}`}
				xTicks="nice"
				xName="Día"
				yName="Infectados"
				height={260}
				ariaLabel="Porcentaje de infectados por día en dos escenarios simulados"
			/>
		</InfoCard>
	{:else}
		<InfoCard
			title="Riego de precisión con sensores de humedad"
			subtitle="Humedad del suelo cada 6 horas durante 3 semanas"
			explain={'Una sonda IoT mide la humedad del suelo cada 6 horas y la envía por radio a la plataforma. El modelo aprende el ritmo de secado (más rápido de día) y, combinando la lectura con el pronóstico, programa un riego justo antes de cruzar el umbral de estrés hídrico.\n\nEl día 7 llueve y el sistema no riega. Cada subida brusca de la curva es un riego automático.'}
		>
			<LineChart
				points={soilMoisture.points}
				yThreshold={{ value: soilMoisture.threshold, label: 'umbral de estrés hídrico 22 %' }}
				marker={{ x: soilMoisture.rainDay, label: 'lluvia' }}
				format={pct}
				xFormat={(v) => `D${Math.round(v)}`}
				xTicks="nice"
				xName="Día"
				yName="Humedad del suelo"
				height={260}
				ariaLabel="Humedad del suelo medida por un sensor IoT con umbral de riego"
			/>
		</InfoCard>
	{/if}
</section>

<section class="block" aria-labelledby="challenges-title">
	<h2 id="challenges-title" class="section-title">Retos y buenas prácticas</h2>
	<div class="card-grid">
		{#each tech.challenges as challenge (challenge.title)}
			<div class="note-card"><strong>{challenge.title}</strong><p>{challenge.text}</p></div>
		{/each}
	</div>
</section>

<section class="block" aria-labelledby="others-title">
	<h2 id="others-title" class="section-title">Otras tecnologías</h2>
	<div class="card-grid">
		{#each others as other (other.slug)}
			<a class="link-card" href="/tecnologias/{other.slug}">
				<span class="icon-tile"><Icon name={other.icon} size={20} /></span>
				<span><strong>{other.short}</strong><small>{other.tagline}</small></span>
			</a>
		{/each}
		<a class="link-card" href="/tecnologias">
			<span class="icon-tile"><Icon name="layers" size={20} /></span>
			<span><strong>Todas las tecnologías</strong><small>Vista por sector y mapa de aplicaciones.</small></span>
		</a>
	</div>
</section>

<style>
	.what-block {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
		gap: 2rem;
		align-items: center;
	}

	@media (max-width: 860px) {
		.what-block {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.art {
		max-width: 400px;
		width: 100%;
		margin: 0 auto;
	}

	.what {
		font-size: 1.02rem;
		max-width: 75ch;
		margin: 0.5rem 0 1rem;
	}

	.muted {
		color: var(--text-muted);
		margin: 0;
	}

	.app-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.1rem 1.2rem;
		display: flex;
		flex-direction: column;
	}

	.app-card h3 {
		font-size: 1.02rem;
		margin: 0 0 0.4rem;
	}

	.app-card p {
		margin: 0 0 0.75rem;
		color: var(--text-muted);
	}

	.app-card dl {
		margin: auto 0 0;
		display: grid;
		gap: 0.15rem;
		font-size: 0.86rem;
	}

	.app-card dt {
		font-weight: 700;
		color: var(--brand-1);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-top: 0.35rem;
	}

	.app-card dd {
		margin: 0;
	}

	.sector-link {
		margin: 1rem 0 0;
		font-weight: 600;
	}
</style>
