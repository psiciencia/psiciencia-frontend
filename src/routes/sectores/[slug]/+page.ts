import { error } from '@sveltejs/kit';
import { sectorBySlug } from '#lib/sectors.ts';
import type { PageLoad } from './$types';

// Psicología tiene su propia página (src/routes/sectores/psicologia), que tiene prioridad sobre esta ruta.
export const load: PageLoad = ({ params }) => {
	const sector = sectorBySlug(params.slug);
	if (!sector?.page) error(404, 'Sector no encontrado');
	return { sector };
};
