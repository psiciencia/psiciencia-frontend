<script lang="ts">
	// Tarjeta con explicación contextual: al dejar el cursor sobre ella (modo guía activo) o al pulsar
	// el botón "i" aparece un globo que explica qué muestra y qué proceso hay detrás.
	import type { Snippet } from 'svelte';
	import { guide } from '#lib/guide.svelte.ts';

	let {
		title,
		explain,
		subtitle,
		level = 2,
		compact = false,
		children
	}: {
		title: string;
		explain: string;
		subtitle?: string;
		level?: 2 | 3;
		compact?: boolean;
		children?: Snippet;
	} = $props();

	const id = $props.id();
	let hovered = $state(false);
	let pinned = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	const open = $derived(pinned || (guide.enabled && hovered));
	const paragraphs = $derived(explain.split('\n\n'));

	function enter(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		clearTimeout(timer);
		// Un pequeño retardo evita que los globos parpadeen al cruzar la página con el ratón.
		timer = setTimeout(() => (hovered = true), 400);
	}

	function leave() {
		clearTimeout(timer);
		hovered = false;
		pinned = false;
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (open && event.key === 'Escape') leave();
	}}
/>

<section
	class="card info-card"
	class:compact
	class:open
	class:guided={guide.enabled}
	aria-labelledby="{id}-title"
	onpointerenter={enter}
	onpointerleave={leave}
>
	<header>
		<div class="titles">
			<svelte:element this={`h${level}`} id="{id}-title">{title}</svelte:element>
			{#if subtitle}<p class="subtitle">{subtitle}</p>{/if}
		</div>
		<button
			type="button"
			class="info-btn"
			aria-label="¿Qué es «{title}»?"
			aria-expanded={open}
			aria-controls="{id}-explain"
			onclick={() => (pinned = !pinned)}
		>
			<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
				<circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5" />
				<path d="M10 9v5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
				<circle cx="10" cy="6.3" r="1.1" fill="currentColor" />
			</svg>
		</button>
	</header>

	<div class="explain" id="{id}-explain" role="note" aria-hidden={!open}>
		<span class="explain-title">¿Qué estás viendo?</span>
		{#each paragraphs as paragraph, i (i)}<p>{paragraph}</p>{/each}
	</div>

	{@render children?.()}
</section>

<style>
	.info-card {
		position: relative;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.info-card.guided:hover {
		border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
	}

	/* La tarjeta activa se dibuja por encima de sus vecinas para que el globo no quede tapado. */
	.info-card:hover,
	.info-card.open {
		z-index: 6;
	}

	.info-card.compact {
		padding: 1rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.titles :global(h2),
	.titles :global(h3) {
		margin: 0;
	}

	.titles :global(h3) {
		font-size: 1rem;
	}

	.subtitle {
		color: var(--text-muted);
		font-size: 0.88rem;
		margin: 0.2rem 0 0;
	}

	.info-btn {
		flex: none;
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-muted);
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s,
			background 0.15s;
	}

	.info-card.guided:hover .info-btn,
	.open .info-btn {
		color: var(--accent);
		border-color: var(--accent);
	}

	.explain {
		position: absolute;
		z-index: 20;
		top: 3.1rem;
		right: 0.75rem;
		width: min(360px, calc(100% - 1.5rem));
		background: var(--surface);
		border: 1px solid var(--accent);
		border-radius: 10px;
		box-shadow: var(--shadow-lg);
		padding: 0.8rem 0.95rem;
		font-size: 0.88rem;
		line-height: 1.5;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-6px);
		transition:
			opacity 0.18s,
			transform 0.18s,
			visibility 0.18s;
		pointer-events: none;
	}

	.explain::before {
		content: '';
		position: absolute;
		top: -6px;
		right: 0.6rem;
		width: 10px;
		height: 10px;
		background: var(--surface);
		border-left: 1px solid var(--accent);
		border-top: 1px solid var(--accent);
		transform: rotate(45deg);
	}

	.open .explain {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
		pointer-events: auto;
	}

	.explain-title {
		display: block;
		font-weight: 700;
		color: var(--accent);
		margin-bottom: 0.25rem;
	}

	.explain p {
		margin: 0 0 0.45rem;
		color: var(--text);
	}

	.explain p:last-child {
		margin-bottom: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.explain {
			transition: none;
		}
	}
</style>
