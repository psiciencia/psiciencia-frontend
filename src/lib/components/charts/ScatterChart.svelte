<script lang="ts">
	// Dispersión real vs. predicho con la diagonal y = x (predicción perfecta) como referencia.
	import Tooltip from './Tooltip.svelte';
	import { linear, niceTicks, pointerIn, tickFormat } from './scale.ts';

	let {
		points,
		format,
		ariaLabel,
		xName,
		yName,
		height = 300
	}: {
		points: { x: number; y: number }[];
		format: (value: number) => string;
		ariaLabel: string;
		xName: string;
		yName: string;
		height?: number;
	} = $props();

	let width = $state(520);
	let container: HTMLDivElement;
	let active = $state<number | null>(null);

	const margin = { left: 72, right: 16, top: 12, bottom: 40 };
	// Ambos ejes comparten escala: así la diagonal está a 45° y las distancias son comparables.
	const ticks = $derived(niceTicks(Math.min(...points.flatMap((p) => [p.x, p.y])), Math.max(...points.flatMap((p) => [p.x, p.y])), 4));
	const lo = $derived(ticks[0]);
	const hi = $derived(ticks[ticks.length - 1]);
	const xScale = $derived(linear(lo, hi, margin.left, width - margin.right));
	const yScale = $derived(linear(lo, hi, height - margin.bottom, margin.top));

	function nearest(px: number, py: number): number | null {
		let best: number | null = null;
		let bestDistance = 24; // radio de captura generoso: no hace falta acertar al punto
		points.forEach((p, i) => {
			const d = Math.hypot(xScale(p.x) - px, yScale(p.y) - py);
			if (d < bestDistance) {
				bestDistance = d;
				best = i;
			}
		});
		return best;
	}
</script>

<div class="chart" bind:this={container} bind:clientWidth={width}>
	<svg {width} {height} role="img" aria-label={ariaLabel}>
		{#each ticks as tick (tick)}
			<line class="grid-line" x1={margin.left} x2={width - margin.right} y1={yScale(tick)} y2={yScale(tick)} />
			<text x={margin.left - 8} y={yScale(tick)} text-anchor="end" dominant-baseline="middle">{tickFormat(tick)}</text>
			<text x={xScale(tick)} y={height - margin.bottom + 18} text-anchor="middle">{tickFormat(tick)}</text>
		{/each}
		<line class="axis-line" x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} />
		<line class="identity" x1={xScale(lo)} y1={yScale(lo)} x2={xScale(hi)} y2={yScale(hi)} />
		<text class="identity-label" x={xScale(hi) - 4} y={yScale(hi) + 14} text-anchor="end">predicción perfecta</text>
		<text x={(margin.left + width - margin.right) / 2} y={height - 4} text-anchor="middle">{xName}</text>
		<text x={12} y={(margin.top + height - margin.bottom) / 2} text-anchor="middle" transform="rotate(-90 12 {(margin.top + height - margin.bottom) / 2})">{yName}</text>

		{#each points as point, i (i)}
			<circle class="dot" class:emph={active === i} cx={xScale(point.x)} cy={yScale(point.y)} r={active === i ? 6 : 4} />
		{/each}

		<rect
			class="hit"
			x={margin.left}
			y={margin.top}
			width={Math.max(0, width - margin.left - margin.right)}
			height={Math.max(0, height - margin.top - margin.bottom)}
			role="presentation"
			onpointermove={(event) => {
				const p = pointerIn(container, event);
				active = nearest(p.x, p.y);
			}}
			onpointerleave={() => (active = null)}
		/>
	</svg>

	{#if active !== null}
		{@const p = points[active]}
		<Tooltip x={xScale(p.x)} y={yScale(p.y)} containerWidth={width}>
			<strong>{format(p.y)}</strong>
			<span class="muted">{yName}</span><br />
			<span class="muted">{xName}: {format(p.x)}</span><br />
			<span class="muted">Error: {format(p.y - p.x)}</span>
		</Tooltip>
	{/if}

	<details class="chart-data">
		<summary>Ver datos ({points.length} puntos)</summary>
		<table>
			<thead><tr><th>{xName}</th><th>{yName}</th><th>Error</th></tr></thead>
			<tbody>
				{#each points as point, i (i)}<tr><td>{format(point.x)}</td><td>{format(point.y)}</td><td>{format(point.y - point.x)}</td></tr>{/each}
			</tbody>
		</table>
	</details>
</div>

<style>
	.dot {
		fill: var(--series-1);
		fill-opacity: 0.75;
		stroke: var(--surface);
		stroke-width: 1.5;
	}

	.dot.emph {
		fill-opacity: 1;
		stroke-width: 2;
	}

	.identity {
		stroke: var(--text-muted);
		stroke-width: 1;
	}

	.identity-label {
		font-size: 11px;
	}
</style>
