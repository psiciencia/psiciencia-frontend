<script lang="ts">
	// Ilustraciones de tecnologías (SVG con tokens de color: se adaptan al modo claro y oscuro).
	import type { TechSlug } from '#lib/technologies.ts';

	let { variant }: { variant: TechSlug } = $props();
	const id = $props.id();

	const titles: Record<TechSlug, string> = {
		'realidad-extendida': 'Ilustración: visor de realidad virtual con paneles de realidad aumentada que muestran datos y un mapa de mirada',
		simulacion: 'Ilustración: red de agentes simulados y abanico de escenarios posibles',
		iot: 'Ilustración: sensores conectados enviando datos a una plataforma en la nube'
	};

	// Simulación: agentes en rejilla y abanico de escenarios.
	const agents = Array.from({ length: 30 }, (_, i) => ({ x: 70 + (i % 6) * 34, y: 90 + Math.floor(i / 6) * 34, hot: [3, 8, 9, 14, 15, 20].includes(i) }));
	const fan = [-46, -30, -16, -4, 8, 20, 34];

	// IoT: sensores alrededor de la nube.
	const sensors = [
		{ x: 70, y: 250 },
		{ x: 150, y: 300 },
		{ x: 330, y: 300 },
		{ x: 410, y: 250 },
		{ x: 60, y: 140 },
		{ x: 420, y: 140 }
	];
</script>

