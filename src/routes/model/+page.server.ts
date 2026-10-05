import { api, optional } from '#lib/server/api.ts';
import type { PageServerLoad } from './$types';

// Datos complementarios para las gráficas: si alguno no existe (p. ej. una versión antigua sin
// predicciones de evaluación), la página se muestra igual sin esa gráfica.
export const load: PageServerLoad = async () => {
	const [history, importance, evaluation, distribution] = await Promise.all([
		optional(api.versions()),
		optional(api.importance()),
		optional(api.evaluation()),
		optional(api.distribution())
	]);
	return { history, importance, evaluation, distribution };
};
