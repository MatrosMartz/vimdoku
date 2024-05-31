import { describe, expectTypeOf, test } from 'vitest'

import type { Numeric, ReadonlyRecord } from '~/share/types'

import * as A from './commons.util'
import { is } from './is.util'

describe('A.is.Any', () => {
	test('Should be guard of unknown type', () => {
		expectTypeOf(is.Any.fn).guards.toBeUnknown()
	})

	test('Should be guard of string type', () => {
		expectTypeOf(is.Any.fn<string>).guards.toBeString()
	})

	test('Should be guard of literal type "foo"', () => {
		expectTypeOf(is.Any.fn<'foo'>).guards.toEqualTypeOf<'foo'>()
	})
})

describe('A.is.Array', () => {
	test('Should be guard of readonly unknown array type', () => {
		expectTypeOf(is.Array.fn).guards.toMatchTypeOf<readonly unknown[]>()
	})

	test('Should be guard of empty array type', () => {
		expectTypeOf(is.Array.fn<[]>).guards.toEqualTypeOf<[]>()
	})

	test('Should be guard of string array type', () => {
		expectTypeOf(is.Array.fn<string[]>).guards.toEqualTypeOf<string[]>()
	})

	test('Should be guard of string type excluding array', () => {
		expectTypeOf(A.not(is.Array).fn<string | unknown[]>).guards.toBeString()
	})
})

describe('A.is.Array.equalTo', () => {
	test('Should be guard of array type with string followed by two unknowns', () => {
		expectTypeOf(is.Array.equalTo([A.typeOf('string'), ...is.Any.repeat(2)]).fn).guards.toEqualTypeOf<
			readonly [string, unknown, unknown]
		>()
	})

	test('Should be guard of array type excluding specified array structure', () => {
		expectTypeOf(
			A.not(is.Array.equalTo([A.typeOf('string'), is.Any])).fn<[string | number, boolean]>
		).guards.toEqualTypeOf<[number, boolean]>()
	})
})

describe('A.is.Array.with', () => {
	test('Should be guard of unknown array with string in the index two', () => {
		expectTypeOf(is.Array.with(2, A.typeOf('string')).fn).guards.toEqualTypeOf<
			readonly [unknown, unknown, string, ...unknown[]]
		>()
	})

	test('Should be guard of unknown array with string in the index one', () => {
		expectTypeOf(is.Array.with(1, A.typeOf('string')).fn<unknown[]>).guards.toEqualTypeOf<
			[unknown, string, ...unknown[]]
		>()
	})

	test('Should be guard of array with two unknowns items followed by string', () => {
		expectTypeOf(is.Array.with(2, A.typeOf('string')).fn<[unknown, unknown, string | number]>).guards.toEqualTypeOf<
			[unknown, unknown, string]
		>()
	})

	test('Should be guard of array with first element is string', () => {
		expectTypeOf(is.Array.with(0, A.typeOf('string')).fn<[unknown, unknown]>).guards.toEqualTypeOf<[string, unknown]>()
	})

	test('Should be guard of array with three items and a string in the index two', () => {
		expectTypeOf(
			is.Array.with(1, A.typeOf('string')).fn<[unknown, string, unknown] | [unknown, number, unknown]>
		).guards.toMatchTypeOf<[unknown, string, unknown]>()
	})

	test('Should be guard string in the index two', () => {
		expectTypeOf(
			A.not(is.Array.with(1, A.typeOf('string'))).fn<[unknown, string | number, unknown]>
		).guards.toEqualTypeOf<[unknown, number, unknown]>()
	})

	test('Should be guard exclude array with three items and a string in the index two', () => {
		expectTypeOf(
			A.not(is.Array.with(1, A.typeOf('string'))).fn<[unknown, string, unknown] | [unknown, number, unknown]>
		).guards.toMatchTypeOf<[unknown, number, unknown]>()
	})
})

describe('A.is.Map', () => {
	test('Should be guard of Map type', () => {
		expectTypeOf(is.Map.fn).guards.toEqualTypeOf<ReadonlyMap<unknown, unknown>>()
	})

	test('Should be guard of Map with unknown key and value', () => {
		expectTypeOf(is.Map.fn<Map<unknown, unknown> | []>).guards.toEqualTypeOf<Map<unknown, unknown>>()
	})

	test('Should be guard of Map with string key and unknown value', () => {
		expectTypeOf(is.Map.fn<ReadonlyMap<string, unknown>>).guards.toEqualTypeOf<ReadonlyMap<string, unknown>>()
	})

	test('Should be guard of array excluding Map with unknown key and value', () => {
		expectTypeOf(A.not(is.Map).fn<Map<unknown, unknown> | []>).guards.toEqualTypeOf<[]>()
	})
})

