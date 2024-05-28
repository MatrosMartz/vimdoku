import { describe, expectTypeOf, test } from 'vitest'

import type { Numeric, ReadonlyRecord } from '../types'
import * as A from './assert.util'

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

	test('Should be guard of symbol type', () => {
		const foo = Symbol('some-symbol')
		expectTypeOf(A.equalTo(foo).fn).guards.toEqualTypeOf<typeof foo>()
	})

	test('Should be guard of literal type excluding "foo"', () => {
		expectTypeOf(A.not(A.equalTo('foo')).fn<'foo' | 'bar'>).guards.toEqualTypeOf<'bar'>()
	})
})

describe('A.is.Any', () => {
	test('Should be guard of unknown type', () => {
		expectTypeOf(A.is.Any.fn).guards.toBeUnknown()
	})

	test('Should be guard of string type', () => {
		expectTypeOf(A.is.Any.fn<string>).guards.toBeString()
	})

	test('Should be guard of literal type "foo"', () => {
		expectTypeOf(A.is.Any.fn<'foo'>).guards.toEqualTypeOf<'foo'>()
	})
})

describe('A.is.Array', () => {
	test('Should be guard of readonly unknown array type', () => {
		expectTypeOf(A.is.Array.fn).guards.toMatchTypeOf<readonly unknown[]>()
	})

	test('Should be guard of empty array type', () => {
		expectTypeOf(A.is.Array.fn<[]>).guards.toEqualTypeOf<[]>()
	})

	test('Should be guard of string type excluding array', () => {
		expectTypeOf(A.not(A.is.Array).fn<string | unknown[]>).guards.toBeString()
	})

	describe('equalTo', () => {
		test('Should be guard of array type with string followed by two unknowns', () => {
			expectTypeOf(A.is.Array.equalTo([A.typeOf('string'), ...A.is.Any.repeat(2)]).fn).guards.toEqualTypeOf<
				readonly [string, unknown, unknown]
			>()
		})

		test('Should be guard of array type excluding specified array structure', () => {
			expectTypeOf(
				A.not(A.is.Array.equalTo([A.typeOf('string'), A.is.Any])).fn<[string | number, boolean]>
			).guards.toEqualTypeOf<[number, boolean]>()
		})
	})

	describe('with', () => {
		test('Should be guard of unknown array with string in the index two', () => {
			expectTypeOf(A.is.Array.with(2, A.typeOf('string')).fn).guards.toEqualTypeOf<
				readonly [unknown, unknown, string, ...unknown[]]
			>()
		})

		test('Should be guard of unknown array with string in the index one', () => {
			expectTypeOf(A.is.Array.with(1, A.typeOf('string')).fn<unknown[]>).guards.toEqualTypeOf<
				[unknown, string, ...unknown[]]
			>()
		})

		test('Should be guard of array with two unknowns items followed by string', () => {
			expectTypeOf(A.is.Array.with(2, A.typeOf('string')).fn<[unknown, unknown, string | number]>).guards.toEqualTypeOf<
				[unknown, unknown, string]
			>()
		})

		test('Should be guard of array with first element is string', () => {
			expectTypeOf(A.is.Array.with(0, A.typeOf('string')).fn<[unknown, unknown]>).guards.toEqualTypeOf<
				[string, unknown]
			>()
		})

		test('Should be guard of array with three items and a string in the index two', () => {
			expectTypeOf(
				A.is.Array.with(1, A.typeOf('string')).fn<[unknown, string, unknown] | [unknown, number, unknown]>
			).guards.toMatchTypeOf<[unknown, string, unknown]>()
		})

		test('Should be guard string in the index two', () => {
			expectTypeOf(
				A.not(A.is.Array.with(1, A.typeOf('string'))).fn<[unknown, string | number, unknown]>
			).guards.toEqualTypeOf<[unknown, number, unknown]>()
		})

		test('Should be guard exclude array with three items and a string in the index two', () => {
			expectTypeOf(
				A.not(A.is.Array.with(1, A.typeOf('string'))).fn<[unknown, string, unknown] | [unknown, number, unknown]>
			).guards.toMatchTypeOf<[unknown, number, unknown]>()
		})
	})
})

describe('A.is.Map', () => {
	test('Should be guard of Map type', () => {
		expectTypeOf(A.is.Map.fn).guards.toEqualTypeOf<ReadonlyMap<unknown, unknown>>()
	})

	test('Should be guard of Map with unknown key and value', () => {
		expectTypeOf(A.is.Map.fn<Map<unknown, unknown> | []>).guards.toEqualTypeOf<Map<unknown, unknown>>()
	})

	test('Should be guard of Map with string key and unknown value', () => {
		expectTypeOf(A.is.Map.fn<ReadonlyMap<string, unknown>>).guards.toEqualTypeOf<ReadonlyMap<string, unknown>>()
	})

	test('Should be guard of array excluding Map with unknown key and value', () => {
		expectTypeOf(A.not(A.is.Map).fn<Map<unknown, unknown> | []>).guards.toEqualTypeOf<[]>()
	})
})

