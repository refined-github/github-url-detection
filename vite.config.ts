import process from 'node:process';
import {defineConfig} from 'vite';

process.env.VITE_KEEP_URLS ??= '0';

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
});
