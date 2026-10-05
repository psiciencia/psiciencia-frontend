<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { breadcrumbs } from '#lib/seo.ts';
	import Icon from '#lib/components/Icon.svelte';
	import LogoCarousel from '#lib/components/LogoCarousel.svelte';
	import PhotoHero from '#lib/components/PhotoHero.svelte';
	import Tabs from '#lib/components/Tabs.svelte';
	import { photos, type PhotoKey } from '#lib/photos.ts';
	import { reveal } from '#lib/reveal.ts';
	import { crossProblems, maturityLevels, maturityQuestions } from '#lib/sectorInsights.ts';
	import { sectorBySlug, sectors } from '#lib/sectors.ts';

	const featured = sectors.filter((s) => s.slug in photos);
	const others = sectors.filter((s) => !(s.slug in photos));
	const hasPage = (slug: string) => !!sectorBySlug(slug)?.page || slug === 'psicologia';

	const method = [
		{ title: 'Entender', text: 'La decisión que se quiere mejorar, con quienes la toman.' },
		{ title: 'Diagnosticar', text: 'Qué datos hay, su calidad y qué falta.' },
		{ title: 'Modelar', text: 'Del análisis descriptivo al modelo predictivo, siempre interpretable.' },
		{ title: 'Validar', text: 'Rendimiento, sesgos y revisión por expertos del sector.' },
		{ title: 'Desplegar y vigilar', text: 'En producción, versionado y con monitoreo de drift.' }
	];

	// Diagnóstico de madurez: cada respuesta vale 0, 1 o 2 puntos.
	let answers = $state<Record<string, number>>({});
	const answered = $derived(Object.keys(answers).length);
	const score = $derived(Object.values(answers).reduce((a, b) => a + b, 0));
	const level = $derived([...maturityLevels].reverse().find((l) => score >= l.min)!);
	const complete = $derived(answered === maturityQuestions.length);
</script>

<Seo
	title="Ciencia de datos por sector"
	description="Ciencia de datos aplicada a psicología, salud, educación, empresa, industria y agro: casos de uso, problemas comunes, comparativa y diagnóstico de madurez de datos."
	image="/og/sectores.jpg"
	imageAlt={photos.sectores.alt}
	jsonLd={[breadcrumbs([['Inicio', '/'], ['Sectores', '/sectores']])]}
/>

<PhotoHero
	photo={photos.sectores}
	title="Ciencia de datos para cada sector"
	lead="Pacientes, estudiantes, clientes, máquinas o cultivos: detrás de cada sector hay decisiones que pueden mejorar con datos. Aplicamos el mismo rigor, adaptado al lenguaje y a la ética de cada ámbito."