describe('A.is.Nullable', () => {
	test('Should be guard of null or undefined', () => {
		expectTypeOf(is.Nullable.fn).guards.toEqualTypeOf<null | undefined>()
	})

	test('Should be guard of null type', () => {
		expectTypeOf(is.Nullable.fn<string | null>).guards.toEqualTypeOf<null>()
	})

	test('Should be guard of array excluding undefined', () => {
		expectTypeOf(A.not(is.Nullable).fn<[] | undefined>).guards.toEqualTypeOf<[]>()
	})
})

describe('A.is.Numeric', () => {
	test('Should be guard of Numeric type', () => {
		expectTypeOf(is.Numeric.fn).guards.toEqualTypeOf<Numeric>()
	})

	test('Should be guard of bigint type', () => {
		expectTypeOf(is.Numeric.fn<string | bigint>).guards.toEqualTypeOf<bigint>()
	})

	test('Should be guard of object excluding Numeric type', () => {
		expectTypeOf(A.not(is.Numeric).fn<Record<string, unknown> | number>).guards.toEqualTypeOf<Record<string, unknown>>()
	})
})

describe('A.is.Object', () => {
	test('Should be guard of object type', () => {
		expectTypeOf(is.Object.fn).guards.toEqualTypeOf<object>()
	})

	test('Should be guard of array type', () => {
		expectTypeOf(is.Object.fn<[] | number>).guards.toEqualTypeOf<[]>()
	})

	test('Should be guard of number type excluding readonly object', () => {
		expectTypeOf(A.not(is.Object).fn<ReadonlyRecord<number, unknown> | number>).guards.toEqualTypeOf<number>()
	})
})

describe('A.is.Object.equalTo', () => {
	test('Should be guard of object with any property', () => {
		expectTypeOf(is.Object.equalTo({ foo: is.Any }).fn).guards.toEqualTypeOf<{ readonly foo: unknown }>()
	})

	test('Should be guard of object with specified property type', () => {
		expectTypeOf(is.Object.equalTo({ foo: is.Any }).fn<{ foo: string }>).guards.toEqualTypeOf<{ foo: string }>()
	})

	test('Should be guard of object with string property', () => {
		expectTypeOf(is.Object.equalTo({ foo: A.typeOf('string') }).fn<{ readonly foo: unknown }>).guards.toEqualTypeOf<{
			readonly foo: string
		}>()
	})

	test('Should be guard of object with specified structure', () => {
		expectTypeOf(
			is.Object.equalTo({ foo: A.typeOf('string') }).fn<{ foo: unknown } | { bar: unknown }>
		).guards.toEqualTypeOf<{
			foo: string
		}>()
	})

	test('Should be guard of object with string property excluding number property', () => {
		expectTypeOf(
			is.Object.equalTo({ foo: A.typeOf('string') }).fn<{ foo: unknown } | { foo: number }>
		).guards.toEqualTypeOf<{
			foo: string
		}>()
	})

	test('Should be guard of object with string property in union type', () => {
		expectTypeOf(is.Object.equalTo({ foo: A.typeOf('string') }).fn<{ foo: string | number }>).guards.toEqualTypeOf<{
			foo: string
		}>()
	})

	test('Should be guard of object with different key structure', () => {
		expectTypeOf(
			A.not(is.Object.equalTo({ foo: is.Any })).fn<{ foo: unknown } | { bar: unknown }>
		).guards.toEqualTypeOf<{
			bar: unknown
		}>()
	})

	test('Should be guard of object with string property excluding number property in union', () => {
		expectTypeOf(
			A.not(is.Object.equalTo({ foo: A.typeOf('string') })).fn<{ foo: string | number }>
		).guards.toEqualTypeOf<{
			foo: number
		}>()
	})

	test('Should be guard of object with number property excluding string property', () => {
		expectTypeOf(
			A.not(is.Object.equalTo({ foo: A.typeOf('string') })).fn<{ foo: string } | { foo: number }>
		).guards.toEqualTypeOf<{
			foo: number
		}>()
	})
})

