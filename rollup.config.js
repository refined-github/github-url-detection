import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

export default {
	input: 'index.ts',
	output: {
		'esm',
		dir: 'esm',
	},
	plugins: [
		typescript({
			outDir: 'esm',
		}),
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
