import {resolve} from 'node:path';
import * as url from 'node:url';
import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import {testableUrls, getTests, getAllUrls} from '../collector.ts';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// The examples live in the JSDoc of `index.ts`, which can only be read in Node
const examples = {
	name: 'examples',
	resolveId: (id: string) => id === 'virtual:examples' ? '\0virtual:examples' : undefined,
	load: (id: string) => id === '\0virtual:examples'
		? `export const tests = ${JSON.stringify(Object.fromEntries([...testableUrls.keys()].map(name => [name, getTests(name)])))};\nexport const allUrls = ${JSON.stringify([...getAllUrls()])};`
		: undefined,
};

export default defineConfig({
	base: '',
	plugins: [svelte(), examples],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				nested: resolve(__dirname, 'detections.html'),
			},
		},
	},
});
