import adapterVercel from '@sveltejs/adapter-vercel';
import adapterNode from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// En Vercel (VERCEL=1) se usa adapter-vercel; en Docker se compila un
			// servidor Node independiente con `node build`.
			adapter: process.env.VERCEL ? adapterVercel() : adapterNode(),

			// Sin proxy delante, adapter-node asume https y rechaza como cross-site los formularios
			// enviados desde http://localhost. ORIGIN fija la URL pública en el build (ver Dockerfile).
			paths: { origin: process.env.ORIGIN || undefined }
		})
	],
	server: {
		// Los bind mounts de Windows no propagan eventos de archivos al contenedor de desarrollo.
		watch: process.env.VITE_USE_POLLING ? { usePolling: true, interval: 300 } : undefined
	}
});
