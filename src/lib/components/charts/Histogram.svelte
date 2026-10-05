<script lang="ts">
	// Histograma de una o dos series (p. ej. referencia vs. datos actuales), con marcador opcional.
	import type { Bin } from '#lib/types.ts';
	import Tooltip from './Tooltip.svelte';
	import { barPath, linear, niceTicks, pointerIn, tickFormat } from './scale.ts';

	interface Series {
		name: string;
		values: number[];
	}

	let {
		bins,
		series,
		format,
		ariaLabel,
		height = 180,
		marker,
		showLegend = true
	}: {
		bins: Bin[];
		series: Series[];
		format: (value: number) => string;
		ariaLabel: string;
		height?: number;
		marker?: { value: number; label: string };
		showLegend?: boolean;
	} = $props();

	let width = $state(520);
	let container: HTMLDivElement;
	let active = $state<number | null>(null);
	let pointer = $state({ x: 0, y: 0 });

	const margin = $derived({ left: 44, right: 10, top: marker ? 24 : 10, bottom: 26 });
	const yTicks = $derived(niceTicks(0, Math.max(...series.flatMap((s) => s.values), 0) || 1, 3).filter((t) => t >= 0));
	const yScale = $derived(linear(0, yTicks[yTicks.length - 1], height - margin.bottom, margin.top));
	const band = $derived(Math.max(0, width - margin.left - margin.right) / Math.max(bins.length, 1));
	const barW = $derived(Math.max(1, (band - 2) / series.length - (series.length > 1 ? 1 : 0)));
	const labelEvery = $derived(Math.max(1, Math.ceil(bins.length / Math.max(2, Math.floor((width - 60) / 70)))));

	const markerX = $derived.by(() => {
		if (!marker) return null;
		const index = bins.findIndex((b) => b.start !== undefined && b.end !== undefined && marker.value >= b.start && marker.value <= b.end);
		if (index === -1) {
			const first = bins.find((b) => b.start !== undefined);
			return first && marker.value < (first.start ?? 0) ? margin.left : width - margin.right;
		}
		const bin = bins[index];
		const fraction = bin.end! > bin.start! ? (marker.value - bin.start!) / (bin.end! - bin.start!) : 0.5;
		return margin.left + (index + fraction) * band;
	});

	function tickLabel(bin: Bin) {
		if (bin.start === undefined) return bin.label;
		return bin.start === bin.end ? bin.label : tickFormat(bin.start);
	}
</script>

<div class="chart" bind:this={container} bind:clientWidth={width}>
	{#if series.length > 1 && showLegend}
		<div class="legend" aria-hidden="true">
			{#each series as s, i (s.name)}<span><span class="swatch" style:background="var(--series-{i + 1})"></span>{s.name}</span>{/each}
		</div>
	{/if}
	<svg {width} {height} role="img" aria-label={ariaLabel}>
		{#each yTicks as tick (tick)}
			<line class="grid-line" x1={margin.left} x2={width - margin.right} y1={yScale(tick)} y2={yScale(tick)} />
			<text x={margin.left - 6} y={yScale(tick)} text-anchor="end" dominant-baseline="middle">{format(tick)}</text>
		{/each}

		{#each bins as bin, i (i)}
			{@const x0 = margin.left + i * band + 1}
			<g class:dim={active !== null && active !== i}>
				{#each series as s, k (s.name)}
					{@const y = yScale(s.values[i] ?? 0)}
					<path class="mark-{k + 1}" d={barPath(x0 + k * (barW + 2), y, barW, height - margin.bottom - y, 'up')} />
				{/each}
			</g>
			{#if i % labelEvery === 0}
				<text x={bin.start === bin.end || bin.start === undefined ? x0 + band / 2 : x0} y={height - margin.bottom + 16} text-anchor={bin.start === bin.end || bin.start === undefined ? 'middle' : 'start'}>{tickLabel(bin)}</text>
			{/if}
			<rect
				class="hit"
				x={margin.left + i * band}
				y={margin.top}
				width={band}
				height={height - margin.top - margin.bottom}
				role="presentation"
				onpointermove={(event) => {
					active = i;
					pointer = pointerIn(container, event);
				}}
				onpointerleave={() => (active = null)}
			/>
		{/each}
		<line class="axis-line" x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} />

		{#if marker && markerX !== null}
			<line class="marker" x1={markerX} x2={markerX} y1={margin.top - 6} y2={height - margin.bottom} />
			<text class="marker-label" x={Math.min(Math.max(markerX, 60), width - 60)} y={12} text-anchor="middle">{marker.label}</text>
		{/if}
	</svg>

	{#if active !== null}
		<Tooltip x={pointer.x} y={pointer.y} containerWidth={width}>
			{#each series as s, k (s.name)}
				<div><span class="key" style:background="var(--series-{k + 1})"></span><strong style:display="inline">{format(s.values[active] ?? 0)}</strong> <span class="muted">{series.length > 1 ? s.name : ''}</span></div>
			{/each}
			<span class="muted">{bins[active].label}</span>
		</Tooltip>
	{/if}

	<details class="chart-data">
		<summary>Ver datos</summary>
		<table>
			<thead><tr><th>Intervalo</th>{#each series as s (s.name)}<th>{s.name}</th>{/each}</tr></thead>
			<tbody>
				{#each bins as bin, i (i)}
					<tr><td>{bin.label}</td>{#each series as s (s.name)}<td>{format(s.values[i] ?? 0)}</td>{/each}</tr>
				{/each}
			</tbody>
		</table>
	</details>
</div>

<style>
	.marker {
		stroke: var(--text);
		stroke-width: 1.5;
	}

	.marker-label {
		fill: var(--text);
		font-weight: 600;
	}
</style>
