<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Footer from '#lib/components/Footer.svelte';
	import Logo from '#lib/components/Logo.svelte';
	import { guide } from '#lib/guide.svelte.ts';

	let { data, children } = $props();

	const links = [
		{ href: '/', label: 'Inicio' },
		{ href: '/sectores', label: 'Sectores' },
		{ href: '/tecnologias', label: 'Tecnologías' },
		{ href: '/model', label: 'Modelo' },
		{ href: '/predict', label: 'Predicción' },
		{ href: '/batch', label: 'Lote CSV' },
		{ href: '/drift', label: 'Drift' }
	];

	onMount(() => guide.restore());
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="icon" href="/icons/icon-192.png" sizes="192x192" type="image/png" />
	<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#2a78d6" />
</svelte:head>

<a class="skip" href="#contenido">Saltar al contenido</a>

<header>
	<div class="bar">
		<a class="brand" href="/" aria-label="PsiCiencia Tech, inicio"><Logo size={34} /></a>
		<nav aria-label="Principal">
			{#each links as link (link.href)}
				<a href={link.href} aria-current={page.url.pathname === link.href || (link.href !== '/' && page.url.pathname.startsWith(link.href + '/')) ? 'page' : undefined}>{link.label}</a>
			{/each}
		</nav>
		<div class="tools">
			<label class="guide-toggle" title="Muestra explicaciones al pasar el cursor por cada tarjeta">
				<input type="checkbox" bind:checked={guide.enabled} />
				<span class="switch" aria-hidden="true"></span>
				Modo guía
			</label>
			{#if data.model}
				<a class="badge ok" href="/model" title={data.model.model_uri}>
					{data.model.name ?? 'modelo'} v{data.model.version ?? '?'}
				</a>
			{:else if data.apiError}
				<span class="badge danger">API sin conexión</span>
			{:else}
				<span class="badge">Sin modelo</span>
			{/if}
		</div>
	</div>
</header>

<main id="contenido">
	{#if data.apiError}
		<div class="alert danger" role="alert">{data.apiError}</div>
	{:else if !data.health?.model_configured}
		<div class="alert warn" role="alert">
			La API no tiene modelo configurado. Define <code>MODEL_URI</code> en <code>.env</code> y ejecuta
			<code>docker compose up -d api</code>.
		</div>
	{/if}
	{@render children()}
</main>

<Footer />

<style>
	.skip {
		position: absolute;
		left: -999px;
		top: 0;
		background: var(--accent);
		color: var(--accent-text);
		padding: 0.5rem 1rem;
		z-index: 100;
	}

	.skip:focus {
		left: 0.5rem;
	}

	header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--surface) 88%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--border);
	}

	.bar {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0.6rem 16px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1.5rem;
	}

	.brand {
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: 0.15rem;
		flex: 1;
		overflow-x: auto;
	}

	nav a {
		color: var(--text-muted);
		text-decoration: none;
		padding: 0.4rem 0.7rem;
		border-radius: 6px;
		white-space: nowrap;
	}

	nav a:hover {
		color: var(--text);
	}

	nav a[aria-current='page'] {
		background: var(--surface-muted);
		color: var(--text);
		font-weight: 600;
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}

	.tools .badge {
		text-decoration: none;
	}

	.guide-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-muted);
		cursor: pointer;
		white-space: nowrap;
	}

	.guide-toggle input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}

	.switch {
		position: relative;
		width: 32px;
		height: 18px;
		border-radius: 999px;
		background: var(--viz-axis);
		transition: background 0.15s;
	}

	.switch::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.15s;
	}

	.guide-toggle input:checked + .switch {
		background: var(--accent);
	}

	.guide-toggle input:checked + .switch::after {
		transform: translateX(14px);
	}

	.guide-toggle input:focus-visible + .switch {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	main {
		max-width: 1120px;
		margin: 0 auto;
		padding: 1.5rem 16px 1rem;
	}
</style>
