import { bench, type BenchOptions, describe } from 'vitest'

import { createArray } from './create-array.util'
import { sameStructureIterative, sameStructureLoop, sameStructureLoop2 } from './same-structure.util'

const obj1 = { a: 1, b: 'hello' }
const obj1Clone = obj1
const obj2 = { a: 2, b: 'goodbye' }
const obj3 = { a: null, b: 'hello' }
const obj4 = { b: 'hello', a: 1 }
const obj5 = {
	a: {
		g: 1,
		h: [1, 4, 5],
		i: {
			j: 'false',
			k: {
				l: {
					m: 1992,
					n: [
						[
							[1, 2, 3],
							[4, 5, 6],
							[7, 8, 9],
						],
						[
							[1, 2, 3],
							[4, 5, 6],
							[7, 8, 9],
						],
						[
							[1, 2, 3],
							[4, 5, 6],
							[7, 8, 9],
						],
					],
				},
			},
		},
	},
	b: { c: 1, d: [true, { z: null, x: { y: { e: 'hello', f: [1, 2, [[0], [2], [3]]] }, w: 10 } }, false] },
}
const obj5Clone = obj5

const arr1 = createArray(10_000, { fn: i => i })
const arr1Clone = arr1

const options: BenchOptions = {
	time: 2_000,
}

describe.concurrent('same structure with numbers', () => {
	bench(
		'iterative',
		() => {
			sameStructureIterative(1, 2)
		},
		options
	)
	bench(
		'loop',
		() => {
			sameStructureLoop(1, 2)
		},
		options
	)
	bench(
		'loop2',
		() => {
			sameStructureLoop2(1, 2)
		},
		options
	)
})

describe.concurrent('same structure with obj1', () => {
	bench(
		'iterative',
		() => {
			sameStructureIterative(obj1, obj1Clone)
		},
		options
	)
	bench(
		'loop',
		() => {
			sameStructureLoop(obj1, obj1Clone)
		},
		options
	)
	bench(
		'loop2',
		() => {
			sameStructureLoop2(obj1, obj1Clone)
		},
		options
	)
})

describe.concurrent('same structure with obj1 and obj2', () => {
	bench(
		'iterative',
		() => {
			sameStructureIterative(obj1, obj2)
		},
		options
	)
	bench(
		'loop',
		() => {
			sameStructureLoop(obj1, obj2)
		},
		options
	)
	bench(
		'loop2',
		() => {
			sameStructureLoop2(obj1, obj2)
		},
		options
	)
})

describe.concurrent('same structure with obj1 and obj3', () => {
	bench(
		'iterative',
		() => {
			sameStructureIterative(obj1, obj3)
		},
		options
	)
	bench(
		'loop',
		() => {
			sameStructureLoop(obj1, obj3)
		},
		options
	)
	bench(
		'loop2',
		() => {
			sameStructureLoop2(obj1, obj3)
		},
		options
	)
})

describe.concurrent('same structure with obj1 and obj4', () => {
	bench(
		'iterative',
		() => {
			sameStructureIterative(obj1, obj4)
		},
		options
	)
	bench(
		'loop',
		() => {
			sameStructureLoop(obj1, obj4)
		},
		options
	)
	bench(
		'loop2',
		() => {
			sameStructureLoop2(obj1, obj4)
		},
		options
	)
})

describe.skip.concurrent('same structure with obj5', () => {
	bench(
		'iterative',
		() => {
			sameStructureIterative(obj5, obj5Clone)
		},
		options
	)
	bench(
		'loop',
		() => {
			sameStructureLoop(obj5, obj5Clone)
		},
		options
	)
	bench(
		'loop2',
		() => {
			sameStructureLoop2(obj5, obj5Clone)
		},
		options
	)
})

describe.skip.concurrent('same structure with arr1', () => {
	bench(
		'iterative',
		() => {
			sameStructureIterative(arr1, arr1Clone)
		},
		options
	)
	bench(
		'loop',
		() => {
			sameStructureLoop(arr1, arr1Clone)
		},
		options
	)
	bench(
		'loop2',
		() => {
			sameStructureLoop2(arr1, arr1Clone)
		},
		options
	)
})
