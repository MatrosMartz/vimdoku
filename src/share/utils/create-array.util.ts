import type { Tuple } from '../types'

export function createArray<const L extends number, MapFn extends (index: number) => any>(length: L, mapFn: MapFn) {
	const array = new Array(length)

	for (let i = 0; i < length; i++) array[i] = mapFn(i)

	return array as Tuple<ReturnType<MapFn>, L>
}

export function* iterateArray(length: number) {
	for (let i = 0; i < length; i++) yield i
}
