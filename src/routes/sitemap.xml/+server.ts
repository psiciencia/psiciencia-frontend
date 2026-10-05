import { absolute, indexablePaths } from '#lib/seo.ts';
import type { RequestHandler } from './$types';

// Sitemap generado a partir de las mismas listas de sectores y tecnologías que crean las páginas,
// así una página nueva aparece aquí sin mantenerlo a mano.
export const GET: RequestHandler = () => {
	const urls = indexablePaths()
		.map((path) => `\t<url><loc>${absolute(path)}</loc></url>`)
		.join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
	});
};
