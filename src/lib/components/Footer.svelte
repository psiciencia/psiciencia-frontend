<script lang="ts">
	import { MLFLOW_UI_URL } from '$app/env/public';
	import Logo from './Logo.svelte';
</script>

<footer>
	<div class="inner">
		<div class="brand">
			<Logo size={40} />
			<p>
				Ciencia de datos y machine learning llevados a producción: experimentos trazables, modelos versionados y
				monitoreo continuo.
			</p>
			<span class="badge">Proyecto en desarrollo</span>
		</div>

		<nav aria-label="Plataforma">
			<h2>Plataforma</h2>
			<a href="/">Inicio</a>
			<a href="/model">Modelo en producción</a>
			<a href="/predict">Predicción</a>
			<a href="/batch">Predicción por lote</a>
			<a href="/drift">Monitoreo de drift</a>
		</nav>

		<nav aria-label="Herramientas">
			<h2>Herramientas</h2>
			<a href={MLFLOW_UI_URL} target="_blank" rel="noreferrer">MLflow UI ↗</a>
			<span>FastAPI · inferencia</span>
			<span>Evidently · drift</span>
			<span>PostgreSQL + MinIO</span>
		</nav>

		<nav aria-label="Sectores">
			<h2>Sectores</h2>
			<a href="/sectores/psicologia">Psicología</a>
			<a href="/sectores/educacion">Educación</a>
			<a href="/sectores/empresa">Empresa</a>
			<a href="/sectores/industria">Industria</a>
			<a href="/sectores/salud">Salud</a>
			<a href="/sectores/agro">Agro</a>
			<a href="/sectores">Todos los sectores</a>
		</nav>

		<nav aria-label="Tecnologías">
			<h2>Tecnologías</h2>
			<a href="/tecnologias/realidad-extendida">Realidad extendida</a>
			<a href="/tecnologias/simulacion">Simulación</a>
			<a href="/tecnologias/iot">IoT y sensores</a>
			<a href="/tecnologias">Mapa por sector</a>
		</nav>
	</div>
	<div class="bottom">
		<span>© {new Date().getFullYear()} PsiCiencia Tech. Todos los derechos reservados.</span>
		<span>Hecho con SvelteKit, FastAPI y MLflow</span>
	</div>
</footer>

<style>
	footer {
		margin-top: 3rem;
		background: var(--surface);
		border-top: 1px solid var(--border);
		font-size: 0.9rem;
	}

	.inner {
		max-width: 1120px;
		margin: 0 auto;
		padding: 2.5rem 16px 1.5rem;
		display: grid;
		gap: 2rem;
		grid-template-columns: 1.6fr repeat(4, 1fr);
	}

	@media (max-width: 860px) {
		.inner {
			grid-template-columns: 1fr 1fr;
		}

		.brand {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 480px) {
		.inner {
			grid-template-columns: 1fr;
		}
	}

	.brand p {
		color: var(--text-muted);
		max-width: 34ch;
		margin: 0.75rem 0;
	}

	h2 {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		margin: 0 0 0.75rem;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	nav a {
		color: var(--text);
		text-decoration: none;
	}

	nav a:hover {
		color: var(--accent);
	}

	nav span {
		color: var(--text-muted);
	}

	.bottom {
		max-width: 1120px;
		margin: 0 auto;
		padding: 1rem 16px 1.5rem;
		border-top: 1px solid var(--border);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem;
		color: var(--text-muted);
		font-size: 0.82rem;
	}
</style>
