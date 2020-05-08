import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

export default ['cjs', 'esm'].map(format => ({
	input: 'index.ts',
	output: {
		format,
		dir: format,
	},
	plugins: [
		typescript({
			outDir: format,
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
}));
