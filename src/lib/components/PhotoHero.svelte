<script lang="ts">
	// Hero a todo el ancho con foto de fondo, degradado para legibilidad, zoom lento (Ken Burns)
	// y entrada animada del texto. El crédito de la foto queda en la esquina.
	import type { Snippet } from 'svelte';
	import type { Photo } from '#lib/photos.ts';

	let {
		photo,
		eyebrow,
		title,
		lead,
		crumbs,
		actions,
		compact = false
	}: {
		photo: Photo;
		eyebrow?: Snippet;
		title: string;
		lead: string;
		crumbs?: Snippet;
		actions?: Snippet;
		compact?: boolean;
	} = $props();
</script>

<section class="photo-hero" class:compact>
	<img class="bg" src={photo.src} srcset="{photo.srcSmall} 640w, {photo.src} 1600w" sizes="100vw" alt={photo.alt} fetchpriority="high" />
	<div class="shade" aria-hidden="true"></div>
	<div class="inner">
		{#if crumbs}<nav class="hero-crumbs" aria-label="Ruta">{@render crumbs()}</nav>{/if}
		<div class="content">
			{#if eyebrow}<span class="hero-eyebrow">{@render eyebrow()}</span>{/if}
			<h1>{title}</h1>
			<p>{lead}</p>
			{#if actions}<div class="hero-actions">{@render actions()}</div>{/if}
		</div>
	</div>
	<a class="credit" href={photo.url} target="_blank" rel="noreferrer">Foto: {photo.author} · Unsplash</a>
</section>

<style>
	.photo-hero {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		margin-inline: calc(50% - 50vw);
		margin-top: -1.5rem;
		min-height: min(78vh, 620px);
		display: flex;
		align-items: flex-end;
		color: #fff;
		background: #0d1b2a;
	}

	.photo-hero.compact {
		min-height: min(62vh, 500px);
	}

	.bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -2;
		animation: kenburns 24s ease-out both;
	}

	.shade {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(90deg, rgb(8 20 38 / 88%) 0%, rgb(8 20 38 / 62%) 45%, rgb(8 20 38 / 15%) 100%),
			linear-gradient(0deg, rgb(8 20 38 / 70%) 0%, transparent 45%);
	}

	@media (max-width: 700px) {
		.shade {
			background: linear-gradient(0deg, rgb(8 20 38 / 92%) 0%, rgb(8 20 38 / 72%) 60%, rgb(8 20 38 / 45%) 100%);
		}
	}

	.inner {
		width: 100%;
		max-width: 1120px;
		margin: 0 auto;
		padding: 2rem 16px 3.5rem;
	}

	.hero-crumbs {
		font-size: 0.85rem;
		opacity: 0.85;
		margin-bottom: 2.5rem;
	}

	.hero-crumbs :global(a) {
		color: #fff;
	}

	.content {
		max-width: 640px;
		animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.hero-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background: rgb(255 255 255 / 16%);
		border: 1px solid rgb(255 255 255 / 30%);
		backdrop-filter: blur(6px);
		border-radius: 999px;
		padding: 0.3rem 0.85rem;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: clamp(2.1rem, 5vw, 3.2rem);
		line-height: 1.08;
		letter-spacing: -0.02em;
		margin: 0 0 1rem;
		text-wrap: balance;
	}

	p {
		font-size: 1.1rem;
		line-height: 1.55;
		margin: 0 0 1.75rem;
		color: rgb(255 255 255 / 88%);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.hero-actions :global(.button) {
		padding: 0.75rem 1.3rem;
	}

	.hero-actions :global(.button.secondary) {
		background: rgb(255 255 255 / 14%);
		color: #fff;
		border: 1px solid rgb(255 255 255 / 45%);
		backdrop-filter: blur(6px);
	}

	.credit {
		position: absolute;
		right: 12px;
		bottom: 8px;
		font-size: 0.72rem;
		color: rgb(255 255 255 / 70%);
		text-decoration: none;
	}

	.credit:hover {
		color: #fff;
		text-decoration: underline;
	}

	@keyframes kenburns {
		from {
			transform: scale(1.12);
		}
		to {
			transform: scale(1);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bg,
		.content {
			animation: none;
		}
	}
</style>
