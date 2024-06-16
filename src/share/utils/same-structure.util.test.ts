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
		expect(sameStructureIterative(1, 4)).toBeTrue()
		expect(sameStructureIterative(-1, Infinity)).toBeTrue()
	})
	it('Should be return true if both values has same keys and values', () => {
		expect(sameStructureIterative(obj1, obj1)).toBeTrue()
		expect(sameStructureIterative(obj1, { ...obj1 })).toBeTrue()
		expect(sameStructureIterative(obj1, obj2)).toBeTrue()
	})
	it('Should be return true if both value has same keys and both values are same types', () => {
		expect(sameStructureIterative(obj1, obj3)).toBeTrue()
	})
	it('Should be return false if both value has same keys and both values are different types', () => {
		expect(sameStructureIterative(obj1, { a: null, b: false })).toBeFalse()
		expect(sameStructureIterative(obj1, { a: null, b: 'hello' })).toBeFalse()
		expect(sameStructureIterative(obj1, { a: 0, b: false })).toBeFalse()
	})
	it('Should be return true in two level in object', () => {
		expect(sameStructureIterative(obj4, { ...obj4 })).toBeTrue()
		expect(sameStructureIterative(obj4, obj5)).toBeFalse()
		expect(sameStructureIterative(obj4, obj6)).toBeFalse()
		expect(sameStructureIterative(obj7, obj8)).toBeTrue()
		expect(sameStructureIterative(obj7, obj9)).toBeFalse()
	})
})

describe.concurrent('loop', () => {
	it('Should be return true if both values are numbers', () => {
		expect(sameStructureLoop(1, 4)).toBeTrue()
		expect(sameStructureLoop(-1, Infinity)).toBeTrue()
	})
	it('Should be return true if both values has same keys and values', () => {
		expect(sameStructureLoop(obj1, obj1)).toBeTrue()
		expect(sameStructureLoop(obj1, { ...obj1 })).toBeTrue()
		expect(sameStructureLoop(obj1, obj2)).toBeTrue()
	})
	it('Should be return true if both value has same keys and both values are same types', () => {
		expect(sameStructureLoop(obj1, obj3)).toBeTrue()
	})
	it('Should be return false if both value has same keys and both values are different types', () => {
		expect(sameStructureLoop(obj1, { a: null, b: false })).toBeFalse()
		expect(sameStructureLoop(obj1, { a: null, b: 'hello' })).toBeFalse()
		expect(sameStructureLoop(obj1, { a: 0, b: false })).toBeFalse()
	})
	it('Should be return true in two level in object', () => {
		expect(sameStructureLoop(obj4, { ...obj4 })).toBeTrue()
		expect(sameStructureLoop(obj4, obj5)).toBeFalse()
		expect(sameStructureLoop(obj4, obj6)).toBeFalse()
		expect(sameStructureLoop(obj7, obj8)).toBeTrue()
		expect(sameStructureLoop(obj7, obj9)).toBeFalse()
	})
})

describe.concurrent('loop 2', () => {
	it('Should be return true if both values are numbers', () => {
		expect(sameStructureLoop2(1, 4)).toBeTrue()
		expect(sameStructureLoop2(-1, Infinity)).toBeTrue()
	})
	it('Should be return true if both values has same keys and values', () => {
		expect(sameStructureLoop2(obj1, obj1)).toBeTrue()
		expect(sameStructureLoop2(obj1, { ...obj1 })).toBeTrue()
		expect(sameStructureLoop2(obj1, obj2)).toBeTrue()
	})
	it('Should be return true if both value has same keys and both values are same types', () => {
		expect(sameStructureLoop2(obj1, obj3)).toBeTrue()
	})
	it('Should be return false if both value has same keys and both values are different types', () => {
		expect(sameStructureLoop2(obj1, { a: null, b: false })).toBeFalse()
		expect(sameStructureLoop2(obj1, { a: null, b: 'hello' })).toBeFalse()
		expect(sameStructureLoop2(obj1, { a: 0, b: false })).toBeFalse()
	})
	it('Should be return true in two level in object', () => {
		expect(sameStructureLoop2(obj4, { ...obj4 })).toBeTrue()
		expect(sameStructureLoop2(obj4, obj5)).toBeFalse()
		expect(sameStructureLoop2(obj4, obj6)).toBeFalse()
		expect(sameStructureLoop2(obj7, obj8)).toBeTrue()
		expect(sameStructureLoop2(obj7, obj9)).toBeFalse()
	})
})
