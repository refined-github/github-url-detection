import {defineConfig} from 'vitest/config';
import {examples} from './vite-plugin-examples.js';

export default defineConfig({
	plugins: [examples()],
	test: {
		include: ['index.test.ts'],
	},
});