describe('A.is.Object.with', () => {
	test('Should be guard of object with specified key and any type', () => {
		expectTypeOf(is.Object.with('foo', is.Any).fn).guards.toEqualTypeOf<{ readonly foo: unknown }>()
	})

	test('Should be guard of object with specified key and boolean type', () => {
		expectTypeOf(is.Object.with('foo', A.typeOf('boolean')).fn<{ foo: unknown }>).guards.toEqualTypeOf<{
			foo: boolean
		}>()
	})

	test('Should be guard of object with specified key and boolean type in union', () => {
		expectTypeOf(is.Object.with('foo', A.typeOf('boolean')).fn<{ foo: string | boolean }>).guards.toEqualTypeOf<{
			foo: boolean
		}>()
	})

	test('Should be guard of object with boolean property excluding string property', () => {
		expectTypeOf(
			is.Object.with('foo', A.typeOf('boolean')).fn<{ foo: string } | { foo: boolean }>
		).guards.toEqualTypeOf<{ foo: boolean }>()
	})

	// TODO:
	// test('Should be guard of object with required boolean property', () => {
	// 	expectTypeOf(
	// 		is.Object.with('foo', A.typeOf('boolean')).fn<{ foo?: boolean; bar: number }>
	// 	).guards.toEqualTypeOf<{ bar: number; foo: boolean }>()
	// })
})

describe('A.is.Object.withKey', () => {
	test('Should be guard of object with specified keys', () => {
		expectTypeOf(is.Object.withKey('foo', 'bar').fn).guards.toEqualTypeOf<{
			readonly bar: unknown
			readonly foo: unknown
		}>()
	})

	test('Should be guard of object with specified key and type', () => {
		expectTypeOf(is.Object.withKey('foo').fn<{ foo: string }>).guards.toEqualTypeOf<{ foo: string }>()
	})

	test('Should be guard of object with specified key and type in union', () => {
		expectTypeOf(is.Object.withKey('foo').fn<{ foo: number } | { bar: string }>).guards.toEqualTypeOf<{
			foo: number
		}>()
	})

	test('Should be guard of object with specified key in union', () => {
		expectTypeOf(is.Object.withKey('foo').fn<{ foo: number } | { foo: string }>).guards.toEqualTypeOf<
			{ foo: number } | { foo: string }
		>()
	})

	test('Should be guard of object with specified key and multiple properties', () => {
		expectTypeOf(is.Object.withKey('foo').fn<{ bar: string; foo: number }>).guards.toEqualTypeOf<{
			bar: string
			foo: number
		}>()
	})

	test('Should be guard of object excluding specified key', () => {
		expectTypeOf(A.not(is.Object.withKey('foo')).fn<{ foo: number } | { bar: string }>).guards.toEqualTypeOf<{
			bar: string
		}>()
	})
})

describe('A.is.PropertyKey', () => {
	test('Should be guard of property key type', () => {
		expectTypeOf(is.PropertyKey.fn).guards.toEqualTypeOf<PropertyKey>()
	})

	test('Should be guard of symbol type', () => {
		expectTypeOf(is.PropertyKey.fn<symbol | boolean>).guards.toEqualTypeOf<symbol>()
	})

	test('Should be guard of non-property key type excluding symbol', () => {
		expectTypeOf(A.not(is.PropertyKey).fn<symbol | boolean>).guards.toEqualTypeOf<boolean>()
	})
})

describe('A.is.Set', () => {
	test('Should be guard of Set type', () => {
		expectTypeOf(is.Set.fn).guards.toEqualTypeOf<ReadonlySet<unknown>>()
	})

	test('Should be guard of Set of numbers type', () => {
		expectTypeOf(is.Set.fn<Set<number> | number>).guards.toEqualTypeOf<Set<number>>()
	})

	test('Should be guard of non-Set type excluding set of numbers', () => {
		expectTypeOf(A.not(is.Set).fn<Set<number> | number>).guards.toEqualTypeOf<number>()
	})
})

describe('A.is.SetLike', () => {
	test('Should be guard of Set-like type', () => {
		expectTypeOf(is.SetLike.fn).guards.toEqualTypeOf<ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>>()
	})

	test('Should be guard of Set or Map type', () => {
		expectTypeOf(is.SetLike.fn<Set<boolean> | Map<unknown, boolean>>).guards.toEqualTypeOf<
			Set<boolean> | Map<unknown, boolean>
		>()
	})

	test('Should be guard of Map type excluding boolean', () => {
		expectTypeOf(is.SetLike.fn<Map<unknown, boolean> | boolean>).guards.toEqualTypeOf<Map<unknown, boolean>>()
	})

	test('Should be guard of non-Set-like type excluding Set', () => {
		expectTypeOf(A.not(is.SetLike).fn<Set<boolean> | boolean>).guards.toEqualTypeOf<boolean>()
	})
})

