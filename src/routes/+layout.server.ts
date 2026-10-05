import { ApiError, api } from '#lib/server/api.ts';
import type { Health, ModelInfo } from '#lib/types.ts';
import type { LayoutServerLoad } from './$types';

// Todas las páginas necesitan saber qué modelo está sirviendo la API.
export const load: LayoutServerLoad = async () => {
	let health: Health | null = null;
	let model: ModelInfo | null = null;
	let apiError: string | null = null;

	try {
		health = await api.health();
		if (health.model_configured) model = await api.model();
	} catch (error) {
		apiError = error instanceof ApiError ? error.message : 'Error inesperado al consultar la API.';
	}

	return { health, model, apiError };
};
