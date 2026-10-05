import { error } from '@sveltejs/kit';
import { techBySlug } from '#lib/technologies.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const tech = techBySlug(params.slug);
	if (!tech) error(404, 'Tecnología no encontrada');
	return { tech };
};
