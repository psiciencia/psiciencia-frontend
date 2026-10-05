<script lang="ts">
	// Línea (una o dos series) con crosshair: la línea vertical busca la X más cercana y el tooltip
	// muestra el valor de todas las series en esa X.
	import Tooltip from './Tooltip.svelte';
	import { formatterFor, linear, niceTicks, pointerIn, tickFormat } from './scale.ts';

	interface Point {
		x: number;
		y: number;
		/** Texto destacado sobre el punto, p. ej. "@champion". */
		highlight?: string;
	}

	let {
		points,
		format,
		xFormat = (v: number) => tickFormat(v),
		ariaLabel,
		xName,
		yName,
		height = 200,
		xTicks = 'points',
		marker,
		name,
		secondary,
		yThreshold,
		yDomain
	}: {
		points: Point[];
		format: (value: number) => string;
		xFormat?: (value: number) => string;
		ariaLabel: string;
		xName: string;
		yName: string;
		height?: number;
		/** "points": un tick por punto (versiones); "nice": ticks redondos (variables continuas). */
		xTicks?: 'points' | 'nice';
		marker?: { x: number; label: string };
		/** Nombre de la serie principal (solo se muestra si hay serie secundaria). */
		name?: string;
		/** Segunda serie opcional (p. ej. pronóstico, trayectoria esperada). */
		secondary?: { name: string; points: { x: number; y: number }[] };
		/** Línea horizontal de referencia (p. ej. punto de corte clínico, umbral de alarma). */
		yThreshold?: { value: number; label: string };
		/** Fija el dominio Y (escalas con rango conocido, como un cuestionario de 0 a 27). */
		yDomain?: [number, number];
	} = $props();

	let width = $state(520);
	let container: HTMLDivElement;
	let activeX = $state<number | null>(null);

	const margin = $derived({ left: 56, right: 18, top: 24, bottom: 28 });
	const allX = $derived([...new Set([...points.map((p) => p.x), ...(secondary?.points.map((p) => p.x) ?? [])])].sort((a, b) => a - b));
	const xMin = $derived(allX[0]);
	const xMax = $derived(allX[allX.length - 1]);
	// Rango mínimo del eje: el 2 % del valor medio. Evita que diferencias de ruido (p. ej. R² 0,98797
	// frente a 0,98799) se dibujen como picos dramáticos.
	const yTicks = $derived.by(() => {
		if (yDomain) return niceTicks(yDomain[0], yDomain[1]);
		const ys = [...points.map((p) => p.y), ...(secondary?.points.map((p) => p.y) ?? [])];
		if (yThreshold) ys.push(yThreshold.value);
		let lo = Math.min(...ys);
		let hi = Math.max(...ys);
		const minSpan = Math.abs((lo + hi) / 2) * 0.02;
		if (hi - lo < minSpan) {
			const mid = (lo + hi) / 2;
			lo = mid - minSpan / 2;
			hi = mid + minSpan / 2;
		}
		return niceTicks(lo, hi);
	});
	const yTickFormat = $derived(formatterFor(yTicks));
	const xScale = $derived(linear(xMin, xMax === xMin ? xMin + 1 : xMax, margin.left + 8, width - margin.right - 8));
	const yScale = $derived(linear(yTicks[0], yTicks[yTicks.length - 1], height - margin.bottom, margin.top));
	const xTickValues = $derived.by(() => {
		if (xTicks === 'nice') return niceTicks(xMin, xMax, 4).filter((t) => t >= xMin && t <= xMax);
		// Un tick por punto, pero sin amontonarlos: como máximo uno cada ~48 px.
		const every = Math.max(1, Math.ceil(allX.length / Math.max(2, Math.floor((width - 80) / 48))));
		return allX.filter((_, i) => i % every === 0);
	});
	const toPath = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${xScale(p.x)},${yScale(p.y)}`).join('');

	const at = (pts: { x: number; y: number }[], x: number) => pts.find((p) => p.x === x);
	const activePrimary = $derived(activeX === null ? undefined : at(points, activeX));
	const activeSecondary = $derived(activeX === null || !secondary ? undefined : at(secondary.points, activeX));

	function nearest(px: number): number {
		let best = allX[0];
		for (const x of allX) if (Math.abs(xScale(x) - px) < Math.abs(xScale(best) - px)) best = x;
		return best;
	}
</script>

<div class="chart" bind:this={container} bind:clientWidth={width}>
	{#if secondary}
		<div class="legend" aria-hidden="true">
			<span><span class="line-key"></span>{name ?? yName}</span>
			<span><span class="line-key secondary"></span>{secondary.name}</span>
		</div>
	{/if}
	<svg {width} {height} role="img" aria-label={ariaLabel}>
		{#each yTicks as tick (tick)}
			<line class="grid-line" x1={margin.left} x2={width - margin.right} y1={yScale(tick)} y2={yScale(tick)} />
			<text x={margin.left - 8} y={yScale(tick)} text-anchor="end" dominant-baseline="middle">{yTickFormat(tick)}</text>
		{/each}
		<line class="axis-line" x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} />
		{#each xTickValues as tick (tick)}
			<text x={xScale(tick)} y={height - margin.bottom + 18} text-anchor="middle">{xFormat(tick)}</text>
		{/each}

		{#if yThreshold}
			<line class="threshold" x1={margin.left} x2={width - margin.right} y1={yScale(yThreshold.value)} y2={yScale(yThreshold.value)} />
			<text class="threshold-label" x={margin.left + 6} y={yScale(yThreshold.value) - 6} text-anchor="start">{yThreshold.label}</text>
		{/if}

		{#if marker}
			<line class="marker" x1={xScale(marker.x)} x2={xScale(marker.x)} y1={margin.top - 6} y2={height - margin.bottom} />
			<text class="marker-label" x={Math.min(Math.max(xScale(marker.x), margin.left + 40), width - 50)} y={margin.top - 10} text-anchor="middle">{marker.label}</text>
		{/if}

		{#if activeX !== null}
			<line class="crosshair" x1={xScale(activeX)} x2={xScale(activeX)} y1={margin.top} y2={height - margin.bottom} />
		{/if}

		{#if secondary}
			<path class="line secondary" d={toPath(secondary.points)} />
			{#if activeSecondary}<circle class="dot secondary" cx={xScale(activeSecondary.x)} cy={yScale(activeSecondary.y)} r="5" />{/if}
		{/if}

		<path class="line" d={toPath(points)} />
		{#if points.length <= 40}
			{#each points as point, i (i)}
				<circle class="dot" cx={xScale(point.x)} cy={yScale(point.y)} r={point.highlight || activeX === point.x ? 5.5 : 4} />
				{#if point.highlight}
					<text class="highlight" x={xScale(point.x)} y={yScale(point.y) - 12} text-anchor="middle">{point.highlight}</text>
				{/if}
			{/each}
		{:else if activePrimary}
			<circle class="dot" cx={xScale(activePrimary.x)} cy={yScale(activePrimary.y)} r="5.5" />
		{/if}

		<rect
			class="hit"
			x={margin.left}
			y={margin.top}
			width={Math.max(0, width - margin.left - margin.right)}
			height={Math.max(0, height - margin.top - margin.bottom)}
			role="presentation"
			onpointermove={(event) => (activeX = nearest(pointerIn(container, event).x))}
			onpointerleave={() => (activeX = null)}
		/>
	</svg>

	{#if activeX !== null}
		{@const anchor = activePrimary ?? activeSecondary}
		<Tooltip x={xScale(activeX)} y={anchor ? yScale(anchor.y) : margin.top} containerWidth={width}>
			{#if activePrimary}
				<div>{#if secondary}<span class="key" style:background="var(--series-1)"></span>{/if}<strong style:display="inline">{format(activePrimary.y)}</strong> <span class="muted">{secondary ? (name ?? yName) : yName}</span></div>
			{/if}
			{#if activeSecondary && secondary}
				<div><span class="key" style:background="var(--series-2)"></span><strong style:display="inline">{format(activeSecondary.y)}</strong> <span class="muted">{secondary.name}</span></div>
			{/if}
			<span class="muted">{xName} {xFormat(activeX)}</span>
			{#if activePrimary && 'highlight' in activePrimary && activePrimary.highlight}<br /><span class="muted">{activePrimary.highlight}</span>{/if}
		</Tooltip>
	{/if}

	<details class="chart-data">
		<summary>Ver datos</summary>
		<table>
			<thead>
				<tr><th>{xName}</th><th>{secondary ? (name ?? yName) : yName}</th>{#if secondary}<th>{secondary.name}</th>{/if}</tr>
			</thead>
			<tbody>
				{#each allX as x (x)}
					{@const p = at(points, x)}
					{@const s = secondary ? at(secondary.points, x) : undefined}
					<tr><td>{xFormat(x)}</td><td>{p ? format(p.y) : '—'}</td>{#if secondary}<td>{s ? format(s.y) : '—'}</td>{/if}</tr>
				{/each}
			</tbody>
		</table>
	</details>
</div>

<style>
	.line {
		fill: none;
		stroke: var(--series-1);
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.line.secondary {
		stroke: var(--series-2);
	}

	.dot {
		fill: var(--series-1);
		stroke: var(--surface);
		stroke-width: 2;
	}

	.dot.secondary {
		fill: var(--series-2);
	}

	.line-key {
		display: inline-block;
		width: 14px;
		height: 2px;
		background: var(--series-1);
		vertical-align: middle;
		margin-right: 0.35rem;
	}

	.line-key.secondary {
		background: var(--series-2);
	}

	.highlight {
		fill: var(--text);
		font-weight: 600;
	}

	.crosshair {
		stroke: var(--viz-axis);
		stroke-width: 1;
	}

	.marker,
	.threshold {
		stroke: var(--text-muted);
		stroke-width: 1;
	}

	.marker-label,
	.threshold-label {
		fill: var(--text);
		font-weight: 600;
	}
</style>
