import type { Position } from '$sudoku/domain/entities/position.model'

export function createArray<T>(length: number, mapFn: (index: number) => T) {
	const array: T[] = new Array(length)

	for (let i = 0; i < length; i++) array[i] = mapFn(i)

	return array
}

export function createMatrix<T>(length: number, mapFn: (position: Position) => T) {
	return createArray(length, col => createArray(length, row => mapFn({ row, col })))
}

export function* iterateArray(length: number) {
	for (let i = 0; i < length; i++) yield i
}

export function* iterateMatrix(length: number) {
	for (let row = 0; row < length; row++) for (let col = 0; col < length; col++) yield { row, col }
}
