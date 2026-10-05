<script lang="ts">
	import { page } from '$app/state';
	import Seo from '#lib/components/Seo.svelte';
</script>

<Seo title="Error {page.status}" description={page.error?.message ?? 'Algo salió mal.'} noindex />

<section class="card">
	<h1>{page.status}</h1>
	<p class="lead">{page.error?.message ?? 'Algo salió mal.'}</p>
	<a class="button" href="/">Volver al inicio</a>
</section>
