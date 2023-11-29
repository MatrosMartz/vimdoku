import type { Pos } from '../domain/models'
import type { Tuple } from '../types'

export function createArray<const L extends number, MapFn extends (index: number) => any>(length: L, mapFn: MapFn) {
	const array = new Array(length)

	for (let i = 0; i < length; i++) array[i] = mapFn(i)

	return array as Tuple<ReturnType<MapFn>, L>
}

export function createMatrix<const L extends number, MapFn extends (pos: Pos) => any>(length: L, mapFn: MapFn) {
	return createArray(length, y => createArray(length, (x): ReturnType<MapFn> => mapFn({ y, x })))
}

export function* iterateArray(length: number) {
	for (let i = 0; i < length; i++) yield i
}

export function* iterateMatrix(length: number) {
	for (let y = 0; y < length; y++) for (let x = 0; x < length; x++) yield { y, x }
}
