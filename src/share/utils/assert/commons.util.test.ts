import { describe, expect, test } from 'vitest'

import * as A from './commons.util'

describe.concurrent('A.equalTo', () => {
	test('Should return true when input matches the single specified value', () => {
		expect(A.equalTo('foo').fn('foo')).toBe(true)
		expect(A.equalTo('foo').fn('bar')).toBe(false)
	})

	test('Should return true when input matches any of the specified values', () => {
		expect(A.equalTo('foo', 'bar').fn('baz')).toBe(false)
		expect(A.equalTo('foo', 'bar').fn('foo')).toBe(true)
		expect(A.equalTo('foo', 'bar').fn('bar')).toBe(true)
	})

	test('Should return true when input does not match the specified value', () => {
		expect(A.not(A.equalTo('foo')).fn('foo')).toBe(false)
		expect(A.not(A.equalTo('foo')).fn('bar')).toBe(true)
	})
})

describe.concurrent('A.typeOf', () => {
	test('Should return true when input type matches the single specified type', () => {
		expect(A.typeOf('string').fn('foo')).toBe(true)
		expect(A.typeOf('string').fn(1)).toBe(false)
	})

	test('Should return true when input type matches any of the single specified types', () => {
		expect(A.typeOf('string', 'number').fn('foo')).toBe(true)
		expect(A.typeOf('string', 'number').fn(1)).toBe(true)
		expect(A.typeOf('string', 'number').fn(null)).toBe(false)
	})

	test('Should return true when input type does not match the specified type', () => {
		expect(A.not(A.typeOf('string')).fn('foo')).toBe(false)
		expect(A.not(A.typeOf('string')).fn(1)).toBe(true)
	})
})
