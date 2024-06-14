import { describe, expect, test } from 'vitest'

import * as A from './commons.util'

describe.concurrent('A.equalTo', () => {
	test('Should return true when input matches the single specified value', () => {
		expect(A.equalTo('foo').fn('foo')).toBeTrue()
		expect(A.equalTo('foo').fn('bar')).toBeFalse()
	})

	test('Should return true when input matches any of the specified values', () => {
		expect(A.equalTo('foo', 'bar').fn('baz')).toBeFalse()
		expect(A.equalTo('foo', 'bar').fn('foo')).toBeTrue()
		expect(A.equalTo('foo', 'bar').fn('bar')).toBeTrue()
	})

	test('Should return true when input does not match the specified value', () => {
		expect(A.not(A.equalTo('foo')).fn('foo')).toBeFalse()
		expect(A.not(A.equalTo('foo')).fn('bar')).toBeTrue()
	})
})

describe.concurrent('A.typeOf', () => {
	test('Should return true when input type matches the single specified type', () => {
		expect(A.typeOf('string').fn('foo')).toBeTrue()
		expect(A.typeOf('string').fn(1)).toBeFalse()
	})

	test('Should return true when input type matches any of the single specified types', () => {
		expect(A.typeOf('string', 'number').fn('foo')).toBeTrue()
		expect(A.typeOf('string', 'number').fn(1)).toBeTrue()
		expect(A.typeOf('string', 'number').fn(null)).toBeFalse()
	})

	test('Should return true when input type does not match the specified type', () => {
		expect(A.not(A.typeOf('string')).fn('foo')).toBeFalse()
		expect(A.not(A.typeOf('string')).fn(1)).toBeTrue()
	})
})
