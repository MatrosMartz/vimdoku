import { describe, expectTypeOf, test } from 'vitest'

import type * as A from './core.util'

describe('A.Extract with unknown', () => {
	test('Should be unknown', () => {
		expectTypeOf<A.Extract<unknown, unknown>>().toEqualTypeOf<unknown>()
	})

	test('Should be string', () => {
		expectTypeOf<A.Extract<unknown, string>>().toEqualTypeOf<string>()
	})

	test('Should be "foo" literal', () => {
		expectTypeOf<A.Extract<unknown, 'foo'>>().toEqualTypeOf<'foo'>()
	})

	test('Should be foo unique symbol', () => {
		const foo = Symbol('foo')
		expectTypeOf<A.Extract<unknown, typeof foo>>().toEqualTypeOf(foo)
	})
})

describe('A.Extact with string', () => {
	test('Should be string type', () => {
		expectTypeOf<A.Extract<string, unknown>>().toEqualTypeOf<string>()
		expectTypeOf<A.Extract<string, string>>().toEqualTypeOf<string>()
	})

	test('Should be "foo" literal', () => {
		expectTypeOf<A.Extract<string, 'foo'>>().toEqualTypeOf<'foo'>()
		expectTypeOf<A.Extract<'foo' | true, string>>().toEqualTypeOf<'foo'>()
		expectTypeOf<A.Extract<'foo' | 'bar', `f${string}`>>().toEqualTypeOf<'foo'>()
	})

	test('Should be never', () => {
		expectTypeOf<A.Extract<string, never>>().toEqualTypeOf<never>()
		expectTypeOf<A.Extract<string, number>>().toEqualTypeOf<never>()
		expectTypeOf<A.Extract<string, object>>().toEqualTypeOf<never>()
		expectTypeOf<A.Extract<'foo', 'bar'>>().toEqualTypeOf<never>()
	})
})

describe('A.Extract with number', () => {
	test('Should be number type', () => {
		expectTypeOf<A.Extract<number, number>>().toEqualTypeOf<number>()
		expectTypeOf<A.Extract<number, unknown>>().toEqualTypeOf<number>()
	})

	test('Should be 120 literal', () => {
		expectTypeOf<A.Extract<number, 120>>().toEqualTypeOf<120>()
		expectTypeOf<A.Extract<120 | 'foo', number>>().toEqualTypeOf<120>()
	})

	test('Should be never', () => {
		expectTypeOf<A.Extract<number, never>>().toEqualTypeOf<never>()
		expectTypeOf<A.Extract<number, boolean>>().toEqualTypeOf<never>()
		expectTypeOf<A.Extract<number, []>>().toEqualTypeOf<never>()
		expectTypeOf<A.Extract<120, 230>>().toEqualTypeOf<never>()
	})
})

describe('A.Extract with array', () => {
	test('', () => {
		expectTypeOf<A.Extract<unknown[], number[]>>().toEqualTypeOf<number[]>()
		expectTypeOf<A.Extract<string[], readonly unknown[]>>().toEqualTypeOf<string[]>()
		expectTypeOf<A.Extract<readonly unknown[], string[]>>().toEqualTypeOf<string[]>()
		expectTypeOf<A.Extract<unknown[], readonly string[]>>().toEqualTypeOf<string[]>()
		expectTypeOf<A.Extract<number[], string[]>>().toEqualTypeOf<never>()
	})

	test('', () => {
		expectTypeOf<A.Extract<unknown[], [string]>>().toEqualTypeOf<[string]>()
		expectTypeOf<A.Extract<string[], [string]>>().toEqualTypeOf<[string]>()
		expectTypeOf<A.Extract<[string], string[]>>().toEqualTypeOf<[string]>()
		expectTypeOf<A.Extract<[string, ...string[]], [string]>>().toEqualTypeOf<[string, ...string[]]>()
		expectTypeOf<A.Extract<number[], [string]>>().toEqualTypeOf<never>()
	})
})
