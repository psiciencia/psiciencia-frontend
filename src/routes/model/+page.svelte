<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { MLFLOW_UI_URL } from '$app/env/public';
	import BarChart from '#lib/components/charts/BarChart.svelte';
	import Histogram from '#lib/components/charts/Histogram.svelte';
	import LineChart from '#lib/components/charts/LineChart.svelte';
	import ScatterChart from '#lib/components/charts/ScatterChart.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import { formatDate, formatMetric } from '#lib/format.ts';
	import { binsFromEdges, histogram, mean } from '#lib/stats.ts';
	import type { Bin } from '#lib/types.ts';

	let { data } = $props();
	const model = $derived(data.model);
	const mlflowLink = $derived(
		model?.name && model.version ? `${MLFLOW_UI_URL}/#/models/${model.name}/versions/${model.version}` : MLFLOW_UI_URL
	);

	const metricLabels: Record<string, string> = { r2: 'R²', mae: 'MAE', mse: 'MSE' };
	const metricExplain: Record<string, string> = {
		r2: 'R²: proporción de la variación real que explica el modelo (1 = perfecto, 0 = igual que predecir la media).',
		mae: 'MAE: error absoluto medio. En las mismas unidades que el objetivo; "de media me equivoco en X".',
		mse: 'MSE: error cuadrático medio. Penaliza más los errores grandes; sus unidades son las del objetivo al cuadrado.'
	};

	const versionSeries = (metric: string) =>
		(data.history?.versions ?? [])
			.filter((v) => v.metrics[metric] !== undefined)
			.map((v) => ({ x: v.version, y: v.metrics[metric], highlight: v.aliases.length ? `@${v.aliases[0]}` : undefined }));

	const importanceBars = $derived(
		(data.importance?.features ?? []).map((f) => ({
			label: f.sign ? `${f.feature} (${f.sign})` : f.feature,
			value: f.importance,
			note: f.sign ? (f.sign === '+' ? 'Al aumentar, sube la predicción' : 'Al aumentar, baja la predicción') : undefined
		}))
	);

	const scatter = $derived(data.evaluation ? data.evaluation.y_true.map((y, i) => ({ x: y, y: data.evaluation!.y_pred[i] })) : []);
	const residuals = $derived(data.evaluation ? data.evaluation.y_true.map((y, i) => y - data.evaluation!.y_pred[i]) : []);
	const residualHist = $derived(residuals.length ? histogram(residuals, 18) : null);

	const referenceHists = $derived(
		Object.entries(data.distribution?.histograms ?? {}).map(([column, h]) => {
			const bins: Bin[] = h.discrete ? h.values.map((v) => ({ label: formatMetric(v), start: v, end: v })) : binsFromEdges(h.edges);
			return { column, bins, counts: h.counts };
		})
	);
</script>

<Seo
	title="Modelo en producción"
	description="Ficha del modelo de machine learning en producción: versión, métricas, importancia de variables, real vs. predicho, residuos y distribución de los datos."
	image="/og/plataforma.jpg"
/>

<h1>Modelo en producción</h1>
<p class="lead">Qué modelo responde a las predicciones, cómo se entrenó y qué tan bien funciona.</p>

