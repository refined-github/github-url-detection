import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

const config = {
	input: 'index.ts',
	output: {
		format: 'esm',
		dir: '.',
	},
	plugins: [
		typescript(),
		json(),
		terser({
			toplevel: true,
			output: {
				comments: false,
				beautify: true,
			},
			mangle: false,
			compress: {
				join_vars: false,
				booleans: false,
				expression: false,
				sequences: false,
				pure_funcs: [
					'collect.set',
					'collect.get',
					'Map',
				],
			},
		},
		),
	],
};

export default config;
