import { describe, expect, it } from 'vitest'

import { sameStructureIterative, sameStructureLoop, sameStructureLoop2 } from './same-structure.util'

const obj1 = { a: 0, b: 'hello' }
const obj2 = { b: 'hello', a: 0 }
const obj3 = { a: Infinity, b: 'bye' }

const obj4 = { a: 0, b: { c: 'hello' } }
const obj5 = { a: 0, b: { c: false } }
const obj6 = { a: 0, b: { z: 'hello' } }

const obj7 = {
	a: 1,
	b: { c: 1, d: [true, { z: null, x: { y: { e: 'hello', f: [1, 2, [[0], [2], [3]]] }, w: 10 } }, false] },
}
const obj8 = {
	a: 1,
	b: { c: 1, d: [true, { z: null, x: { y: { e: 'hello', f: [1, 2, [[0], [2], [3]]] }, w: 10 } }, false] },
}
const obj9 = {
	a: 1,
	b: { c: 1, d: [true, { z: null, x: { y: { e: 'hello', f: [1, 2, [[0], [false], [3]]] }, w: 10 } }, false] },
}

describe.concurrent('Iterative', () => {
	it('Should be return true if both values are numbers', () => {
		expect(sameStructureIterative(1, 4)).toBe(true)
		expect(sameStructureIterative(-1, Infinity)).toBe(true)
	})
	it('Should be return true if both values has same keys and values', () => {
		expect(sameStructureIterative(obj1, obj1)).toBe(true)
		expect(sameStructureIterative(obj1, { ...obj1 })).toBe(true)
		expect(sameStructureIterative(obj1, obj2)).toBe(true)
	})
	it('Should be return true if both value has same keys and both values are same types', () => {
		expect(sameStructureIterative(obj1, obj3)).toBe(true)
	})
	it('Should be return false if both value has same keys and both values are different types', () => {
		expect(sameStructureIterative(obj1, { a: null, b: false })).toBe(false)
		expect(sameStructureIterative(obj1, { a: null, b: 'hello' })).toBe(false)
		expect(sameStructureIterative(obj1, { a: 0, b: false })).toBe(false)
	})
	it('Should be return true in two level in object', () => {
		expect(sameStructureIterative(obj4, { ...obj4 })).toBe(true)
		expect(sameStructureIterative(obj4, obj5)).toBe(false)
		expect(sameStructureIterative(obj4, obj6)).toBe(false)
		expect(sameStructureIterative(obj7, obj8)).toBe(true)
		expect(sameStructureIterative(obj7, obj9)).toBe(false)
	})
})

describe.concurrent('loop', () => {
	it('Should be return true if both values are numbers', () => {
		expect(sameStructureLoop(1, 4)).toBe(true)
		expect(sameStructureLoop(-1, Infinity)).toBe(true)
	})
	it('Should be return true if both values has same keys and values', () => {
		expect(sameStructureLoop(obj1, obj1)).toBe(true)
		expect(sameStructureLoop(obj1, { ...obj1 })).toBe(true)
		expect(sameStructureLoop(obj1, obj2)).toBe(true)
	})
	it('Should be return true if both value has same keys and both values are same types', () => {
		expect(sameStructureLoop(obj1, obj3)).toBe(true)
	})
	it('Should be return false if both value has same keys and both values are different types', () => {
		expect(sameStructureLoop(obj1, { a: null, b: false })).toBe(false)
		expect(sameStructureLoop(obj1, { a: null, b: 'hello' })).toBe(false)
		expect(sameStructureLoop(obj1, { a: 0, b: false })).toBe(false)
	})
	it('Should be return true in two level in object', () => {
		expect(sameStructureLoop(obj4, { ...obj4 })).toBe(true)
		expect(sameStructureLoop(obj4, obj5)).toBe(false)
		expect(sameStructureLoop(obj4, obj6)).toBe(false)
		expect(sameStructureLoop(obj7, obj8)).toBe(true)
		expect(sameStructureLoop(obj7, obj9)).toBe(false)
	})
})

describe.concurrent('loop 2', () => {
	it('Should be return true if both values are numbers', () => {
		expect(sameStructureLoop2(1, 4)).toBe(true)
		expect(sameStructureLoop2(-1, Infinity)).toBe(true)
	})
	it('Should be return true if both values has same keys and values', () => {
		expect(sameStructureLoop2(obj1, obj1)).toBe(true)
		expect(sameStructureLoop2(obj1, { ...obj1 })).toBe(true)
		expect(sameStructureLoop2(obj1, obj2)).toBe(true)
	})
	it('Should be return true if both value has same keys and both values are same types', () => {
		expect(sameStructureLoop2(obj1, obj3)).toBe(true)
	})
	it('Should be return false if both value has same keys and both values are different types', () => {
		expect(sameStructureLoop2(obj1, { a: null, b: false })).toBe(false)
		expect(sameStructureLoop2(obj1, { a: null, b: 'hello' })).toBe(false)
		expect(sameStructureLoop2(obj1, { a: 0, b: false })).toBe(false)
	})
	it('Should be return true in two level in object', () => {
		expect(sameStructureLoop2(obj4, { ...obj4 })).toBe(true)
		expect(sameStructureLoop2(obj4, obj5)).toBe(false)
		expect(sameStructureLoop2(obj4, obj6)).toBe(false)
		expect(sameStructureLoop2(obj7, obj8)).toBe(true)
		expect(sameStructureLoop2(obj7, obj9)).toBe(false)
	})
})
