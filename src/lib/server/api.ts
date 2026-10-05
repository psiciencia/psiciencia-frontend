// Cliente de la API FastAPI. Vive en src/lib/server: SvelteKit impide importarlo desde el navegador,
// así que la URL interna (http://api:8000 en Docker) y una futura API key nunca llegan al cliente.
import { API_URL } from '$app/env/private';
import type {
	Evaluation,
	FeatureImportance,
	Health,
	ModelInfo,
	ModelVersion,
	PlatformSummary,
	ReferenceDistribution,
	Row
} from '#lib/types.ts';

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
	}
}

async function request<T>(path: string, body?: unknown): Promise<T> {
	let response: Response;
	try {
		response = await fetch(`${API_URL}${path}`, {
			method: body === undefined ? 'GET' : 'POST',
			headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: AbortSignal.timeout(120_000)
		});
	} catch {
		throw new ApiError(503, `No se pudo conectar con la API en ${API_URL}.`);
	}

	if (!response.ok) {
		const payload = await response.json().catch(() => ({}));
		const detail = typeof payload.detail === 'string' ? payload.detail : response.statusText;
		throw new ApiError(response.status, detail);
	}
	return response.json() as Promise<T>;
}

/** Para datos complementarios (gráficas): si no están disponibles la página se muestra igual. */
export function optional<T>(promise: Promise<T>): Promise<T | null> {
	return promise.catch(() => null);
}

export const api = {
	health: () => request<Health>('/health'),
	model: () => request<ModelInfo>('/model'),
	versions: () => request<{ name: string | null; versions: ModelVersion[] }>('/model/versions'),
	importance: () => request<FeatureImportance>('/model/importance'),
	evaluation: () => request<Evaluation>('/model/evaluation'),
	distribution: () => request<ReferenceDistribution>('/reference/distribution'),
	platform: () => request<PlatformSummary>('/platform/summary'),
	predict: (rows: Row[]) => request<{ predictions: number[] }>('/predict', { rows }),
	drift: (rows: Row[]) => request<{ metrics: { metric_id: string; value: unknown }[] }>('/drift', { rows })
};
