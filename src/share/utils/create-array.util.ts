import type { Tuple } from '../types'

/**
 * Create an array with the length selected.
 * @param length The array length.
 * @param mapFn The mapping function.
 * @returns The new array with the length defined.
 */
export function createArray<const L extends number, MapFn extends (index: number) => any>(length: L, mapFn: MapFn) {
	const array = new Array(length)

	for (let i = 0; i < length; i++) array[i] = mapFn(i)

	return array as Tuple<ReturnType<MapFn>, L>
}

/**
 * Creates an iterator.
 * @param length To where it will iterate.
 * @yields The current index.
 */
export function* iterateArray(length: number) {
	for (let i = 0; i < length; i++) yield i
}
