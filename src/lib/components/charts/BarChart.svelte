<script lang="ts">
	// Barras horizontales de una serie: magnitud por categoría, valor en el extremo de cada barra.
	import Tooltip from './Tooltip.svelte';
	import { barPath, pointerIn } from './scale.ts';

	interface Bar {
		label: string;
		value: number;
		note?: string;
	}

	let {
		data,
		format,
		ariaLabel,
		valueName = 'Valor',
		threshold
	}: {
		data: Bar[];
		format: (value: number) => string;
		ariaLabel: string;
		valueName?: string;
		threshold?: { value: number; label: string };
	} = $props();

	let width = $state(560);
	let container: HTMLDivElement;
	let active = $state<number | null>(null);
	let pointer = $state({ x: 0, y: 0 });

	const rowH = 34;
	const barH = 18;
	const valueW = 84;
	const top = $derived(threshold ? 22 : 4);
	const labelW = $derived(Math.min(180, Math.max(64, Math.max(...data.map((d) => d.label.length)) * 7 + 14)));
	const plotW = $derived(Math.max(40, width - labelW - valueW));
	const max = $derived(Math.max(...data.map((d) => d.value), threshold?.value ?? 0) || 1);
	const height = $derived(top + data.length * rowH);
	const x = (value: number) => labelW + (Math.max(value, 0) / max) * plotW;
	// Etiquetas largas se acortan con "…"; el nombre completo aparece en el tooltip y en la tabla.
	const maxChars = $derived(Math.floor((labelW - 14) / 7));
	const short = (label: string) => (label.length > maxChars ? label.slice(0, maxChars - 1) + '…' : label);
</script>

<div class="chart" bind:this={container} bind:clientWidth={width}>
	<svg {width} {height} role="group" aria-label={ariaLabel}>
		{#if threshold}
			<line class="threshold" x1={x(threshold.value)} x2={x(threshold.value)} y1={top - 6} y2={height} />
			<text x={x(threshold.value)} y={12} text-anchor="middle">{threshold.label}</text>
		{/if}
		{#each data as bar, i (bar.label)}
			{@const y = top + i * rowH}
			<g class:dim={active !== null && active !== i}>
				<text class="label" x={labelW - 10} y={y + rowH / 2} dominant-baseline="middle" text-anchor="end">
					{short(bar.label)}
				</text>
				<path class="mark-1" d={barPath(labelW, y + (rowH - barH) / 2, x(bar.value) - labelW, barH, 'right')} />
				<text class="value" x={x(bar.value) + 6} y={y + rowH / 2} dominant-baseline="middle">
					{format(bar.value)}
				</text>
			</g>
			<rect
				class="hit"
				x="0"
				{y}
				{width}
				height={rowH}
				role="presentation"
				onpointermove={(event) => {
					active = i;
					pointer = pointerIn(container, event);
				}}
				onpointerleave={() => (active = null)}
			/>
		{/each}
	</svg>

	{#if active !== null}
		<Tooltip x={pointer.x} y={pointer.y} containerWidth={width}>
			<strong>{format(data[active].value)}</strong>
			<span class="muted">{data[active].label}</span>
			{#if data[active].note}<br /><span class="muted">{data[active].note}</span>{/if}
		</Tooltip>
	{/if}

	<details class="chart-data">
		<summary>Ver datos</summary>
		<table>
			<thead><tr><th>Categoría</th><th>{valueName}</th></tr></thead>
			<tbody>
				{#each data as bar (bar.label)}<tr><td>{bar.label}</td><td>{format(bar.value)}</td></tr>{/each}
			</tbody>
		</table>
	</details>
</div>

<style>
	.label {
		fill: var(--text);
		font-size: 13px;
	}

	.value {
		fill: var(--text);
		font-weight: 600;
	}

	.threshold {
		stroke: var(--text-muted);
		stroke-width: 1;
	}

	.hit {
		cursor: default;
	}
</style>
