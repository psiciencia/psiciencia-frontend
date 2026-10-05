// Utilidades de SEO compartidas por el componente <Seo> y las rutas sitemap.xml / robots.txt.
import { SITE_URL } from '$app/env/public';
import { sectors } from '#lib/sectors.ts';
import { technologies } from '#lib/technologies.ts';

export const SITE_NAME = 'PsiCiencia Tech';
export const DEFAULT_DESCRIPTION =
	'Ciencia de datos y machine learning en producción para psicología, salud, educación, empresa, industria y agro: modelos trazables, versionados y monitoreados.';
export const DEFAULT_IMAGE = '/og/default.jpg';

/** URL absoluta a partir de una ruta del sitio. */
export const absolute = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`);

/** Todas las rutas públicas e indexables (las usa el sitemap). */
export function indexablePaths(): string[] {
	return [
		'/',
		'/sectores',
		...sectors.filter((s) => s.page || s.slug === 'psicologia').map((s) => `/sectores/${s.slug}`),
		'/tecnologias',
		...technologies.map((t) => `/tecnologias/${t.slug}`),
		'/model',
		'/predict',
		'/batch',
		'/drift'
	];
}

/** JSON-LD BreadcrumbList a partir de pares [nombre, ruta]. */
export function breadcrumbs(items: [string, string][]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map(([name, path], i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name,
			item: absolute(path)
		}))
	};
}

export function organization() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: absolute('/'),
		logo: absolute('/icons/icon-512.png'),
		description: DEFAULT_DESCRIPTION
	};
}

export function website() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: absolute('/'),
		inLanguage: 'es'
	};
}

export function faqPage(faqs: { q: string; a: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
}

/** Serializa JSON-LD de forma segura para incrustarlo en un <script> (evita cerrar la etiqueta). */
export const jsonLdScript = (data: object) =>
	`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
