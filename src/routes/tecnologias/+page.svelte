<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { breadcrumbs } from '#lib/seo.ts';
	import Icon from '#lib/components/Icon.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import LogoCarousel from '#lib/components/LogoCarousel.svelte';
	import PhotoHero from '#lib/components/PhotoHero.svelte';
	import { photos } from '#lib/photos.ts';
	import { reveal } from '#lib/reveal.ts';
	import { sectorBySlug } from '#lib/sectors.ts';
	import { integratedCases, sectorTabs, stepRoles, technologies } from '#lib/technologies.ts';

	// Ciclo que conecta las tecnologías con la ciencia de datos.
	const cycle = [
		{ label: 'Medir', sub: 'IoT y sensores' },
		{ label: 'Aprender', sub: 'Ciencia de datos' },
		{ label: 'Explorar', sub: 'Simulación' },
		{ label: 'Experimentar', sub: 'Realidad extendida' },
		{ label: 'Decidir', sub: 'Personas' }
	];
	const R = 118;
	const cx = 180;
	const cy = 165;
	const nodes = cycle.map((step, i) => {
		const angle = -Math.PI / 2 + (i * 2 * Math.PI) / cycle.length;
		return { ...step, x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle), angle };
	});
	const arc = (i: number) => {
		const a0 = nodes[i].angle + 0.32;
		const a1 = nodes[(i + 1) % nodes.length].angle - 0.32;
		const end = a1 < a0 ? a1 + 2 * Math.PI : a1;
		return `M${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 0 1 ${cx + R * Math.cos(end)},${cy + R * Math.sin(end)}`;
	};

	const crossChallenges = [
		{ title: 'Privacidad de datos personales', text: 'Ubicación, fisiología o mirada revelan mucho de una persona: consentimiento, agregación y minimización.' },
		{ title: 'Calidad e integración', text: 'Sensores, simulaciones y visores generan formatos distintos que hay que sincronizar y limpiar.' },
		{ title: 'Validación en el mundo real', text: 'Lo que funciona en una simulación o en VR debe demostrarse en condiciones reales.' },
		{ title: 'Seguridad', text: 'Más dispositivos conectados son más superficie de ataque.' },
		{ title: 'Coste y escalabilidad', text: 'Empezar por un piloto acotado y escalar solo lo que aporta valor medible.' },
		{ title: 'Equidad y accesibilidad', text: 'Que las soluciones funcionen para todos los grupos y no excluyan a quien no tiene el dispositivo.' }
	];

	const hasSectorPage = (id: string) => !!sectorBySlug(id)?.page || id === 'psicologia';
</script>

<Seo
	title="Tecnologías y ciencia de datos"
	description="Cómo se combinan la ciencia de datos, la realidad extendida, la simulación y el IoT en psicología, salud, educación, industria, agro, empresa e investigación."
	image="/og/tecnologias.jpg"
	imageAlt={photos.tecnologias.alt}
	jsonLd={[breadcrumbs([['Inicio', '/'], ['Tecnologías', '/tecnologias']])]}
/>

<PhotoHero
	photo={photos.tecnologias}
	title="Tecnologías que amplían la ciencia de datos"
	lead="Los sensores miden el mundo real, la ciencia de datos aprende, la simulación explora qué pasaría si cambiamos algo y la realidad extendida permite vivirlo y actuar. Juntas forman un ciclo continuo de mejora."
