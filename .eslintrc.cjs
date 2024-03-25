module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['plugin:jsdoc/recommended-typescript', 'plugin:svelte/recommended', 'standard-with-typescript', 'prettier'],
	plugins: ['simple-import-sort', '@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		extraFileExtensions: ['.svelte'],
	},
	overrides: [
		{
			extends: ['plugin:jest-dom/recommended', 'plugin:testing-library/dom'],
			files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test|bench).[jt]s?(x)'],
		},
		{
			files: ['vite.config.ts', 'vitest.config.ts', 'svelte.config.js', 'test/**/*.ts'],
			parserOptions: {
				project: './tsconfig.node.json',
			},
		},
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
	rules: {
		'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/member-ordering': ['error', require('./eslint/member-ordering.cjs')],
		'@typescript-eslint/method-signature-style': ['error', 'method'],
		'@typescript-eslint/no-confusing-void-expression': 'off',
		'@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'jsdoc/require-description': 'warn',
		'jsdoc/require-jsdoc': [
			'warn',
			{
				contexts: [
					'TSDeclareFunction:not(TSDeclareFunction + TSDeclareFunction)',
					'FunctionDeclaration:not(TSDeclareFunction + FunctionDeclaration)',
				],
				require: {
					FunctionDeclaration: false,
				},
			},
		],
		'jsdoc/check-param-names': [
			'warn',
			{
				checkDestructured: false,
			},
		],
		'jsdoc/require-param': [
			'warn',
			{
				checkDestructured: false,
			},
		],
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': 'error',
		'svelte/sort-attributes': ['error', require('./eslint/sort-attributes.cjs')],
	},
}
