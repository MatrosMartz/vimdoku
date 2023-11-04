module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['standard-with-typescript', 'plugin:svelte/recommended', 'prettier'],
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
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': 'error',
	},
}
