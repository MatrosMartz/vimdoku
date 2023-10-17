import type { Position } from '../domain/models'
import type { Tuple } from '../types'

export function createArray<T, L extends number>(length: L, mapFn: (index: number) => T) {
	const array = new Array(length)

	for (let i = 0; i < length; i++) array[i] = mapFn(i)

	return array as Tuple<T, L>
}

export function createMatrix<T, L extends number>(length: L, mapFn: (position: Position) => T) {
	return createArray(length, col => createArray(length, row => mapFn({ row, col })))
}

export function* iterateArray(length: number) {
	for (let i = 0; i < length; i++) yield i
}

export function* iterateMatrix(length: number) {
	for (let row = 0; row < length; row++) for (let col = 0; col < length; col++) yield { row, col }
}
