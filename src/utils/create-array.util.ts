import type { Position } from '$sudoku/domain/models'

export function createArray<T>(length: number, mapper: { fn(index: number): T } | { value: T }) {
	const array = []

	for (let i = 0; i < length; i++) array[i] = 'fn' in mapper ? mapper.fn(i) : mapper.value

	return array
}

export function createMatrix<T>(length: number, mapper: { fn(pos: Position): T } | { value: T }) {
	return createArray(length, {
		fn: col =>
			createArray(length, { fn: row => ('fn' in mapper ? mapper.fn({ col, row }) : structuredClone(mapper.value)) }),
	})
}

export function* iterateMatrix(length: number) {
	for (let row = 0; row < length; row++) for (let col = 0; col < length; col++) yield { row, col }
}
