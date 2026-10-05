import { defineEnvVars } from '@sveltejs/kit/env';

function withDefault(fallback: string) {
	return (value: string | undefined) => (value ? value.replace(/\/+$/, '') : fallback);
}

export const variables = defineEnvVars({
	API_URL: {
		description:
			'URL de la API FastAPI. Solo la usa el servidor de SvelteKit: el navegador nunca habla con ella.',
		schema: withDefault('http://127.0.0.1:8000')
	},
	SITE_URL: {
		public: true,
		description:
			'URL pública del sitio (sin barra final). Se usa para URLs canónicas, Open Graph, sitemap y robots.txt.',
		schema: withDefault('http://localhost:3000')
	},
	MLFLOW_UI_URL: {
		public: true,
		description: 'URL de la UI de MLflow para enlazar runs y modelos desde el navegador.',
		schema: withDefault('http://localhost:5000')
	}
});