{#if model}
	<InfoCard
		title={model.name ?? model.model_uri}
		subtitle="Ficha del modelo"
		explain={'Esta es la versión que la API usa para responder. La URI models:/<nombre>@champion se resuelve en MLflow a una versión concreta del Model Registry.\n\nEl run es el entrenamiento que produjo el modelo: en MLflow puedes ver su código fuente, parámetros y artefactos.'}
	>
		<div class="title-row">
			{#if model.version}<span class="badge">versión {model.version}</span>{/if}
			{#each model.aliases as alias (alias)}<span class="badge ok">@{alias}</span>{/each}
		</div>
		<dl>
			<dt>URI servida</dt>
			<dd><code>{model.model_uri}</code></dd>
			{#if model.experiment}<dt>Experimento</dt><dd>{model.experiment}</dd>{/if}
			{#if model.created_at}<dt>Registrada</dt><dd>{formatDate(model.created_at)}</dd>{/if}
			{#if model.run_id}<dt>Run</dt><dd><code>{model.run_id}</code></dd>{/if}
			{#if data.importance}<dt>Algoritmo</dt><dd>{data.importance.model_type}</dd>{/if}
		</dl>
		<a class="button secondary" href={mlflowLink} target="_blank" rel="noreferrer">Ver en MLflow ↗</a>
	</InfoCard>

	{#if Object.keys(model.metrics).length}
		<div class="metrics">
			{#each Object.entries(model.metrics) as [name, value] (name)}
				<InfoCard title={metricLabels[name] ?? name} level={3} compact explain={metricExplain[name] ?? 'Métrica registrada durante el entrenamiento.'}>
					<div class="metric-value">{formatMetric(value)}</div>
				</InfoCard>
			{/each}
		</div>
	{/if}

	<div class="two-col">
		<InfoCard
			title="Evolución por versión"
			subtitle="R² en test de cada versión registrada"
			explain={'Compara la calidad de todas las versiones del modelo con la misma métrica. Ayuda a decidir si una versión nueva merece ser promovida a @champion.\n\nPara comparar de forma justa, todas se evalúan con la misma partición de test (random_state=42).'}
		>
			{#if versionSeries('r2').length}
				<LineChart points={versionSeries('r2')} format={formatMetric} xFormat={(v) => `v${v}`} xName="Versión" yName="R²" ariaLabel="R² por versión" />
			{:else}
				<p class="muted-note">Sin historial de versiones.</p>
			{/if}
		</InfoCard>
		<InfoCard
			title="Error medio por versión"
			subtitle="MAE en test (más bajo es mejor)"
			explain={'El MAE expresa el error típico en las unidades del objetivo. Es más fácil de comunicar que el R²: "de media, la predicción se desvía X del valor real".\n\nSe muestra en una gráfica aparte del R² porque tienen escalas distintas.'}
		>
			{#if versionSeries('mae').length}
				<LineChart points={versionSeries('mae')} format={formatMetric} xFormat={(v) => `v${v}`} xName="Versión" yName="MAE" ariaLabel="MAE por versión" />
			{:else}
				<p class="muted-note">Sin historial de versiones.</p>
			{/if}
		</InfoCard>
	</div>

	<InfoCard
		title="Importancia de variables"
		subtitle={data.importance?.method ?? 'No disponible para este tipo de modelo'}
		explain={'Indica cuánto influye cada variable en las predicciones, a nivel global.\n\nEn modelos lineales (Ridge) se usa el coeficiente multiplicado por la desviación estándar: el efecto de mover la variable una desviación típica. El signo (+/−) indica si sube o baja la predicción. En árboles (RandomForest) se usa la reducción media de impureza.'}
	>
		{#if importanceBars.length}
			<BarChart data={importanceBars} format={formatMetric} valueName="Importancia" ariaLabel="Importancia de cada variable" />
		{:else}
			<p class="muted-note">El modelo servido no expone importancia de variables.</p>
		{/if}
	</InfoCard>

	<div class="two-col">
		<InfoCard
			title="Real vs. predicho"
			subtitle="Conjunto de test ({scatter.length} observaciones)"
			explain={'Cada punto es una observación de test: en el eje X el valor real y en el Y lo que predijo el modelo. Cuanto más cerca de la diagonal, mejor.\n\nSi los puntos se separan de la diagonal en una zona (por ejemplo, valores altos), el modelo tiene un sesgo en ese rango.'}
		>
			{#if scatter.length}
				<ScatterChart points={scatter} format={formatMetric} xName="Valor real" yName="Predicción" ariaLabel="Valor real frente a predicción en test" />
			{:else}
				<p class="muted-note">Esta versión no guardó predicciones de evaluación. Reentrena con <code>src/train.py</code> para obtenerlas.</p>
			{/if}
		</InfoCard>
		<InfoCard
			title="Distribución de residuos"
			subtitle={residuals.length ? `Residuo = real − predicho · media ${formatMetric(mean(residuals))}` : 'Residuo = real − predicho'}
			explain={'El residuo es el error de cada predicción. Un buen modelo tiene residuos centrados en 0 y con forma de campana simétrica.\n\nSi la campana está desplazada, el modelo sobreestima o subestima de forma sistemática; si tiene colas largas, hay casos que predice muy mal.'}
		>
			{#if residualHist}
				<Histogram bins={residualHist.bins} series={[{ name: 'Observaciones', values: residualHist.counts }]} format={(v) => String(Math.round(v))} marker={{ value: 0, label: 'error 0' }} ariaLabel="Histograma de residuos" />
			{:else}
				<p class="muted-note">Sin predicciones de evaluación para esta versión.</p>
			{/if}
		</InfoCard>
	</div>

	{#if referenceHists.length}
		<InfoCard
			title="Distribución de las variables de entrada"
			subtitle="Dataset de referencia ({data.distribution?.rows} filas)"
			explain={'Así son los datos "normales" que conoce el modelo. Predecir fuera de estos rangos es extrapolar: el modelo no ha visto casos parecidos y su respuesta es menos fiable.\n\nEstas mismas distribuciones son la base de comparación del monitoreo de drift.'}
		>
			<div class="small-multiples">
				{#each referenceHists as h (h.column)}
					<div>
						<h3>{h.column}</h3>
						<Histogram bins={h.bins} series={[{ name: 'Filas', values: h.counts }]} format={(v) => String(Math.round(v))} height={150} ariaLabel="Distribución de {h.column}" />
					</div>
				{/each}
			</div>
		</InfoCard>
	{/if}

	{#if Object.keys(model.params).length}
		<InfoCard
			title="Hiperparámetros"
			explain={'Configuración elegida antes de entrenar (no se aprende de los datos). Por ejemplo, alpha en Ridge controla cuánto se penalizan los coeficientes grandes para evitar sobreajuste.'}
		>
			<dl>
				{#each Object.entries(model.params) as [name, value] (name)}
					<dt>{name}</dt>
					<dd><code>{value}</code></dd>
				{/each}
			</dl>
		</InfoCard>
	{/if}
{/if}

<style>
	.title-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.4rem 1rem;
		margin: 0 0 1rem;
	}

	dt {
		color: var(--text-muted);
	}

	dd {
		margin: 0;
		min-width: 0;
	}

	.metrics {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		margin-bottom: 1rem;
	}

	.metrics :global(.card) {
		margin: 0;
	}

	.metric-value {
		font-size: 1.9rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.two-col {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		margin-bottom: 1rem;
	}

	.two-col :global(.card) {
		margin: 0;
	}
</style>
