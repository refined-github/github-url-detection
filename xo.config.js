import globals from 'globals';

/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
	{
		ignores: ['demo/**'],
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		files: ['*.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
			'@typescript-eslint/naming-convention': 'off',
		},
	},
];

export default xoConfig;
