import {resolve} from 'node:path';
import * as url from 'node:url';
import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	base: '',
	plugins: [svelte()],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				nested: resolve(__dirname, 'detections.html'),
			},
		},
	},
});
