<script lang="ts">
	// Número que cuenta desde 0 hasta su valor al aparecer en pantalla.
	import { onMount } from 'svelte';

	let { value, format = (v: number) => String(Math.round(v)), duration = 1200 }: { value: number; format?: (v: number) => string; duration?: number } =
		$props();

	let shown = $state<number | null>(null);
	let el: HTMLSpanElement;

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		shown = 0;
		const io = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) return;
			io.disconnect();
			const start = performance.now();
			const tick = (now: number) => {
				const t = Math.min(1, (now - start) / duration);
				shown = value * (1 - (1 - t) ** 3); // ease-out cúbico
				if (t < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		});
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<span bind:this={el} aria-label={format(value)}>{format(shown ?? value)}</span>
