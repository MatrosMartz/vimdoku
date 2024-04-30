```ts
const { ALL, SUDOKU, USER, VIM, TOGGLE, NON_TOGGLE } = create()
	.addByObj('SUDOKU', sudokuFields)
	.addByObj('USER', userFields)
	.addByObj('VIM', vimFields)
	.divide('TOGGLE', 'NON_TOGGLE', ([, { type }]) => type === 'toggle')
	.done()

// ALL === SUDOKU + USER + VIM
// ALL === TOGGLE + NON_TOGGLE
```

```ts
const { ALL } = create().pushByObj(Kind)
```
