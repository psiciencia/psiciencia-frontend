<script lang="ts">
	// Bloque de sector para la landing: ilustración + casos de uso + gráfica de ejemplo (snippet).
	import type { Snippet } from 'svelte';
	import type { Sector } from '#lib/sectors.ts';
	import { reveal } from '#lib/reveal.ts';
	import Icon from './Icon.svelte';
	import InfoCard from './InfoCard.svelte';
	import SectorIllustration from './illustrations/SectorIllustration.svelte';

	let {
		sector,
		reverse = false,
		chartTitle,
		chartExplain,
		chart
	}: {
		sector: Sector;
		reverse?: boolean;
		chartTitle: string;
		chartExplain: string;
		chart: Snippet;
	} = $props();

	const variant = $derived(sector.slug as 'industria' | 'empresa' | 'educacion');
	const useCases = $derived(sector.page?.useCases.slice(0, 3) ?? []);
</script>

<article class="spotlight" class:reverse aria-labelledby="spot-{sector.slug}">
	<div class="text" use:reveal>
		<span class="kicker"><Icon name={sector.icon} size={18} /> {sector.name}</span>
		<h3 id="spot-{sector.slug}">{sector.page?.headline ?? sector.name}</h3>
		<p class="lead-text">{sector.tagline} {sector.summary}</p>
		<ul class="cases">
			{#each useCases as useCase (useCase.title)}
				<li>
					<strong>{useCase.title}.</strong>
					{useCase.text}
					<span class="technique">{useCase.technique}</span>
				</li>
			{/each}
		</ul>
		<a class="button secondary" href="/sectores/{sector.slug}">Casos de uso en {sector.name.toLowerCase()} →</a>
	</div>
	<div class="visual" use:reveal={{ delay: 120 }}>
		<div class="art"><SectorIllustration {variant} /></div>
		<InfoCard title={chartTitle} subtitle="Ejemplo ilustrativo · datos sintéticos" level={3} compact explain={chartExplain}>
			{@render chart()}
		</InfoCard>
	</div>
</article>

<style>
	.spotlight {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
		gap: 2rem;
		align-items: center;
		padding: 2rem 0;
		border-top: 1px solid var(--border);
	}

	.spotlight.reverse .text {
		order: 2;
	}

	@media (max-width: 900px) {
		.spotlight {
			grid-template-columns: minmax(0, 1fr);
		}

		.spotlight.reverse .text {
			order: 0;
		}
	}

	.kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 700;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-1);
	}

	h3 {
		font-size: 1.45rem;
		margin: 0.4rem 0 0.6rem;
		letter-spacing: -0.01em;
	}

	.lead-text {
		color: var(--text-muted);
		margin: 0 0 1rem;
	}

	.cases {
		list-style: none;
		padding: 0;
		margin: 0 0 1.25rem;
		display: grid;
		gap: 0.75rem;
	}

	.cases li {
		padding-left: 1rem;
		border-left: 3px solid color-mix(in srgb, var(--brand-2) 55%, transparent);
	}

	.technique {
		display: block;
		color: var(--text-muted);
		font-size: 0.82rem;
		margin-top: 0.15rem;
	}

	.visual {
		display: grid;
		gap: 0.75rem;
	}

	.art {
		max-width: 420px;
		margin: 0 auto;
		width: 100%;
	}

	.visual :global(.card) {
		margin: 0;
	}
</style>
