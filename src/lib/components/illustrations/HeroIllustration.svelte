<script lang="ts">
	// Ilustración del hero: un panel de modelo con gráfica, tarjetas flotantes y nodos de datos.
	// Usa los tokens de color, así que se adapta al modo claro y oscuro.
	const id = $props.id();
</script>

<svg viewBox="0 0 520 420" role="img" aria-labelledby="{id}-t" class="hero-illustration">
	<title id="{id}-t">Ilustración: panel de un modelo de machine learning en producción con métricas y gráficas</title>
	<defs>
		<linearGradient id="{id}-brand" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#2a78d6" />
			<stop offset="1" stop-color="#1baf7a" />
		</linearGradient>
		<radialGradient id="{id}-glow" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="#2a78d6" stop-opacity="0.22" />
			<stop offset="1" stop-color="#1baf7a" stop-opacity="0" />
		</radialGradient>
	</defs>

	<circle cx="270" cy="210" r="200" fill="url(#{id}-glow)" />

	<!-- Conexiones de datos de fondo -->
	<g class="links">
		<path d="M30 90 C90 60 120 140 190 110" />
		<path d="M470 330 C430 380 360 340 330 390" />
		<path d="M460 70 C500 120 470 160 500 200" />
	</g>
	<g fill="url(#{id}-brand)">
		<circle cx="30" cy="90" r="6" />
		<circle cx="190" cy="110" r="4" />
		<circle cx="470" cy="330" r="5" />
		<circle cx="330" cy="390" r="6" />
		<circle cx="460" cy="70" r="4" />
		<circle cx="500" cy="200" r="6" />
	</g>

	<!-- Panel principal -->
	<g class="panel">
		<rect x="60" y="60" width="380" height="270" rx="18" />
		<line x1="60" y1="102" x2="440" y2="102" class="divider" />
		<circle cx="88" cy="81" r="5" class="dot-a" />
		<circle cx="106" cy="81" r="5" class="dot-b" />
		<circle cx="124" cy="81" r="5" class="dot-c" />
		<rect x="300" y="74" width="116" height="14" rx="7" class="placeholder" />
	</g>
	<rect x="88" y="122" width="150" height="12" rx="6" class="placeholder strong" />
	<rect x="88" y="142" width="96" height="9" rx="4.5" class="placeholder" />

	<!-- Gráfica de línea -->
	<g class="grid">
		<line x1="88" y1="180" x2="412" y2="180" />
		<line x1="88" y1="220" x2="412" y2="220" />
		<line x1="88" y1="260" x2="412" y2="260" />
	</g>
	<path d="M88 262 L136 246 L184 252 L232 214 L280 222 L328 188 L376 192 L412 168 V300 H88 Z" class="area" />
	<path d="M88 262 L136 246 L184 252 L232 214 L280 222 L328 188 L376 192 L412 168" class="line" />
	<circle cx="412" cy="168" r="6" class="end" />

	<!-- Barras -->
	<g class="bars">
		<rect x="96" y="284" width="18" height="16" rx="4" />
		<rect x="124" y="276" width="18" height="24" rx="4" />
		<rect x="152" y="288" width="18" height="12" rx="4" />
		<rect x="180" y="270" width="18" height="30" rx="4" />
	</g>

	<!-- Tarjeta flotante: modelo en producción -->
	<g class="float">
		<rect x="300" y="16" width="200" height="64" rx="14" class="float-card" />
		<rect x="314" y="30" width="36" height="36" rx="9" fill="url(#{id}-brand)" />
		<path d="M324 40v4a8 8 0 0 0 16 0v-4M332 38v22M327 60h10" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" />
		<rect x="362" y="34" width="96" height="10" rx="5" class="placeholder strong" />
		<rect x="362" y="52" width="58" height="14" rx="7" class="pill" />
	</g>

	<!-- Tarjeta flotante: métrica -->
	<g class="float delay">
		<rect x="10" y="276" width="170" height="92" rx="14" class="float-card" />
		<text x="28" y="304" class="metric-label">R² en test</text>
		<rect x="28" y="318" width="134" height="10" rx="5" class="track" />
		<rect x="28" y="318" width="124" height="10" rx="5" fill="url(#{id}-brand)" />
		<rect x="28" y="340" width="70" height="9" rx="4.5" class="placeholder" />
	</g>
</svg>

<style>
	.hero-illustration {
		width: 100%;
		height: auto;
		max-width: 560px;
	}

	.links path {
		fill: none;
		stroke: var(--viz-axis);
		stroke-width: 1.5;
	}

	.panel rect,
	.float-card {
		fill: var(--surface);
		stroke: var(--border);
		stroke-width: 1;
		filter: drop-shadow(0 10px 24px rgb(16 24 40 / 12%));
	}

	.divider {
		stroke: var(--border);
	}

	.dot-a {
		fill: #e34948;
	}

	.dot-b {
		fill: #eda100;
	}

	.dot-c {
		fill: #1baf7a;
	}

	.placeholder {
		fill: var(--surface-muted);
	}

	.placeholder.strong {
		fill: var(--viz-axis);
	}

	.grid line {
		stroke: var(--viz-grid);
	}

	.area {
		fill: var(--series-1);
		fill-opacity: 0.1;
	}

	.line {
		fill: none;
		stroke: var(--series-1);
		stroke-width: 3;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.end {
		fill: var(--series-1);
		stroke: var(--surface);
		stroke-width: 3;
	}

	.bars rect {
		fill: var(--series-1);
		opacity: 0.35;
	}

	.pill {
		fill: var(--ok-bg);
	}

	.track {
		fill: var(--surface-muted);
	}

	.metric-label {
		fill: var(--text-muted);
		font-size: 13px;
		font-weight: 600;
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

	@media (prefers-reduced-motion: reduce) {
		.float {
			animation: none;
		}
	}
</style>