describe('A.is.Nullable', () => {
	test('Should be guard of null or undefined', () => {
		expectTypeOf(A.is.Nullable.fn).guards.toEqualTypeOf<null | undefined>()
	})

	test('Should be guard of null type', () => {
		expectTypeOf(A.is.Nullable.fn<string | null>).guards.toEqualTypeOf<null>()
	})

	test('Should be guard of array excluding undefined', () => {
		expectTypeOf(A.not(A.is.Nullable).fn<[] | undefined>).guards.toEqualTypeOf<[]>()
	})
})

describe('A.is.Numeric', () => {
	test('Should be guard of Numeric type', () => {
		expectTypeOf(A.is.Numeric.fn).guards.toEqualTypeOf<Numeric>()
	})

	test('Should be guard of bigint type', () => {
		expectTypeOf(A.is.Numeric.fn<string | bigint>).guards.toEqualTypeOf<bigint>()
	})

	test('Should be guard of object excluding Numeric type', () => {
		expectTypeOf(A.not(A.is.Numeric).fn<Record<string, unknown> | number>).guards.toEqualTypeOf<
			Record<string, unknown>
		>()
	})
})

describe('A.is.Object', () => {
	test('Should be guard of object type', () => {
		expectTypeOf(A.is.Object.fn).guards.toEqualTypeOf<object>()
	})

	test('Should be guard of array type', () => {
		expectTypeOf(A.is.Object.fn<[] | number>).guards.toEqualTypeOf<[]>()
	})

	test('Should be guard of number type excluding readonly object', () => {
		expectTypeOf(A.not(A.is.Object).fn<ReadonlyRecord<number, unknown> | number>).guards.toEqualTypeOf<number>()
	})

	describe('equalTo', () => {
		test('Should be guard of object with any property', () => {
			expectTypeOf(A.is.Object.equalTo({ foo: A.is.Any }).fn).guards.toEqualTypeOf<{ readonly foo: unknown }>()
		})

		test('Should be guard of object with specified property type', () => {
			expectTypeOf(A.is.Object.equalTo({ foo: A.is.Any }).fn<{ foo: string }>).guards.toEqualTypeOf<{ foo: string }>()
		})

		test('Should be guard of object with string property', () => {
			expectTypeOf(
				A.is.Object.equalTo({ foo: A.typeOf('string') }).fn<{ readonly foo: unknown }>
			).guards.toEqualTypeOf<{
				readonly foo: string
			}>()
		})

		test('Should be guard of object with specified structure', () => {
			expectTypeOf(
				A.is.Object.equalTo({ foo: A.typeOf('string') }).fn<{ foo: unknown } | { bar: unknown }>
			).guards.toEqualTypeOf<{
				foo: string
			}>()
		})

		test('Should be guard of object with string property excluding number property', () => {
			expectTypeOf(
				A.is.Object.equalTo({ foo: A.typeOf('string') }).fn<{ foo: unknown } | { foo: number }>
			).guards.toEqualTypeOf<{
				foo: string
			}>()
		})

		test('Should be guard of object with string property in union type', () => {
			expectTypeOf(A.is.Object.equalTo({ foo: A.typeOf('string') }).fn<{ foo: string | number }>).guards.toEqualTypeOf<{
				foo: string
			}>()
		})

		test('Should be guard of object with different key structure', () => {
			expectTypeOf(
				A.not(A.is.Object.equalTo({ foo: A.is.Any })).fn<{ foo: unknown } | { bar: unknown }>
			).guards.toEqualTypeOf<{
				bar: unknown
			}>()
		})

		test('Should be guard of object with string property excluding number property in union', () => {
			expectTypeOf(
				A.not(A.is.Object.equalTo({ foo: A.typeOf('string') })).fn<{ foo: string | number }>
			).guards.toEqualTypeOf<{
				foo: number
			}>()
		})

		test('Should be guard of object with number property excluding string property', () => {
			expectTypeOf(
				A.not(A.is.Object.equalTo({ foo: A.typeOf('string') })).fn<{ foo: string } | { foo: number }>
			).guards.toEqualTypeOf<{
				foo: number
			}>()
		})
	})

	describe('with', () => {
		test('Should be guard of object with specified key and any type', () => {
			expectTypeOf(A.is.Object.with('foo', A.is.Any).fn).guards.toEqualTypeOf<{ readonly foo: unknown }>()
		})

		test('Should be guard of object with specified key and boolean type', () => {
			expectTypeOf(A.is.Object.with('foo', A.typeOf('boolean')).fn<{ foo: unknown }>).guards.toEqualTypeOf<{
				foo: boolean
			}>()
		})

		test('Should be guard of object with specified key and boolean type in union', () => {
			expectTypeOf(A.is.Object.with('foo', A.typeOf('boolean')).fn<{ foo: string | boolean }>).guards.toEqualTypeOf<{
				foo: boolean
			}>()
		})

		test('Should be guard of object with boolean property excluding string property', () => {
			expectTypeOf(
				A.is.Object.with('foo', A.typeOf('boolean')).fn<{ foo: string } | { foo: boolean }>
			).guards.toEqualTypeOf<{ foo: boolean }>()
		})

		// TODO:
		// test('Should be guard of object with required boolean property', () => {
		// 	expectTypeOf(
		// 		A.is.Object.with('foo', A.typeOf('boolean')).fn<{ foo?: boolean; bar: number }>
		// 	).guards.toEqualTypeOf<{ bar: number; foo: boolean }>()
		// })
	})

	describe('withKey', () => {
		test('Should be guard of object with specified keys', () => {
			expectTypeOf(A.is.Object.withKey('foo', 'bar').fn).guards.toEqualTypeOf<{
				readonly bar: unknown
				readonly foo: unknown
			}>()
		})

		test('Should be guard of object with specified key and type', () => {
			expectTypeOf(A.is.Object.withKey('foo').fn<{ foo: string }>).guards.toEqualTypeOf<{ foo: string }>()
		})

		test('Should be guard of object with specified key and type in union', () => {
			expectTypeOf(A.is.Object.withKey('foo').fn<{ foo: number } | { bar: string }>).guards.toEqualTypeOf<{
				foo: number
			}>()
		})

		test('Should be guard of object with specified key in union', () => {
			expectTypeOf(A.is.Object.withKey('foo').fn<{ foo: number } | { foo: string }>).guards.toEqualTypeOf<
				{ foo: number } | { foo: string }
			>()
		})

		test('Should be guard of object with specified key and multiple properties', () => {
			expectTypeOf(A.is.Object.withKey('foo').fn<{ bar: string; foo: number }>).guards.toEqualTypeOf<{
				bar: string
				foo: number
			}>()
		})

		test('Should be guard of object excluding specified key', () => {
			expectTypeOf(A.not(A.is.Object.withKey('foo')).fn<{ foo: number } | { bar: string }>).guards.toEqualTypeOf<{
				bar: string
			}>()
		})
	})
})

