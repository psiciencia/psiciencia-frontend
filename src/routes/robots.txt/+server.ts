import { absolute } from '#lib/seo.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () =>
	new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
	});
