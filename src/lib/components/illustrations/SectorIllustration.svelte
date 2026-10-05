<script lang="ts">
	// Ilustraciones por sector (SVG con tokens de color: se adaptan al modo claro y oscuro).
	type Variant = 'psicologia' | 'industria' | 'empresa' | 'educacion' | 'salud' | 'agro';
	let { variant }: { variant: Variant } = $props();
	const id = $props.id();

	const titles: Record<Variant, string> = {
		psicologia: 'Ilustración: perfil de una cabeza con una red de datos en su interior, un gráfico de progreso terapéutico y un mensaje',
		industria: 'Ilustración: fábrica con engranaje y un sensor cuya señal de vibración supera un umbral',
		empresa: 'Ilustración: panel de negocio con barras de ventas crecientes, un pronóstico y un gráfico circular',
		educacion: 'Ilustración: birrete de graduación, libro abierto y gráfico del progreso de estudiantes',
		salud: 'Ilustración: reloj inteligente que mide el ritmo cardiaco, con una cruz médica y una alerta',
		agro: 'Ilustración: parcela de cultivo con un sensor de humedad del suelo y un dron'
	};

	// Red de nodos dentro de la cabeza (psicología).
	const nodes = [
		[150, 120], [190, 95], [235, 110], [270, 140], [175, 160], [220, 160], [255, 190], [190, 205], [145, 185]
	];
	const links = [
		[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 5], [5, 6], [4, 7], [5, 7], [7, 8], [4, 8], [0, 8]
	];
</script>

