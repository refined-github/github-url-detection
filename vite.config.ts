import process from 'node:process';
import {defineConfig} from 'vite';

export default defineConfig({
	build: {
		lib: {
			formats: ['es'],
			entry: 'index.ts',
			fileName: 'index',
		},
		target: 'es2021',
		outDir: 'distribution',
		minify: false,
	},
	define: {
		'import.meta.vitest': 'undefined',
	},
});