<svg viewBox="0 0 480 360" role="img" aria-labelledby="{id}-t" class="tech-illustration">
	<title id="{id}-t">{titles[variant]}</title>
	<defs>
		<linearGradient id="{id}-brand" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#2a78d6" />
			<stop offset="1" stop-color="#1baf7a" />
		</linearGradient>
		<radialGradient id="{id}-glow" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="#2a78d6" stop-opacity="0.18" />
			<stop offset="1" stop-color="#1baf7a" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="{id}-heat" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="#eb6834" stop-opacity="0.85" />
			<stop offset="1" stop-color="#eb6834" stop-opacity="0" />
		</radialGradient>
	</defs>
	<circle cx="240" cy="180" r="175" fill="url(#{id}-glow)" />

	{#if variant === 'realidad-extendida'}
		<!-- Visor -->
		<path class="panel" d="M120 170h240a30 30 0 0 1 30 30v40a30 30 0 0 1-30 30h-62l-26-30h-44l-26 30h-82a30 30 0 0 1-30-30v-40a30 30 0 0 1 30-30Z" />
		<path d="M150 150h180v20H150Z" fill="url(#{id}-brand)" />
		<circle cx="188" cy="220" r="24" class="lens" />
		<circle cx="292" cy="220" r="24" class="lens" />
		<!-- Panel AR con gráfica -->
		<g class="float">
			<rect class="card glass" x="40" y="30" width="170" height="104" rx="14" />
			<text x="56" y="54" class="label">Datos en contexto</text>
			<path class="line" d="M58 116 L84 104 L110 108 L136 88 L162 92 L192 70" />
			<circle class="end" cx="192" cy="70" r="5" />
		</g>
		<!-- Panel con mapa de mirada -->
		<g class="float delay">
			<rect class="card glass" x="290" y="20" width="160" height="114" rx="14" />
			<text x="306" y="44" class="label">Mapa de mirada</text>
			<rect class="placeholder" x="306" y="56" width="128" height="62" rx="8" />
			<circle cx="352" cy="82" r="22" fill="url(#{id}-heat)" />
			<circle cx="404" cy="98" r="14" fill="url(#{id}-heat)" />
		</g>
		<g class="float">
			<rect class="card" x="330" y="290" width="130" height="44" rx="12" />
			<circle cx="350" cy="312" r="8" fill="url(#{id}-brand)" />
			<rect class="bubble" x="366" y="307" width="78" height="10" rx="5" />
		</g>
	{:else if variant === 'simulacion'}
		<rect class="panel" x="40" y="60" width="230" height="200" rx="18" />
		{#each agents as agent, i (i)}
			{#if i % 6 !== 5}<line class="link" x1={agent.x} y1={agent.y} x2={agent.x + 34} y2={agent.y} />{/if}
			{#if i < 24}<line class="link" x1={agent.x} y1={agent.y} x2={agent.x} y2={agent.y + 34} />{/if}
		{/each}
		{#each agents as agent, i (i)}
			<circle cx={agent.x} cy={agent.y} r="8" class:hot={agent.hot} class="agent" />
		{/each}
		<g class="float">
			<rect class="card" x="230" y="120" width="230" height="170" rx="16" />
			<text x="248" y="146" class="label">Escenarios simulados</text>
			{#each fan as d, i (i)}
				<path class="scenario" d="M252 250 C300 240 350 {230 + d} 440 {200 + d * 1.6}" />
			{/each}
			<path class="line" d="M252 250 C300 240 350 230 440 200" />
			<circle class="end" cx="440" cy="200" r="5" />
		</g>
		<g class="float delay">
			<rect class="card" x="60" y="280" width="150" height="50" rx="12" />
			<path d="M76 316 l10 -14 l10 8 l10 -12 l10 6" class="mini" />
			<rect class="bubble" x="128" y="300" width="64" height="10" rx="5" />
		</g>
	{:else}
		<!-- Nube / plataforma -->
		<path class="panel" d="M170 150a40 40 0 0 1 4-79 60 60 0 0 1 113-6 46 46 0 0 1 22 85Z" />
		<text x="240" y="122" text-anchor="middle" class="label strong">Plataforma de datos</text>
		{#each sensors as sensor, i (i)}
			<path class="signal" d="M{sensor.x} {sensor.y} Q {(sensor.x + 240) / 2} {(sensor.y + 140) / 2 - 30} 240 150" />
		{/each}
		{#each sensors as sensor, i (i)}
			<g>
				<rect class="card" x={sensor.x - 22} y={sensor.y - 22} width="44" height="44" rx="11" />
				<circle cx={sensor.x} cy={sensor.y} r="7" fill="url(#{id}-brand)" />
				<path class="wave" d="M{sensor.x - 12} {sensor.y - 12} a17 17 0 0 1 24 0" />
			</g>
		{/each}
		<g class="float">
			<rect class="card" x="170" y="200" width="140" height="80" rx="14" />
			<text x="184" y="222" class="label">Telemetría</text>
			<path class="line" d="M184 262 L204 258 L224 262 L244 254 L264 256 L284 240 L298 232" />
			<circle class="end" cx="298" cy="232" r="5" />
		</g>
	{/if}
</svg>

<style>
	.tech-illustration {
		width: 100%;
		height: auto;
	}

	.panel,
	.card {
		fill: var(--surface);
		stroke: var(--border);
		stroke-width: 1.2;
		filter: drop-shadow(0 10px 24px rgb(16 24 40 / 12%));
	}

	.card.glass {
		fill-opacity: 0.94;
		stroke: var(--series-1);
		stroke-opacity: 0.5;
	}

	.lens {
		fill: var(--surface-muted);
		stroke: var(--viz-axis);
		stroke-width: 3;
	}

	.label {
		fill: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
	}

	.label.strong {
		fill: var(--text);
		font-size: 13px;
	}

	.line {
		fill: none;
		stroke: var(--series-1);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.end {
		fill: var(--series-1);
		stroke: var(--surface);
		stroke-width: 2.5;
	}

	.placeholder,
	.bubble {
		fill: var(--surface-muted);
	}

	.bubble {
		fill: var(--viz-axis);
	}

	.link {
		stroke: var(--viz-axis);
		stroke-width: 1.2;
	}

	.agent {
		fill: var(--series-1);
		stroke: var(--surface);
		stroke-width: 2;
	}

	.agent.hot {
		fill: var(--series-2);
	}

	.scenario {
		fill: none;
		stroke: var(--series-1);
		stroke-opacity: 0.28;
		stroke-width: 2;
	}

	.mini {
		fill: none;
		stroke: var(--series-2);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.signal {
		fill: none;
		stroke: var(--series-1);
		stroke-width: 1.5;
		stroke-dasharray: 5 6;
		stroke-opacity: 0.6;
		animation: flow 2.4s linear infinite;
	}

	.wave {
		fill: none;
		stroke: var(--brand-2);
		stroke-width: 2;
		stroke-linecap: round;
	}

	.float {
		animation: float 6s ease-in-out infinite;
	}

	.float.delay {
		animation-delay: -3s;
	}

	@keyframes float {
		50% {
			transform: translateY(-6px);
		}
	}

	@keyframes flow {
		to {
			stroke-dashoffset: -22;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.float,
		.signal {
			animation: none;
		}
	}
</style>
