<script lang="ts">
	// Logo provisional: la letra griega Ψ (psi) con tres nodos de datos sobre un degradado de marca.
	let { size = 36, wordmark = true }: { size?: number; wordmark?: boolean } = $props();
	const id = $props.id();
</script>

<span class="logo">
	<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
		<defs>
			<linearGradient id="{id}-g" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#2a78d6" />
				<stop offset="1" stop-color="#1baf7a" />
			</linearGradient>
		</defs>
		<rect width="64" height="64" rx="15" fill="url(#{id}-g)" />
		<g stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none">
			<path d="M19 21v7a13 13 0 0 0 26 0v-7" />
			<path d="M32 17v33" />
			<path d="M24 50h16" />
		</g>
		<g fill="#fff">
			<circle cx="19" cy="17" r="4.5" />
			<circle cx="45" cy="17" r="4.5" />
			<circle cx="32" cy="12.5" r="4.5" />
		</g>
	</svg>
	{#if wordmark}
		<span class="word">PsiCiencia <b>Tech</b></span>
	{/if}
</span>

<style>
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
	}

	.word {
		font-weight: 700;
		font-size: 1.08rem;
		letter-spacing: -0.01em;
		color: var(--text);
		white-space: nowrap;
	}

	.word b {
		color: var(--brand-1);
		font-weight: 700;
	}
</style>
