<script lang="ts">
	// Metadatos SEO de una página: título, descripción, canónica, Open Graph, Twitter y JSON-LD.
	import { page } from '$app/state';
	import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_NAME, absolute, jsonLdScript } from '#lib/seo.ts';

	let {
		title,
		description = DEFAULT_DESCRIPTION,
		image = DEFAULT_IMAGE,
		imageAlt = SITE_NAME,
		type = 'website',
		noindex = false,
		jsonLd = []
	}: {
		/** Título sin el sufijo de marca (se añade solo). */
		title: string;
		description?: string;
		image?: string;
		imageAlt?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		jsonLd?: object[];
	} = $props();

	const fullTitle = $derived(title === SITE_NAME ? title : `${title} · ${SITE_NAME}`);
	// Canónica sin query ni hash: /sectores/agro?x=1#casos → /sectores/agro
	const canonical = $derived(absolute(page.url.pathname.replace(/\/+$/, '') || '/'));
	const imageUrl = $derived(absolute(image));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="es_LA" />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as data, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON serializado y escapado en jsonLdScript -->
		{@html jsonLdScript(data)}
	{/each}
</svelte:head>