<svg viewBox="0 0 480 360" role="img" aria-labelledby="{id}-t" class="sector-illustration">
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
	</defs>
	<circle cx="240" cy="180" r="175" fill="url(#{id}-glow)" />

	{#if variant === 'psicologia'}
		<path class="panel" d="M150 318V262C108 240 88 202 88 160C88 94 140 46 206 46C272 46 318 92 320 152L344 194C348 202 344 209 335 210L320 212V238C320 252 309 262 295 262H266V318Z" />
		{#each links as [a, b], i (i)}
			<line class="link" x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
		{/each}
		{#each nodes as [x, y], i (i)}
			<circle cx={x} cy={y} r={i === 5 ? 11 : 7} fill="url(#{id}-brand)" class="node" />
		{/each}
		<g class="float">
			<rect class="card" x="336" y="34" width="130" height="92" rx="14" />
			<text x="350" y="56" class="label">Progreso</text>
			<path class="line" d="M352 70 L374 74 L396 86 L418 98 L448 108" />
			<circle class="end" cx="448" cy="108" r="5" />
		</g>
		<g class="float delay">
			<rect class="card" x="20" y="236" width="118" height="70" rx="14" />
			<rect class="bubble" x="34" y="252" width="90" height="10" rx="5" />
			<rect class="bubble soft" x="34" y="270" width="64" height="10" rx="5" />
			<rect class="bubble soft" x="34" y="288" width="78" height="8" rx="4" />
		</g>
	{:else if variant === 'industria'}
		<path class="panel" d="M60 300V170L130 205V170L200 205V130H236L246 96H268L278 130V300Z" />
		<rect class="window" x="80" y="240" width="34" height="26" rx="4" />
		<rect class="window" x="140" y="240" width="34" height="26" rx="4" />
		<rect class="window" x="200" y="240" width="34" height="26" rx="4" />
		<circle cx="252" cy="70" r="10" class="smoke" />
		<circle cx="268" cy="46" r="14" class="smoke" />
		<g class="gear">
			<circle cx="128" cy="120" r="34" class="gear-ring" stroke="url(#{id}-brand)" />
			<circle cx="128" cy="120" r="14" fill="url(#{id}-brand)" />
		</g>
		<g class="float">
			<rect class="card" x="276" y="150" width="190" height="130" rx="14" />
			<text x="292" y="174" class="label">Vibración del rodamiento</text>
			<line class="threshold" x1="292" x2="450" y1="206" y2="206" />
			<path class="line" d="M292 250 L306 246 L320 252 L334 245 L348 249 L362 244 L376 247 L390 238 L404 228 L418 214 L432 198 L446 184" />
			<circle class="alert" cx="404" cy="228" r="6" />
		</g>
		<g class="float delay">
			<rect class="card" x="300" y="290" width="150" height="40" rx="12" />
			<circle cx="320" cy="310" r="7" class="alert" />
			<rect class="bubble" x="336" y="305" width="98" height="10" rx="5" />
		</g>
	{:else if variant === 'empresa'}
		<rect class="panel" x="50" y="56" width="300" height="230" rx="18" />
		<rect class="bubble soft" x="74" y="78" width="120" height="12" rx="6" />
		<line class="grid" x1="74" x2="326" y1="250" y2="250" />
		{#each [42, 58, 54, 78, 92, 118, 132] as h, i (i)}
			<rect class="bar" x={82 + i * 34} y={250 - h} width="20" height={h} rx="4" />
		{/each}
		<path class="forecast" d="M92 196 L126 182 L160 186 L194 162 L228 148 L262 124 L296 108 L326 92" />
		<g class="float">
			<rect class="card" x="300" y="20" width="150" height="110" rx="14" />
			<circle cx="350" cy="76" r="30" class="donut-track" />
			<circle cx="350" cy="76" r="30" class="donut" stroke="url(#{id}-brand)" pathLength="100" stroke-dasharray="64 100" transform="rotate(-90 350 76)" />
			<rect class="bubble" x="392" y="62" width="44" height="9" rx="4.5" />
			<rect class="bubble soft" x="392" y="80" width="32" height="9" rx="4.5" />
		</g>
		<g class="float delay">
			<rect class="card" x="290" y="232" width="160" height="80" rx="14" />
			<rect x="306" y="250" width="44" height="44" rx="11" fill="url(#{id}-brand)" />
			<path d="M318 282 L328 272 L334 278 L342 266" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
			<rect class="bubble" x="362" y="258" width="72" height="10" rx="5" />
			<rect class="bubble soft" x="362" y="276" width="50" height="10" rx="5" />
		</g>
	{:else if variant === 'salud'}
		<rect class="panel" x="150" y="60" width="180" height="240" rx="48" />
		<rect x="198" y="20" width="84" height="44" rx="10" class="strap" />
		<rect x="198" y="296" width="84" height="44" rx="10" class="strap" />
		<rect x="172" y="84" width="136" height="192" rx="34" class="screen" />
		<path class="line" d="M184 190 H214 L224 166 L238 214 L250 150 L262 200 L272 190 H296" />
		<text x="240" y="244" text-anchor="middle" class="label">72 lpm</text>
		<g class="float">
			<rect class="card" x="340" y="70" width="110" height="90" rx="14" />
			<path d="M395 92v46M372 115h46" stroke="url(#{id}-brand)" stroke-width="12" stroke-linecap="round" />
		</g>
		<g class="float delay">
			<rect class="card" x="24" y="210" width="128" height="76" rx="14" />
			<circle cx="46" cy="236" r="8" class="alert" />
			<rect class="bubble" x="62" y="231" width="72" height="10" rx="5" />
			<rect class="bubble soft" x="40" y="256" width="94" height="10" rx="5" />
		</g>
	{:else if variant === 'agro'}
		<path class="panel" d="M40 300 L120 190 H360 L440 300Z" />
		{#each [0, 1, 2, 3, 4] as row (row)}
			<path class="row" d="M{150 + row * 45} 196 L{90 + row * 75} 296" />
		{/each}
		{#each [[120, 262], [168, 230], [262, 262], [300, 226], [356, 262]] as [x, y], i (i)}
			<g transform="translate({x} {y})">
				<path class="stem" d="M0 0 V-22" />
				<path class="leaf" d="M0 -12 C-14 -18 -16 -30 -16 -30 C-4 -28 0 -20 0 -12Z" />
				<path class="leaf" d="M0 -18 C14 -24 16 -36 16 -36 C4 -34 0 -26 0 -18Z" />
			</g>
		{/each}
		<rect x="228" y="200" width="10" height="70" rx="3" class="strap" />
		<circle cx="233" cy="196" r="10" fill="url(#{id}-brand)" />
		<path class="wave" d="M219 182 a20 20 0 0 1 28 0" />
		<g class="float">
			<rect x="300" y="64" width="60" height="16" rx="8" class="strap" />
			<line x1="286" y1="72" x2="374" y2="72" class="tassel" />
			<circle cx="286" cy="66" r="10" class="rotor" />
			<circle cx="374" cy="66" r="10" class="rotor" />
			<path d="M330 80 L300 150 H360Z" class="beam" />
		</g>
		<g class="float delay">
			<rect class="card" x="20" y="40" width="140" height="86" rx="14" />
			<text x="34" y="62" class="label">Humedad del suelo</text>
			<path class="line" d="M36 108 L60 100 L84 106 L108 94 L132 102 L148 90" />
		</g>
	{:else}
		<path class="panel" d="M70 230 L176 206 L240 222 L304 206 L410 230 V300 L304 276 L240 292 L176 276 L70 300Z" />
		<line class="grid" x1="240" x2="240" y1="222" y2="292" />
		<path d="M150 112 L240 72 L330 112 L240 152Z" fill="url(#{id}-brand)" />
		<path class="panel" d="M186 132 V168 C186 184 294 184 294 168 V132 L240 156Z" />
		<line x1="330" y1="112" x2="330" y2="160" class="tassel" />
		<circle cx="330" cy="164" r="6" fill="url(#{id}-brand)" />
		<g class="float">
			<rect class="card" x="20" y="40" width="140" height="100" rx="14" />
			<text x="34" y="62" class="label">Riesgo</text>
			{#each [30, 44, 26, 58, 20] as h, i (i)}
				<rect class="bar" class:hot={h > 50} x={36 + i * 22} y={124 - h} width="14" height={h} rx="3" />
			{/each}
		</g>
		<g class="float delay">
			<rect class="card" x="330" y="30" width="134" height="86" rx="14" />
			<text x="344" y="52" class="label">Aprendizaje</text>
			<path class="line" d="M346 98 L370 90 L394 84 L418 72 L448 62" />
			<circle class="end" cx="448" cy="62" r="5" />
		</g>
	{/if}
</svg>

<style>
	.sector-illustration {
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

	.link,
	.grid,
	.tassel {
		stroke: var(--viz-axis);
		stroke-width: 1.5;
	}

	.node {
		stroke: var(--surface);
		stroke-width: 2;
	}

	.label {
		fill: var(--text-muted);
		font-size: 12px;
		font-weight: 600;
	}

	.line {
		fill: none;
		stroke: var(--series-1);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.forecast {
		fill: none;
		stroke: var(--series-2);
		stroke-width: 3;
		stroke-dasharray: 6 6;
		stroke-linecap: round;
	}

	.end {
		fill: var(--series-1);
		stroke: var(--surface);
		stroke-width: 2.5;
	}

	.bubble {
		fill: var(--viz-axis);
	}

	.bubble.soft {
		fill: var(--surface-muted);
	}

	.bar {
		fill: var(--series-1);
		opacity: 0.8;
	}

	.bar.hot {
		fill: var(--series-2);
		opacity: 1;
	}

	.screen {
		fill: var(--surface-muted);
	}

	.strap {
		fill: var(--viz-axis);
	}

	.row,
	.stem {
		stroke: var(--brand-2);
		stroke-width: 2;
		fill: none;
	}

	.row {
		stroke: var(--viz-axis);
	}

	.leaf {
		fill: var(--brand-2);
	}

	.wave {
		fill: none;
		stroke: var(--series-1);
		stroke-width: 2.5;
		stroke-linecap: round;
	}

	.rotor {
		fill: var(--surface-muted);
		stroke: var(--viz-axis);
		stroke-width: 2;
	}

	.beam {
		fill: var(--series-1);
		opacity: 0.12;
	}

	.window {
		fill: var(--surface-muted);
	}

	.smoke {
		fill: var(--surface-muted);
		stroke: var(--border);
	}

	.gear-ring {
		fill: none;
		stroke-width: 12;
		stroke-dasharray: 10 6;
	}

	.threshold {
		stroke: var(--text-muted);
		stroke-width: 1;
		stroke-dasharray: 4 4;
	}

	.alert {
		fill: var(--series-2);
		stroke: var(--surface);
		stroke-width: 2;
	}

	.donut-track {
		fill: none;
		stroke: var(--surface-muted);
		stroke-width: 12;
	}

	.donut {
		fill: none;
		stroke-width: 12;
		stroke-linecap: round;
	}

	.float {
		animation: float 6s ease-in-out infinite;
	}

	.float.delay {
		animation-delay: -3s;
	}

	.gear {
		transform-origin: 128px 120px;
		animation: spin 18s linear infinite;
	}

	@keyframes float {
		50% {
			transform: translateY(-6px);
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.float,
		.gear {
			animation: none;
		}
	}
</style>