>
	{#snippet crumbs()}<a href="/">Inicio</a> › Sectores{/snippet}
	{#snippet eyebrow()}<Icon name="layers" size={16} /> Sectores{/snippet}
	{#snippet actions()}
		<a class="button" href="#galeria">Explorar sectores</a>
		<a class="button secondary" href="#diagnostico">Haz el diagnóstico</a>
	{/snippet}
</PhotoHero>

<section class="block" aria-labelledby="method-title">
	<h2 id="method-title" class="section-title" use:reveal>Un mismo método, adaptado a cada sector</h2>
	<p class="section-lead" use:reveal>Cambian los datos y el vocabulario; el proceso para que un modelo sea útil y fiable es el mismo.</p>
	<ol class="process">
		{#each method as step, i (step.title)}
			<li use:reveal={{ delay: i * 90 }}><span class="num">{i + 1}</span><strong>{step.title}</strong><span>{step.text}</span></li>
		{/each}
	</ol>
</section>

<section id="galeria" class="block" aria-labelledby="gallery-title">
	<h2 id="gallery-title" class="section-title" use:reveal>Sectores</h2>
	<p class="section-lead" use:reveal>Cada página incluye problemas típicos, casos de uso, ejemplos con gráficas y cómo medimos el éxito.</p>
	<div class="gallery">
		{#each featured as sector, i (sector.slug)}
			{@const photo = photos[sector.slug as PhotoKey]}
			<a class="sector-card" href="/sectores/{sector.slug}" use:reveal={{ delay: (i % 3) * 90 }}>
				<div class="thumb">
					<img src={photo.srcSmall} alt={photo.alt} loading="lazy" width="640" height="400" />
					<span class="thumb-icon"><Icon name={sector.icon} size={20} /></span>
				</div>
				<div class="body">
					<h3>{sector.name}</h3>
					<p class="tagline">{sector.tagline}</p>
					<ul>{#each sector.examples as example (example)}<li>{example}</li>{/each}</ul>
					<span class="go">Ver casos de uso →</span>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="others-title" use:reveal>Otros sectores</h3>
	<div class="card-grid">
		{#each others as sector, i (sector.slug)}
			<div class="link-card static" use:reveal={{ delay: i * 90 }}>
				<span class="icon-tile"><Icon name={sector.icon} size={20} /></span>
				<span><strong>{sector.name}</strong><small>{sector.summary}</small></span>
			</div>
		{/each}
	</div>
</section>

<section class="block" aria-labelledby="problems-title">
	<h2 id="problems-title" class="section-title" use:reveal>Seis problemas que se repiten en todos los sectores</h2>
	<p class="section-lead" use:reveal>
		Un hospital y una fábrica parecen no tener nada en común, pero ambos necesitan anticipar demanda o detectar anomalías.
		Reconocer el tipo de problema permite reutilizar técnicas probadas.
	</p>
	<Tabs tabs={crossProblems.map((p) => ({ id: p.id, label: p.label, icon: p.icon }))} label="Tipos de problema">
		{#snippet panel(id)}
			{@const problem = crossProblems.find((p) => p.id === id)!}
			<div class="problem">
				<div class="problem-summary">
					<p class="question">“{problem.question}”</p>
					<dl>
						<dt>Técnicas</dt>
						<dd>{problem.technique}</dd>
						<dt>Cómo se evalúa</dt>
						<dd>{problem.metric}</dd>
					</dl>
				</div>
				<ul class="examples">
					{#each problem.examples as example (example.sector)}
						<li>
							<span class="sector-name">{example.sector}</span>
							<span>{example.text}</span>
							{#if hasPage(example.slug)}<a href="/sectores/{example.slug}" aria-label="Ver sector {example.sector}">→</a>{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/snippet}
	</Tabs>
</section>

<section class="block compare" aria-labelledby="compare-title" use:reveal>
	<h2 id="compare-title" class="section-title">Comparativa rápida</h2>
	<div class="table-wrap">
		<table>
			<thead>
				<tr><th scope="col">Sector</th><th scope="col">Caso de uso principal</th><th scope="col">Técnicas habituales</th><th scope="col">Métrica de éxito</th></tr>
			</thead>
			<tbody>
				{#each sectors.filter((s) => s.page) as sector (sector.slug)}
					<tr>
						<th scope="row"><a href="/sectores/{sector.slug}">{sector.name}</a></th>
						<td>{sector.page!.useCases[0].title}</td>
						<td>{sector.page!.techniques.slice(0, 3).join(', ')}</td>
						<td>{sector.page!.metrics[0].name}</td>
					</tr>
				{/each}
				<tr>
					<th scope="row"><a href="/sectores/psicologia">Psicología</a></th>
					<td>Seguimiento de resultados terapéuticos</td>
					<td>Análisis factorial, modelos mixtos, NLP</td>
					<td>Mejora de síntomas por sesión</td>
				</tr>
			</tbody>
		</table>
	</div>
</section>

<section id="diagnostico" class="block" aria-labelledby="quiz-title">
	<div class="quiz" use:reveal>
		<div class="quiz-intro">
			<span class="eyebrow">Diagnóstico gratuito</span>
			<h2 id="quiz-title" class="section-title">¿En qué punto está tu organización?</h2>
			<p class="muted">Cinco preguntas para saber por dónde empezar. Las respuestas no se guardan ni se envían.</p>
			<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax={maturityQuestions.length} aria-valuenow={answered} aria-label="Preguntas respondidas">
				<span style:width="{(answered / maturityQuestions.length) * 100}%"></span>
			</div>
			<p class="progress-text">{answered} de {maturityQuestions.length} respondidas</p>

			{#if complete}
				<div class="result" aria-live="polite">
					<span class="level">Nivel: {level.label}</span>
					<p>{level.text}</p>
					<strong>Próximos pasos</strong>
					<ol>{#each level.next as step (step)}<li>{step}</li>{/each}</ol>
					<button class="button secondary" type="button" onclick={() => (answers = {})}>Repetir</button>
				</div>
			{/if}
		</div>
		<form class="questions" onsubmit={(event) => event.preventDefault()}>
			{#each maturityQuestions as q, i (q.id)}
				<fieldset>
					<legend><span class="qnum">{i + 1}</span>{q.question}</legend>
					{#each q.options as option, value (option)}
						<label class="option" class:checked={answers[q.id] === value}>
							<input type="radio" name={q.id} {value} checked={answers[q.id] === value} onchange={() => (answers = { ...answers, [q.id]: value })} />
							{option}
						</label>
					{/each}
				</fieldset>
			{/each}
		</form>
	</div>
</section>

<LogoCarousel />

<section class="cta-band" use:reveal>
	<div>
		<h2>¿Tu sector no aparece?</h2>
		<p>Los problemas se repiten: si hay decisiones y datos, hay espacio para la ciencia de datos.</p>
	</div>
	<div class="ctas">
		<a class="button light" href="/tecnologias">Ver tecnologías</a>
		<a class="button outline" href="/">Volver al inicio</a>
	</div>
</section>

<style>
	.gallery {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	.sector-card {
		display: flex;
		flex-direction: column;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 16px;
		overflow: hidden;
		color: var(--text);
		text-decoration: none;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease,
			border-color 0.25s ease;
	}

	.sector-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
		border-color: var(--accent);
	}

	.thumb {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.sector-card:hover .thumb img {
		transform: scale(1.07);
	}

	.thumb::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(0deg, rgb(8 20 38 / 45%), transparent 55%);
	}

	.thumb-icon {
		position: absolute;
		left: 12px;
		bottom: 12px;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: rgb(255 255 255 / 92%);
		color: #2a78d6;
	}

	.body {
		padding: 1rem 1.2rem 1.25rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.body h3 {
		margin: 0 0 0.25rem;
		font-size: 1.2rem;
	}

	.tagline {
		margin: 0 0 0.6rem;
		color: var(--text-muted);
	}

	.body ul {
		margin: 0 0 0.9rem;
		padding-left: 1.1rem;
		font-size: 0.92rem;
	}

	.go {
		margin-top: auto;
		color: var(--accent);
		font-weight: 600;
	}

	.others-title {
		margin: 2rem 0 0.75rem;
		font-size: 1.1rem;
	}

	.link-card.static:hover {
		transform: none;
		box-shadow: none;
		border-color: var(--border);
	}

	.problem {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
		gap: 1.5rem;
	}

	@media (max-width: 800px) {
		.problem {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.problem-summary {
		background: linear-gradient(135deg, color-mix(in srgb, var(--brand-1) 12%, var(--surface)), color-mix(in srgb, var(--brand-2) 10%, var(--surface)));
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.25rem;
	}

	.question {
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0 0 1rem;
	}

	.problem-summary dt {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-1);
		margin-top: 0.6rem;
	}

	.problem-summary dd {
		margin: 0.15rem 0 0;
	}

	.examples {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.6rem;
	}

	.examples li {
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr) auto;
		gap: 0.75rem;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.7rem 0.9rem;
	}

	.examples a {
		text-decoration: none;
		font-weight: 700;
	}

	.sector-name {
		font-weight: 700;
		color: var(--brand-1);
	}

	.compare table {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.compare td,
	.compare th {
		white-space: normal;
		vertical-align: top;
	}

	.quiz {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
		gap: 2rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	@media (max-width: 860px) {
		.quiz {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.quiz-intro {
		align-self: start;
		position: sticky;
		top: 80px;
	}

	.muted {
		color: var(--text-muted);
	}

	.progress {
		height: 8px;
		background: var(--surface-muted);
		border-radius: 999px;
		overflow: hidden;
		margin-top: 1rem;
	}

	.progress span {
		display: block;
		height: 100%;
		background: linear-gradient(90deg, #2a78d6, #1baf7a);
		border-radius: 999px;
		transition: width 0.4s ease;
	}

	.progress-text {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin: 0.4rem 0 0;
	}

	.result {
		margin-top: 1.25rem;
		border: 1px solid var(--accent);
		border-radius: var(--radius);
		padding: 1rem 1.2rem;
		animation: pop 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.level {
		display: inline-block;
		font-weight: 700;
		font-size: 1.15rem;
		background: linear-gradient(135deg, #2a78d6, #1baf7a);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.result ol {
		margin: 0.4rem 0 1rem;
		padding-left: 1.2rem;
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	fieldset {
		border: 0;
		margin: 0 0 1.25rem;
		padding: 0;
	}

	legend {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.qnum {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--surface-muted);
		font-size: 0.8rem;
		flex: none;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-weight: 400;
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.6rem 0.8rem;
		margin-bottom: 0.4rem;
		cursor: pointer;
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.option:hover {
		border-color: var(--accent);
	}

	.option.checked {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, var(--surface));
	}

	.option input {
		accent-color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.sector-card,
		.thumb img,
		.result {
			transition: none;
			animation: none;
		}
	}
</style>
