<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { enhance } from '$app/forms';
	import BarChart from '#lib/components/charts/BarChart.svelte';
	import Histogram from '#lib/components/charts/Histogram.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import { formatPercent } from '#lib/format.ts';

	let { data, form } = $props();
	let submitting = $state(false);
	const MIN_RELIABLE_ROWS = 30;

	const summary = $derived(form?.summary);
	const healthy = $derived(summary ? summary.drifted === 0 : false);
	const formatScore = (value: number) => (value < 0.0001 ? '< 0,0001' : value.toFixed(4).replace('.', ','));
	const usesPValue = $derived(summary?.columns.some((c) => c.drifted !== null) ?? false);
	const scoreBars = $derived(
		(summary?.columns ?? []).map((c) => ({
			label: c.drifted ? `${c.column} ⚠` : c.column,
			value: c.score,
			note: c.drifted === null ? undefined : c.drifted ? 'Drift: la distribución cambió' : 'Estable'
		}))
	);
	const driftedColumns = $derived(new Set(summary?.columns.filter((c) => c.drifted).map((c) => c.column)));
</script>

<Seo
	title="Monitoreo de drift"
	description="Compara datos recientes con los de entrenamiento para detectar drift: test estadístico por variable y distribuciones superpuestas."
	image="/og/plataforma.jpg"
/>

<h1>Monitoreo de drift</h1>
<p class="lead">
	Compara datos recientes con el dataset de referencia del modelo para detectar cambios en la distribución de las
	variables.
</p>

{#if data.model}
	<InfoCard
		title="Datos recientes"
		subtitle="Mismas columnas que la referencia, sin la variable objetivo. Al menos 30 filas."
		explain={'El drift de datos ocurre cuando los datos que recibe el modelo en producción dejan de parecerse a los de entrenamiento: nuevos segmentos de clientes, cambios de precios, errores en un sensor…\n\nEl modelo no avisa por sí solo: sigue prediciendo, pero peor. Por eso se compara periódicamente un lote reciente con la referencia.'}
	>
		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update({ reset: false });
					submitting = false;
				};
			}}
		>
			<label for="file">CSV con datos recientes</label>
			<input id="file" name="file" type="file" accept=".csv,text/csv" required />
			<button class="button" disabled={submitting}>{submitting ? 'Analizando…' : 'Analizar drift'}</button>
		</form>
	</InfoCard>

	{#if form?.error}
		<div class="alert danger" role="alert">{form.error}</div>
	{:else if summary}
		<div class="alert {healthy ? 'ok' : 'warn'}" role="status">
			{#if healthy}
				✓ Sin drift: ninguna de las {summary.total} variables cambió de distribución.
			{:else}
				⚠ Drift detectado en {summary.drifted} de {summary.total} variables ({formatPercent(summary.share)}). Revisa
				el origen de los datos o considera reentrenar el modelo.
			{/if}
		</div>
		{#if summary.rows < MIN_RELIABLE_ROWS}
			<div class="alert warn">Solo {summary.rows} filas: con muestras tan pequeñas los tests estadísticos son poco fiables.</div>
		{/if}

		<InfoCard
			title="Resultado del test por variable"
			subtitle={usesPValue ? 'p-value (más alto = más parecido a la referencia)' : 'Score de distancia de Evidently'}
			explain={'Para cada variable, Evidently aplica un test estadístico que compara la distribución actual con la de referencia: Kolmogórov-Smirnov para variables continuas y chi-cuadrado para discretas.\n\nEl p-value es la probabilidad de observar una diferencia así si en realidad nada hubiera cambiado. Por debajo de 0,05 (la línea vertical) se considera drift.'}
		>
			<BarChart
				data={scoreBars}
				format={formatScore}
				valueName={usesPValue ? 'p-value' : 'Score'}
				threshold={usesPValue ? { value: 0.05, label: 'umbral 0,05' } : undefined}
				ariaLabel="p-value del test de drift por variable"
			/>
			<div class="table-wrap">
				<table>
					<thead><tr><th>Variable</th><th>Score</th><th>Estado</th></tr></thead>
					<tbody>
						{#each summary.columns as column (column.column)}
							<tr>
								<td>{column.column}</td>
								<td>{formatScore(column.score)}</td>
								<td>
									{#if column.drifted === null}<span class="badge">ver score</span>
									{:else if column.drifted}<span class="badge danger">⚠ drift</span>
									{:else}<span class="badge ok">✓ estable</span>{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</InfoCard>

		{#if form?.comparisons?.length}
			<InfoCard
				title="Distribución: referencia vs. datos actuales"
				subtitle="Proporción de filas en cada intervalo · {form?.filename}"
				explain={'Cada gráfica superpone la forma de los datos de referencia (azul) y la de tu archivo (naranja), en porcentaje para que sean comparables aunque tengan distinto número de filas.\n\nSi las barras naranjas se desplazan o aparecen intervalos "< mín" / "> máx", el modelo está recibiendo valores que nunca vio al entrenar.'}
			>
				<div class="small-multiples">
					{#each form?.comparisons ?? [] as comparison (comparison.column)}
						<div>
							<h3>
								{comparison.column}
								{#if driftedColumns.has(comparison.column)}<span class="badge danger">⚠ drift</span>{/if}
							</h3>
							<Histogram
								bins={comparison.bins}
								series={[
									{ name: 'Referencia', values: comparison.reference },
									{ name: 'Actual', values: comparison.current }
								]}
								format={formatPercent}
								height={170}
								ariaLabel="Distribución de {comparison.column}: referencia frente a datos actuales"
							/>
						</div>
					{/each}
				</div>
			</InfoCard>
		{/if}
	{/if}
{/if}

<style>
	form .button {
		margin-top: 1rem;
	}

	.table-wrap {
		margin-top: 1rem;
	}

	h3 .badge {
		margin-left: 0.35rem;
		vertical-align: 1px;
	}
</style>
