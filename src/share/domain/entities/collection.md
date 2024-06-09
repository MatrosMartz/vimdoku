# Collection API schema

## add entries and create sub-collection from object

```ts
const PREFERENCES = new Builder().createSub
	.fromObj('SUDOKU', sudokuFields)
	.CreateSub.fromObj('USER', userFields)
	.createSub.fromObj('VIM', vimFields)
	.createSub.divideAll('TOGGLE', 'NON_TOGGLE', ([, { type }]) => type === 'toggle')
	.done()

PREFERENCES // === PREFERENCES.sub.SUDOKU + PREFERENCES.sub.USER + PREFERENCES.sub.VIM
PREFERENCES // === PREFERENCES.sub.TOGGLE + PREFERENCES.sub.NON_TOGGLE
PREFERENCES.sub // keys ['SUDOKU', 'USER', 'VIM', 'TOGGLE', 'NON_TOGGLE']
```

## add entries without create sub-collection

```ts
const ROUTE = new Builder().addToAll.fromObj(Kind)

ROUTE.sub // keys []
```
