<script lang="ts">
	// Carrusel infinito con los logos de las herramientas que usa esta plataforma (no son clientes
	// ni socios). Iconos de Simple Icons (CC0); las marcas pertenecen a sus dueños.
	import {
		siDocker,
		siFastapi,
		siMinio,
		siMlflow,
		siNodedotjs,
		siNumpy,
		siPandas,
		siPnpm,
		siPostgresql,
		siPython,
		siScikitlearn,
		siSvelte,
		siTypescript,
		siUv,
		siVite
	} from 'simple-icons';

	let { title = 'Construido con' }: { title?: string } = $props();

	const logos = [siPython, siPandas, siNumpy, siScikitlearn, siMlflow, siFastapi, siPostgresql, siMinio, siDocker, siUv, siSvelte, siTypescript, siVite, siNodedotjs, siPnpm];
</script>

<section class="logos" aria-label={title}>
	<p class="logos-title">{title}</p>
	<div class="viewport">
		{#each [0, 1] as copy (copy)}
			<ul class="track" aria-hidden={copy === 1}>
				{#each logos as logo (logo.slug)}
					<li style:--brand="#{logo.hex}">
						<svg viewBox="0 0 24 24" width="30" height="30" role="img" aria-label={logo.title}><path d={logo.path} /></svg>
						<span>{logo.title}</span>
					</li>
				{/each}
			</ul>
		{/each}
	</div>
</section>

<style>
	.logos {
		margin: 2.5rem 0;
	}

	.logos-title {
		text-align: center;
		color: var(--text-muted);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin: 0 0 1rem;
	}

	.viewport {
		display: flex;
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
	}

	.track {
		display: flex;
		flex: none;
		gap: 3rem;
		padding: 0 1.5rem;
		margin: 0;
		list-style: none;
		animation: scroll 40s linear infinite;
	}

	.viewport:hover .track {
		animation-play-state: paused;
	}

	li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--text-muted);
		white-space: nowrap;
		font-weight: 600;
		transition: color 0.2s;
	}

	svg {
		fill: currentColor;
		opacity: 0.75;
		transition:
			fill 0.2s,
			opacity 0.2s,
			transform 0.2s;
	}

	li:hover {
		color: var(--text);
	}

	li:hover svg {
		fill: var(--brand);
		opacity: 1;
		transform: scale(1.12);
	}

	@keyframes scroll {
		to {
			transform: translateX(-100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.viewport {
			mask-image: none;
			flex-wrap: wrap;
			justify-content: center;
		}

		.track {
			animation: none;
			flex-wrap: wrap;
			justify-content: center;
			row-gap: 1rem;
		}

		.track[aria-hidden='true'] {
			display: none;
		}
	}
</style>
