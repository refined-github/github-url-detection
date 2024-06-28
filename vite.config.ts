import process from 'node:process';
import {defineConfig} from 'vite';

export default defineConfig({
	build: {
		lib: {
			formats: ['es'],
			entry: 'index.ts',
			fileName: 'index',
		},
		target: 'node20.10', // https://github.com/evanw/esbuild/issues/3778
		outDir: 'distribution',
		minify: false,
		rollupOptions: {
			external: ['github-reserved-names/reserved-names.json'],
		},
	},
});
