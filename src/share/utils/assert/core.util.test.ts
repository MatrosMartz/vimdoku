import { describe, expect, test } from 'vitest'

import { Assert } from './core.util'

describe.concurrent('A.Assert', () => {
	test('Should return true when input is "foo"', () => {
		const assert = new Assert(val => val === 'foo')
		expect(assert.fn('foo')).toBeTrue()
		expect(assert.fn('bar')).toBeFalse()
	})

	test('Should return an array its references', () => {
		const assert = new Assert(val => val === 'foo')
		expect(assert.repeat(3)).toEqual([assert, assert, assert])
		expect(assert.repeat(0)).toBeEmpty()
		expect(assert.repeat(1)).toEqual([assert])
	})

	test('Should return true when input is "foo" or "bar"', () => {
		const assert1 = new Assert(val => val === 'foo')
		const assert2 = new Assert(val => val === 'bar')

		expect(assert1.or(assert2).fn('foo')).toBeTrue()
		expect(assert1.or(assert2).fn('bar')).toBeTrue()
		expect(assert1.or(assert2).fn('baz')).toBeFalse()
	})
})
