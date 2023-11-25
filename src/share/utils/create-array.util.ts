import type { Position } from '../domain/models'
import type { Tuple } from '../types'

export function createArray<T, L extends number>(length: L, mapFn: (index: number) => T) {
	const array = new Array(length)

	for (let i = 0; i < length; i++) array[i] = mapFn(i)

	return array as Tuple<T, L>
}

export function createMatrix<T, L extends number>(length: L, mapFn: (position: Position) => T) {
	return createArray(length, y => createArray(length, x => mapFn({ y, x })))
}

export function* iterateArray(length: number) {
	for (let i = 0; i < length; i++) yield i
}

export function* iterateMatrix(length: number) {
	for (let y = 0; y < length; y++) for (let x = 0; x < length; x++) yield { y, x }
}