describe('A.is.PropertyKey', () => {
	test('Should be guard of property key type', () => {
		expectTypeOf(A.is.PropertyKey.fn).guards.toEqualTypeOf<PropertyKey>()
	})

	test('Should be guard of symbol type', () => {
		expectTypeOf(A.is.PropertyKey.fn<symbol | boolean>).guards.toEqualTypeOf<symbol>()
	})

	test('Should be guard of non-property key type excluding symbol', () => {
		expectTypeOf(A.not(A.is.PropertyKey).fn<symbol | boolean>).guards.toEqualTypeOf<boolean>()
	})
})

describe('A.is.Set', () => {
	test('Should be guard of Set type', () => {
		expectTypeOf(A.is.Set.fn).guards.toEqualTypeOf<ReadonlySet<unknown>>()
	})

	test('Should be guard of Set of numbers type', () => {
		expectTypeOf(A.is.Set.fn<Set<number> | number>).guards.toEqualTypeOf<Set<number>>()
	})

	test('Should be guard of non-Set type excluding set of numbers', () => {
		expectTypeOf(A.not(A.is.Set).fn<Set<number> | number>).guards.toEqualTypeOf<number>()
	})
})

describe('A.is.SetLike', () => {
	test('Should be guard of Set-like type', () => {
		expectTypeOf(A.is.SetLike.fn).guards.toEqualTypeOf<ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>>()
	})

	test('Should be guard of Set or Map type', () => {
		expectTypeOf(A.is.SetLike.fn<Set<boolean> | Map<unknown, boolean>>).guards.toEqualTypeOf<
			Set<boolean> | Map<unknown, boolean>
		>()
	})

	test('Should be guard of Map type excluding boolean', () => {
		expectTypeOf(A.is.SetLike.fn<Map<unknown, boolean> | boolean>).guards.toEqualTypeOf<Map<unknown, boolean>>()
	})

	test('Should be guard of non-Set-like type excluding Set', () => {
		expectTypeOf(A.not(A.is.SetLike).fn<Set<boolean> | boolean>).guards.toEqualTypeOf<boolean>()
	})
})
