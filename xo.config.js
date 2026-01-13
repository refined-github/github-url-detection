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
			'no-unused-labels': 'off',
			'no-labels': 'off',
		},
	},
];

export default xoConfig;
