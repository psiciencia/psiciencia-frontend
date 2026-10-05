<script lang="ts">
	import type { Snippet } from 'svelte';

	let { x, y, containerWidth, children }: { x: number; y: number; containerWidth: number; children: Snippet } =
		$props();

	// El globo se mantiene dentro del ancho de la gráfica.
	const left = $derived(Math.max(0, Math.min(x + 12, containerWidth - 210)));
</script>

<div class="chart-tip" style:left="{left}px" style:top="{y - 10}px" role="status">
	{@render children()}
</div>
