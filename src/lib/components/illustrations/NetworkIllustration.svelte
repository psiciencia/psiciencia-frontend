<script lang="ts">
	// Ilustración "sobre el proyecto": de los datos a la predicción a través de una red de nodos.
	const id = $props.id();
	const layers = [
		[70, 140, 210, 280],
		[105, 175, 245],
		[105, 175, 245],
		[175]
	];
	const xs = [70, 190, 310, 430];
	const links = layers.slice(0, -1).flatMap((layer, l) =>
		layer.flatMap((y1) => layers[l + 1].map((y2) => ({ x1: xs[l], y1, x2: xs[l + 1], y2 })))
	);
</script>

<svg viewBox="0 0 500 350" role="img" aria-labelledby="{id}-t" class="network">
	<title id="{id}-t">Ilustración: red neuronal que transforma variables de entrada en una predicción</title>
	<defs>
		<linearGradient id="{id}-brand" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#2a78d6" />
			<stop offset="1" stop-color="#1baf7a" />
		</linearGradient>
	</defs>
	<rect x="1" y="1" width="498" height="348" rx="20" class="frame" />
	{#each links as link, i (i)}
		<line class="link" x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} />
	{/each}
	{#each layers as layer, l (l)}
		{#each layer as y (y)}
			<circle cx={xs[l]} cy={y} r={l === 3 ? 20 : 13} fill={l === 0 ? 'var(--surface)' : `url(#${id}-brand)`} class:input={l === 0} />
		{/each}
	{/each}
	<path d="M422 167v3a8 8 0 0 0 16 0v-3M430 165v20M425 185h10" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" />
	<text x="70" y="322" text-anchor="middle">datos</text>
	<text x="250" y="322" text-anchor="middle">modelo</text>
	<text x="430" y="322" text-anchor="middle">predicción</text>
</svg>

<style>
	.network {
		width: 100%;
		height: auto;
	}

	.frame {
		fill: var(--surface);
		stroke: var(--border);
	}

	.link {
		stroke: var(--viz-axis);
		stroke-width: 1;
		opacity: 0.8;
	}

	.input {
		stroke: var(--series-1);
		stroke-width: 2.5;
	}

	text {
		fill: var(--text-muted);
		font-size: 14px;
		font-weight: 600;
	}
</style>
