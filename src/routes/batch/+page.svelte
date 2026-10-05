<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { enhance } from '$app/forms';
	import Histogram from '#lib/components/charts/Histogram.svelte';
	import InfoCard from '#lib/components/InfoCard.svelte';
	import { toCsv } from '#lib/csv.ts';
	import { formatMetric, formatNumber } from '#lib/format.ts';
	import { extent, histogram, mean, quantile } from '#lib/stats.ts';

	let { data, form } = $props();
	let submitting = $state(false);
	const PREVIEW_ROWS = 20;

	const predictions = $derived(form?.rows?.map((r) => r.prediction) ?? []);
	const dist = $derived(predictions.length > 1 ? histogram(predictions, 20) : null);
	const range = $derived(predictions.length ? extent(predictions) : null);

	function download() {
		if (!form?.rows) return;
		const blob = new Blob([toCsv(form.columns, form.rows)], { type: 'text/csv' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = form.filename.replace(/\.csv$/i, '') + '_predicciones.csv';
		link.click();
		URL.revokeObjectURL(link.href);
	}
</script>

<Seo
	title="Predicción por lote"
	description="Sube un CSV, obtén predicciones para todas las filas, revisa su distribución y descarga el resultado."
	image="/og/plataforma.jpg"
/>

<h1>Predicción por lote</h1>
<p class="lead">Sube un CSV y descarga el mismo archivo con una columna <code>prediction</code> añadida.</p>

{#if data.model}
	<InfoCard
		title="Archivo de entrada"
		subtitle="CSV con cabecera, separado por comas o punto y coma"
		explain={'El archivo se procesa en el servidor de esta web: se valida que tenga exactamente las columnas que espera el modelo y que todos los valores sean numéricos.\n\nDespués se envían todas las filas a la API en una sola llamada (/predict). Es el modo habitual de uso en negocio: puntuar una cartera completa, no una fila.'}
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
			<label for="file">Archivo CSV</label>
			<input id="file" name="file" type="file" accept=".csv,text/csv" required />
			<p class="hint">
				Columnas requeridas: {#each data.model.input_schema as column, i (column.name)}<code>{column.name}</code
					>{i < data.model.input_schema.length - 1 ? ', ' : ''}{/each}. Máximo 10 000 filas.
			</p>
			<button class="button" disabled={submitting}>{submitting ? 'Procesando…' : 'Predecir lote'}</button>
		</form>
	</InfoCard>

	{#if form?.error}
		<div class="alert danger" role="alert">{form.error}</div>
	{:else if form?.rows && range}
		<div class="stats">
			<InfoCard title="Filas" level={3} compact explain="Número de registros puntuados por el modelo.">
				<div class="stat-value">{formatNumber(predictions.length)}</div>
			</InfoCard>
			<InfoCard title="Media" level={3} compact explain="Valor medio de las predicciones del lote. Compáralo con la media histórica para detectar lotes atípicos.">
				<div class="stat-value">{formatMetric(mean(predictions))}</div>
			</InfoCard>
			<InfoCard title="Mediana" level={3} compact explain="El valor central: la mitad de las predicciones está por debajo. Es más robusta que la media frente a valores extremos.">
				<div class="stat-value">{formatMetric(quantile(predictions, 0.5))}</div>
			</InfoCard>
			<InfoCard title="Rango" level={3} compact explain="Predicción mínima y máxima del lote. Valores muy extremos pueden indicar filas con datos fuera de rango.">
				<div class="stat-value small">{formatMetric(range[0])} – {formatMetric(range[1])}</div>
			</InfoCard>
		</div>

		{#if dist}
			<InfoCard
				title="Distribución de las predicciones"
				subtitle={form.filename}
				explain={'Cuántas filas caen en cada intervalo de predicción. Permite ver de un vistazo si el lote es homogéneo o tiene grupos distintos (por ejemplo, viviendas baratas y de lujo).\n\nPasa el cursor por cada barra para ver el intervalo y el número de filas.'}
			>
				<Histogram bins={dist.bins} series={[{ name: 'Filas', values: dist.counts }]} format={(v) => String(Math.round(v))} ariaLabel="Histograma de predicciones del lote" />
			</InfoCard>
		{/if}

		<InfoCard
			title="Resultados"
			subtitle="{form.rows.length} predicciones"
			explain={'Vista previa de las primeras filas con la predicción añadida en la última columna. El botón descarga el CSV completo, listo para cruzarlo con tus sistemas.'}
		>
			<div class="result-head">
				<button class="button" onclick={download}>Descargar CSV</button>
			</div>
			<div class="table-wrap">
				<table>
					<thead>
						<tr>{#each form.columns as column (column)}<th>{column}</th>{/each}</tr>
					</thead>
					<tbody>
						{#each form.rows.slice(0, PREVIEW_ROWS) as row, i (i)}
							<tr>
								{#each form.columns as column (column)}
									<td class:prediction={column === 'prediction'}>{formatMetric(row[column])}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if form.rows.length > PREVIEW_ROWS}
				<p class="hint">Vista previa de las primeras {PREVIEW_ROWS} filas. El CSV descargado las incluye todas.</p>
			{/if}
		</InfoCard>
	{/if}
{/if}

<style>
	form .button {
		margin-top: 1rem;
	}

	.stats {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		margin-bottom: 1rem;
	}

	.stats :global(.card) {
		margin: 0;
	}

	.stat-value {
		font-size: 1.7rem;
		font-weight: 700;
		line-height: 1.15;
	}

	.stat-value.small {
		font-size: 1.2rem;
	}

	.result-head {
		margin-bottom: 0.75rem;
	}

	td.prediction {
		font-weight: 700;
		color: var(--accent);
	}
</style>
