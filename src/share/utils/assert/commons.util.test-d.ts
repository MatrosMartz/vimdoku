import { describe, expectTypeOf, test } from 'vitest'

import * as A from './commons.util'

describe('A.typeof', () => {
	test('Should be guard of string type', () => {
		expectTypeOf(A.typeOf('string').fn).guards.toBeString()
	})

	test('Should be guard of union type string or boolean', () => {
		expectTypeOf(A.typeOf('string', 'boolean').fn).guards.toEqualTypeOf<string | boolean>()
	})

	test('Should be guard of boolean type when string and boolean types are provided', () => {
		expectTypeOf(A.typeOf('string', 'boolean').fn<boolean>).guards.toBeBoolean()
	})

	test('Should be guard of number type excluding string', () => {
		expectTypeOf(A.not(A.typeOf('string')).fn<number | string>).guards.toBeNumber()
	})

	test('Should be guard of number type excluding string and boolean', () => {
		expectTypeOf(A.not(A.typeOf('string', 'boolean')).fn<number | string>).guards.toBeNumber()
	})
})

describe('A.equalTo', () => {
	test('Should be guard of literal type 1', () => {
		expectTypeOf(A.equalTo(1).fn).guards.toEqualTypeOf<1>()
	})

	test('Should be guard of unique symbol', () => {
		const foo = Symbol('some-symbol')
		expectTypeOf(A.equalTo(foo).fn).guards.toEqualTypeOf<typeof foo>()
	})

	test('Should be guard of literal type excluding "foo"', () => {
		expectTypeOf(A.not(A.equalTo('foo')).fn<'foo' | 'bar'>).guards.toEqualTypeOf<'bar'>()
	})
})