>
	{#snippet crumbs()}<a href="/">Inicio</a> › Tecnologías{/snippet}
	{#snippet eyebrow()}<Icon name="layers" size={16} /> Tecnologías{/snippet}
	{#snippet actions()}
		<a class="button" href="#por-sector">Ver por sector</a>
		<a class="button secondary" href="#mapa">Mapa de aplicaciones</a>
	{/snippet}
</PhotoHero>

<section class="block cycle-block" aria-labelledby="cycle-title" use:reveal>
	<div>
		<h2 id="cycle-title" class="section-title">Un ciclo, no herramientas sueltas</h2>
		<p class="section-lead">
			Cada tecnología cubre una etapa. Su valor aparece cuando se conectan: lo que miden los sensores alimenta los modelos;
			los modelos calibran simulaciones; las simulaciones y los datos se viven y se usan en experiencias inmersivas; y las
			decisiones que se toman generan nuevos datos.
		</p>
		<div class="card-grid">
			{#each technologies as tech, i (tech.slug)}
				<div use:reveal={{ delay: i * 90 }}>
					<InfoCard title={tech.short} level={3} compact explain={tech.relations.map((r) => `${r.title}: ${r.text}`).join('\n\n')}>
						<div class="tech-head">
							<span class="icon-tile"><Icon name={tech.icon} size={22} /></span>
							<p class="muted">{tech.tagline}</p>
						</div>
						<a class="go" href="/tecnologias/{tech.slug}">Profundizar en {tech.short} →</a>
					</InfoCard>
				</div>
			{/each}
		</div>
	</div>
	<svg viewBox="0 0 360 330" role="img" aria-labelledby="cycle-t" class="cycle">
		<title id="cycle-t">Ciclo: medir con IoT, aprender con ciencia de datos, explorar con simulación, experimentar con realidad extendida y decidir, que vuelve a empezar</title>
		<defs>
			<linearGradient id="cycle-brand" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#2a78d6" />
				<stop offset="1" stop-color="#1baf7a" />
			</linearGradient>
			<marker id="cycle-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
				<path d="M0 0 L10 5 L0 10 Z" class="arrow-head" />
			</marker>
		</defs>
		{#each nodes as _, i (i)}
			<path class="arc" d={arc(i)} marker-end="url(#cycle-arrow)" />
		{/each}
		<circle {cx} {cy} r="44" fill="url(#cycle-brand)" class="core-circle" />
		<text x={cx} y={cy - 4} text-anchor="middle" class="core">Ciencia</text>
		<text x={cx} y={cy + 13} text-anchor="middle" class="core">de datos</text>
		{#each nodes as node (node.label)}
			<g>
				<rect class="node" x={node.x - 52} y={node.y - 22} width="104" height="44" rx="12" />
				<text x={node.x} y={node.y - 3} text-anchor="middle" class="node-label">{node.label}</text>
				<text x={node.x} y={node.y + 12} text-anchor="middle" class="node-sub">{node.sub}</text>
			</g>
		{/each}
	</svg>
</section>

<section id="por-sector" class="block" aria-labelledby="sector-title">
	<h2 id="sector-title" class="section-title">Por sector</h2>
	<p class="section-lead">Cada sector tiene dos secciones: qué aporta cada tecnología y un caso integrado donde trabajan juntas.</p>

	<nav class="sector-nav" aria-label="Ir a un sector">
		{#each sectorTabs as sector (sector.id)}
			<a href="#sector-{sector.id}"><Icon name={sector.icon} size={16} />{sector.label}</a>
		{/each}
	</nav>

	{#each sectorTabs as sector (sector.id)}
		{@const story = integratedCases[sector.id]}
		<article id="sector-{sector.id}" class="sector-block" aria-labelledby="sector-{sector.id}-title">
			<header class="sector-header" use:reveal>
				<span class="icon-tile big"><Icon name={sector.icon} size={26} /></span>
				<div>
					<h3 id="sector-{sector.id}-title">{sector.label}</h3>
					{#if hasSectorPage(sector.id)}<a class="go" href="/sectores/{sector.id}">Página del sector →</a>{/if}
				</div>
			</header>

			<section class="sub" aria-label="Aplicaciones en {sector.label}">
				<h4><span class="step-badge">1</span> Qué aporta cada tecnología</h4>
				<div class="columns">
					{#each technologies as tech, i (tech.slug)}
						<div class="column" use:reveal={{ delay: i * 90 }}>
							<h5><span class="icon-tile small"><Icon name={tech.icon} size={18} /></span>{tech.short}</h5>
							{#each tech.apps[sector.id] as app (app.title)}
								<div class="mini-app">
									<strong>{app.title}</strong>
									<p>{app.text}</p>
									<span class="technique">{app.technique}</span>
								</div>
							{/each}
							<a class="go" href="/tecnologias/{tech.slug}#{sector.id}">Más sobre {tech.short} →</a>
						</div>
					{/each}
				</div>
			</section>

			<section class="sub" aria-label="Caso integrado en {sector.label}">
				<h4><span class="step-badge">2</span> Caso integrado: {story.title}</h4>
				<p class="muted story-summary">{story.summary}</p>
				<ol class="flow">
					{#each story.steps as step, i (step.role)}
						<li use:reveal={{ delay: i * 110 }}>
							<span class="flow-role"><Icon name={stepRoles[step.role].icon} size={18} />{stepRoles[step.role].label}</span>
							<p>{step.text}</p>
						</li>
					{/each}
				</ol>
				<div class="outcome" use:reveal>
					<div>
						<strong>Resultado</strong>
						<p>{story.outcome}</p>
					</div>
					<div>
						<strong>Cómo se mide</strong>
						<ul>{#each story.kpis as kpi (kpi)}<li>{kpi}</li>{/each}</ul>
					</div>
				</div>
			</section>
		</article>
	{/each}
</section>

<section id="mapa" class="block" aria-labelledby="map-title" use:reveal>
	<h2 id="map-title" class="section-title">Mapa de aplicaciones</h2>
	<p class="section-lead">Todas las combinaciones de tecnología y sector descritas en esta web.</p>
	<div class="table-wrap map">
		<table>
			<thead>
				<tr>
					<th scope="col">Sector</th>
					{#each technologies as tech (tech.slug)}<th scope="col">{tech.short}</th>{/each}
				</tr>
			</thead>
			<tbody>
				{#each sectorTabs as sector (sector.id)}
					<tr>
						<th scope="row"><span class="row-head"><Icon name={sector.icon} size={16} />{sector.label}</span></th>
						{#each technologies as tech (tech.slug)}
							<td>
								<a href="/tecnologias/{tech.slug}#{sector.id}">
									{#each tech.apps[sector.id] as app (app.title)}<span class="cell-item">{app.title}</span>{/each}
								</a>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<section class="block" aria-labelledby="cross-title">
	<h2 id="cross-title" class="section-title" use:reveal>Retos transversales</h2>
	<div class="card-grid">
		{#each crossChallenges as challenge, i (challenge.title)}
			<div class="note-card" use:reveal={{ delay: (i % 3) * 90 }}><strong>{challenge.title}</strong><p>{challenge.text}</p></div>
		{/each}
	</div>
</section>

<LogoCarousel />

<section class="cta-band" use:reveal>
	<div>
		<h2>¿Tienes sensores, simulaciones o experiencias inmersivas generando datos?</h2>
		<p>Te ayudamos a convertirlos en modelos útiles, medibles y responsables.</p>
	</div>
	<div class="ctas">
		<a class="button light" href="/sectores">Ver sectores</a>
		<a class="button outline" href="/model">Ver la plataforma en acción</a>
	</div>
</section>

<style>
	.cycle-block {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
		gap: 2rem;
		align-items: center;
	}

	@media (max-width: 900px) {
		.cycle-block {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.cycle {
		width: 100%;
		max-width: 420px;
		height: auto;
		margin: 0 auto;
	}

	.arc {
		fill: none;
		stroke: var(--viz-axis);
		stroke-width: 2;
		stroke-dasharray: 6 5;
		animation: dash 3s linear infinite;
	}

	:global(.arrow-head) {
		fill: var(--viz-axis);
	}

	.core-circle {
		transform-origin: 180px 165px;
		animation: pulse 3.2s ease-in-out infinite;
	}

	.core {
		fill: #fff;
		font-weight: 700;
		font-size: 13px;
	}

	.node {
		fill: var(--surface);
		stroke: var(--border);
		filter: drop-shadow(0 6px 14px rgb(16 24 40 / 10%));
	}

	.node-label {
		fill: var(--text);
		font-weight: 700;
		font-size: 13px;
	}

	.node-sub {
		fill: var(--text-muted);
		font-size: 11px;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: -22;
		}
	}

	@keyframes pulse {
		50% {
			transform: scale(1.06);
		}
	}

	.tech-head {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.muted {
		color: var(--text-muted);
		margin: 0;
	}

	.go {
		font-weight: 600;
		text-decoration: none;
		font-size: 0.92rem;
	}

	.sector-nav {
		position: sticky;
		top: 58px;
		z-index: 20;
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		padding: 0.6rem 0;
		margin-bottom: 1rem;
		background: color-mix(in srgb, var(--bg) 92%, transparent);
		backdrop-filter: blur(8px);
	}

	.sector-nav a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		white-space: nowrap;
		padding: 0.4rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text);
		text-decoration: none;
		font-size: 0.88rem;
		font-weight: 600;
	}

	.sector-nav a:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.sector-block {
		scroll-margin-top: 120px;
		padding: 2rem 0;
		border-top: 1px solid var(--border);
	}

	.sector-header {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1.25rem;
	}

	.sector-header h3 {
		margin: 0;
		font-size: 1.45rem;
	}

	.icon-tile.big {
		width: 52px;
		height: 52px;
		border-radius: 14px;
	}

	.icon-tile.small {
		width: 32px;
		height: 32px;
		border-radius: 8px;
	}

	.sub {
		margin-bottom: 1.75rem;
	}

	.sub h4 {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1.08rem;
		margin: 0 0 0.85rem;
	}

	.step-badge {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: linear-gradient(135deg, #2a78d6, #1baf7a);
		color: #fff;
		font-size: 0.85rem;
		flex: none;
	}

	.columns {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.column {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.column h5 {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		font-size: 1rem;
	}

	.mini-app {
		padding-left: 0.85rem;
		border-left: 3px solid color-mix(in srgb, var(--brand-2) 55%, transparent);
	}

	.mini-app p {
		margin: 0.2rem 0 0.3rem;
		color: var(--text-muted);
		font-size: 0.92rem;
	}

	.technique {
		font-size: 0.8rem;
		background: var(--surface-muted);
		border-radius: 6px;
		padding: 0.15rem 0.45rem;
	}

	.column .go {
		margin-top: auto;
	}

	.story-summary {
		margin-bottom: 1rem;
	}

	.flow {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem;
		display: grid;
		gap: 0.9rem;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		counter-reset: flow;
	}

	@media (max-width: 900px) {
		.flow {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 520px) {
		.flow {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.flow li {
		position: relative;
		background: var(--surface);
		border: 1px solid var(--border);
		border-top: 3px solid var(--series-1);
		border-radius: var(--radius);
		padding: 0.9rem 1rem;
	}

	@media (min-width: 901px) {
		.flow li:not(:last-child)::after {
			content: '→';
			position: absolute;
			right: -0.8rem;
			top: 50%;
			transform: translateY(-50%);
			color: var(--text-muted);
			font-weight: 700;
		}
	}

	.flow-role {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 700;
		font-size: 0.85rem;
		color: var(--brand-1);
	}

	.flow p {
		margin: 0.45rem 0 0;
		font-size: 0.92rem;
	}

	.outcome {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: 1.25rem;
		background: linear-gradient(135deg, color-mix(in srgb, var(--brand-1) 10%, var(--surface)), color-mix(in srgb, var(--brand-2) 10%, var(--surface)));
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1rem 1.25rem;
	}

	@media (max-width: 700px) {
		.outcome {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.outcome p {
		margin: 0.3rem 0 0;
	}

	.outcome ul {
		margin: 0.3rem 0 0;
		padding-left: 1.1rem;
		color: var(--text-muted);
		font-size: 0.92rem;
	}

	.map table {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.map th,
	.map td {
		white-space: normal;
		vertical-align: top;
		min-width: 170px;
	}

	.row-head {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--text);
	}

	.map td a {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		text-decoration: none;
		color: var(--text);
		font-size: 0.88rem;
	}

	.map td a:hover .cell-item {
		color: var(--accent);
	}

	.cell-item::before {
		content: '•';
		color: var(--brand-2);
		margin-right: 0.35rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.arc,
		.core-circle {
			animation: none;
		}
	}
</style>