describe('A.is.String', () => {
	test('Should be guard of string type', () => {
		expectTypeOf(is.String.fn).guards.toEqualTypeOf<string>()
	})

	test('Should be guard of non-string type', () => {
		expectTypeOf(A.not(is.String).fn<string | boolean>).guards.toEqualTypeOf<boolean>()
	})
})

describe('A.is.String.endWith', () => {
	test('Should be guard of string ending with "foo"', () => {
		expectTypeOf(is.String.endWith('foo').fn).guards.toEqualTypeOf<`${string}foo`>()
	})

	test('Should be guard of string union ending with "foo"', () => {
		expectTypeOf(is.String.endWith('foo').fn<'foo' | 'bar'>).guards.toEqualTypeOf<'foo'>()
	})

	test('Should be guard of template string ending with "foo"', () => {
		expectTypeOf(is.String.endWith('foo').fn<`baz-${'foo' | 'bar'}`>).guards.toEqualTypeOf<'baz-foo'>()
	})

	test('Should be guard of complex template string ending with "foo"', () => {
		expectTypeOf(is.String.endWith('foo').fn<`bar/${string}`>).guards.toEqualTypeOf<`${string}foo` & `bar/${string}`>()
	})

	test('Should be guard of non-string ending with "foo"', () => {
		expectTypeOf(A.not(is.String.endWith('foo')).fn).guards.toEqualTypeOf<unknown>()
	})

	test('Should be guard of string union not ending with "foo"', () => {
		expectTypeOf(A.not(is.String.endWith('foo')).fn<'foo' | 'bar'>).guards.toEqualTypeOf<'bar'>()
	})

	test('Should be guard of template string not ending with "foo"', () => {
		expectTypeOf(A.not(is.String.endWith('foo')).fn<`baz-${'foo' | 'bar'}`>).guards.toEqualTypeOf<'baz-bar'>()
	})

	test('Should be guard of complex template string not ending with "foo"', () => {
		expectTypeOf(A.not(is.String.endWith('foo')).fn<`bar/${string}`>).guards.toEqualTypeOf<`bar/${string}`>()
	})
})

describe('A.is.String.match', () => {
	test('Should be guard of string type', () => {
		expectTypeOf(is.String.match(/foo/i).fn).guards.toEqualTypeOf<string>()
	})

	test('Should be guard of non-string type', () => {
		expectTypeOf(A.not(is.String.match(/foo/)).fn).guards.toEqualTypeOf<unknown>()
	})
})

describe('A.is.String.startWith', () => {
	test('Should be guard of string starting with "foo"', () => {
		expectTypeOf(is.String.startWith('foo').fn).guards.toEqualTypeOf<`foo${string}`>()
	})

	test('Should be guard of string union starting with "foo"', () => {
		expectTypeOf(is.String.startWith('foo').fn<'foo' | 'bar'>).guards.toEqualTypeOf<'foo'>()
	})

	test('Should be guard of template string starting with "foo"', () => {
		expectTypeOf(is.String.startWith('foo').fn<`${'foo' | 'bar'}-baz`>).guards.toEqualTypeOf<'foo-baz'>()
	})

	test('Should be guard of complex template string starting with "foo"', () => {
		expectTypeOf(is.String.startWith('foo').fn<`${string}/bar`>).guards.toEqualTypeOf<
			`foo${string}` & `${string}/bar`
		>()
	})

	test('Should be guard of non-string starting with "foo"', () => {
		expectTypeOf(A.not(is.String.startWith('foo')).fn).guards.toEqualTypeOf<unknown>()
	})

	test('Should be guard of string union not starting with "foo"', () => {
		expectTypeOf(A.not(is.String.startWith('foo')).fn<'foo' | 'bar'>).guards.toEqualTypeOf<'bar'>()
	})

	test('Should be guard of template string not starting with "foo"', () => {
		expectTypeOf(A.not(is.String.startWith('foo')).fn<`${'foo' | 'bar'}-baz`>).guards.toEqualTypeOf<'bar-baz'>()
	})

	test('Should be guard of complex template string not starting with "foo"', () => {
		expectTypeOf(A.not(is.String.startWith('foo')).fn<`${string}/bar`>).guards.toEqualTypeOf<`${string}/bar`>()
	})
})
