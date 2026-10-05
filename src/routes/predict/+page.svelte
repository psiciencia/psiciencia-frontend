<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { enhance } from '$app/forms';
	import Histogram from '#lib/components/charts/Histogram.svelte';
	import LineChart from '#lib/components/charts/LineChart.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import { formatMetric, formatNumber, isInteger } from '#lib/format.ts';
	import { histogram } from '#lib/stats.ts';

	let { data, form } = $props();
	const model = $derived(data.model);
	const mae = $derived(model?.metrics.mae);

	// Valores iniciales: la media del dataset de referencia, para que el formulario se pueda probar ya.
	let values = $state<Record<string, number | null>>({});
	$effect.pre(() => {
		for (const column of model?.input_schema ?? []) {
			if (values[column.name] === undefined) {
				const mean = model?.reference?.features[column.name]?.mean;
				values[column.name] =
					mean === undefined ? null : isInteger(column.type) ? Math.round(mean) : Number(mean.toFixed(2));
			}
		}
	});

	let submitting = $state(false);

	function outOfRange(name: string): boolean {
		const stats = model?.reference?.features[name];
		const value = values[name];
		return !!stats && value !== null && value !== undefined && (value < stats.min || value > stats.max);
	}

	const context = $derived(data.evaluation ? histogram(data.evaluation.y_true, 20) : null);
	const percentile = $derived(
		data.evaluation && form?.prediction !== undefined
			? data.evaluation.y_true.filter((v) => v <= form.prediction!).length / data.evaluation.y_true.length
			: null
	);
</script>

<Seo
	title="Predicción individual"
	description="Haz una predicción con el modelo en producción, con margen de error típico, contexto y análisis what-if por variable."
	image="/og/plataforma.jpg"
/>

<h1>Predicción individual</h1>
<p class="lead">El formulario se genera a partir de la firma del modelo registrado en MLflow.</p>

{#if model}
	<div class="layout">
		<InfoCard
			title="Datos de entrada"
			subtitle="Valores iniciales: la media del dataset de referencia"
			explain={'Cada campo corresponde a una variable que el modelo espera, según su firma (schema) guardada en MLflow.\n\nDebajo de cada campo ves el rango observado en los datos de entrenamiento. Fuera de ese rango el modelo extrapola y su predicción es menos fiable.'}
		>
			<form
				method="POST"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update({ reset: false });
						submitting = false;
					};
				}}
			>
				<div class="fields">
					{#each model.input_schema as column (column.name)}
						{@const stats = model.reference?.features[column.name]}
						<div>
							<label for={column.name}>{column.name}</label>
							<input
								id={column.name}
								name={column.name}
								type="number"
								step={isInteger(column.type) ? 1 : 'any'}
								required
								bind:value={values[column.name]}
								aria-describedby="{column.name}-hint"
							/>
							<div class="hint" id="{column.name}-hint">
								{#if stats}rango {formatMetric(stats.min)} – {formatMetric(stats.max)}{/if}
								{#if outOfRange(column.name)}<span class="out"> · fuera de rango</span>{/if}
							</div>
						</div>
					{/each}
				</div>
				<button class="button" disabled={submitting}>{submitting ? 'Calculando…' : 'Predecir'}</button>
			</form>
		</InfoCard>

		<InfoCard
			title="Resultado"
			explain={'La predicción es el valor que estima el modelo para los datos introducidos.\n\nEl margen típico (± MAE) es el error absoluto medio que tuvo el modelo en datos de test: no es un intervalo de confianza formal, pero da una idea honesta de cuánto puede desviarse.'}
		>
			<div aria-live="polite">
				{#if form?.error}
					<div class="alert danger">{form.error}</div>
				{:else if form?.prediction !== undefined}
					<div class="value">{formatNumber(form.prediction)}</div>
					{#if mae !== undefined}
						<p class="margin">± {formatNumber(mae)} <span>margen típico (MAE)</span></p>
					{/if}
					<p class="hint">{model.name ?? 'Modelo'} v{form.version ?? '?'}</p>
					{#if model.input_schema.some((c) => outOfRange(c.name))}
						<div class="alert warn">Hay valores fuera del rango de entrenamiento: la predicción es una extrapolación.</div>
					{/if}
				{:else}
					<p class="hint">Completa los valores y pulsa <strong>Predecir</strong>.</p>
				{/if}
			</div>
		</InfoCard>
	</div>

	{#if form?.prediction !== undefined && context}
		<InfoCard
			title="Tu predicción en contexto"
			subtitle={percentile !== null ? `Mayor que el ${Math.round(percentile * 100)} % de los valores reales del conjunto de test` : undefined}
			explain={'El histograma muestra cómo se distribuyen los valores reales del conjunto de test, y la línea marca tu predicción.\n\nSirve para saber si el resultado es típico o extremo. Una predicción en la cola de la distribución merece revisarse con más cuidado.'}
		>
			<Histogram bins={context.bins} series={[{ name: 'Observaciones', values: context.counts }]} format={(v) => String(Math.round(v))} marker={{ value: form.prediction, label: 'tu predicción' }} ariaLabel="Distribución de valores reales con la predicción marcada" />
		</InfoCard>
	{/if}

	{#if form?.curves?.length}
		<InfoCard
			title="Análisis what-if"
			subtitle="Cómo cambiaría la predicción si modificas una sola variable"
			explain={'Cada gráfica recorre el rango de una variable manteniendo las demás con los valores que introdujiste (curva ICE). La línea vertical marca tu valor actual.\n\nUna curva empinada indica que la predicción es muy sensible a esa variable. En un modelo lineal (Ridge) las curvas son rectas; en árboles (RandomForest) tienen escalones.'}
		>
			<div class="small-multiples">
				{#each form.curves as curve (curve.feature)}
					<div>
						<h3>{curve.feature}</h3>
						<LineChart
							points={curve.points}
							format={formatNumber}
							xFormat={formatMetric}
							xTicks="nice"
							xName={curve.feature}
							yName="Predicción"
							height={170}
							marker={{ x: curve.current, label: 'actual' }}
							ariaLabel="Predicción en función de {curve.feature}"
						/>
					</div>
				{/each}
			</div>
		</InfoCard>
	{/if}
{/if}

<style>
	.layout {
		display: grid;
		gap: 1rem;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		align-items: start;
		margin-bottom: 1rem;
	}

	@media (max-width: 760px) {
		.layout {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.layout :global(.card) {
		margin: 0;
	}

	.fields {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		margin-bottom: 1.25rem;
	}

	.out {
		color: var(--warn);
		font-weight: 600;
	}

	.value {
		font-size: 2.4rem;
		font-weight: 700;
		line-height: 1.1;
		overflow-wrap: anywhere;
	}

	.margin {
		margin: 0.35rem 0 0;
		font-weight: 600;
	}

	.margin span {
		color: var(--text-muted);
		font-weight: 400;
		font-size: 0.85rem;
	}
</style>
