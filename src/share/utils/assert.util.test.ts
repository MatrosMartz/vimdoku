import { describe, expect, test } from 'vitest'

import * as A from './assert.util'

/* eslint-disable @typescript-eslint/no-extraneous-class */
class Foo {}
class Bar {}
/* eslint-enable @typescript-eslint/no-extraneous-class */

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

describe.concurrent('A.match', () => {
	test('Should return true when input matches the specified regex', () => {
		expect(A.match(/^<[^<>]+>$/i).fn('<foo>')).toBe(true)
		expect(A.match(/^<[^<>]+>$/i).fn('foo')).toBe(false)
	})
})

describe.concurrent('A.is', () => {
	test('Should return true when input instance of Object', () => {
		expect(A.is(Object).fn({})).toBe(true)
		expect(A.is(Object).fn([])).toBe(true)
		expect(A.is(Object).fn(new Foo())).toBe(true)
		expect(A.is(Object).fn(null)).toBe(false)
	})

	test('Should return true when input instance of the single specified class', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(A.is(Foo).fn(foo)).toBe(true)
		expect(A.is(Foo).fn(bar)).toBe(false)
	})

	test('Should return true when input instance any of the single specified classes', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(A.is(Foo, Bar).fn(foo)).toBe(true)
		expect(A.is(Foo, Bar).fn(bar)).toBe(true)
		expect(A.is(Foo, Bar).fn({})).toBe(false)
	})

	test('Should return true when input does not instance the specified class', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(A.not(A.is(Foo)).fn(foo)).toBe(false)
		expect(A.not(A.is(Foo)).fn(bar)).toBe(true)
	})
})

describe.concurrent('A.is.Any', () => {
	test('Should return true when any input', () => {
		expect(A.is.Any.fn(null)).toBe(true)
		expect(A.is.Any.fn('foo')).toBe(true)
		expect(A.is.Any.fn(120)).toBe(true)
		expect(A.is.Any.fn(Symbol('bar'))).toBe(true)
		expect(A.is.Any.fn(false)).toBe(true)
		expect(A.is.Any.fn(Foo)).toBe(true)
		expect(A.is.Any.fn(new Bar())).toBe(true)
		expect(A.is.Any.fn([])).toBe(true)
	})
})

describe.concurrent('A.is.Array', () => {
	test('Should return true when input is array', () => {
		expect(A.is.Array.fn([])).toBe(true)
		expect(A.is.Array.fn([1, 2, 3])).toBe(true)
		expect(A.is.Array.fn(new Array(1))).toBe(true)
		expect(A.is.Array.fn({})).toBe(false)
		expect(A.is.Array.fn('foo')).toBe(false)
	})

	test('Should be return true when input not is array', () => {
		expect(A.not(A.is.Array).fn([])).toBe(false)
		expect(A.not(A.is.Array).fn([1, 2, 3])).toBe(false)
		expect(A.not(A.is.Array).fn(new Array(1))).toBe(false)
		expect(A.not(A.is.Array).fn({})).toBe(true)
		expect(A.not(A.is.Array).fn('foo')).toBe(true)
	})
})

describe.concurrent('A.is.Array.equalTo', () => {
	test('Should be return true when input matches the array structure', () => {
		expect(A.is.Array.equalTo([A.typeOf('string')]).fn(['foo'])).toBe(true)
		expect(A.is.Array.equalTo([A.match(/^bar$/)]).fn(['bar'])).toBe(true)
		expect(A.is.Array.equalTo([A.typeOf('string')]).fn([])).toBe(false)
		expect(A.is.Array.equalTo([A.typeOf('string')]).fn(['foo', 'bar'])).toBe(false)
		expect(A.is.Array.equalTo([A.typeOf('string')]).fn([120])).toBe(false)
	})

	test('Should be return true when input does not matches the array structure', () => {
		expect(A.not(A.is.Array.equalTo([A.typeOf('string')])).fn(['foo'])).toBe(false)
		expect(A.not(A.is.Array.equalTo([A.typeOf('string')])).fn(['bar'])).toBe(false)
		expect(A.not(A.is.Array.equalTo([A.typeOf('string')])).fn([])).toBe(true)
		expect(A.not(A.is.Array.equalTo([A.typeOf('string')])).fn(['foo', 'bar'])).toBe(true)
		expect(A.not(A.is.Array.equalTo([A.typeOf('string')])).fn([120])).toBe(true)
	})
})

describe.concurrent('A.is.Array.with', () => {
	test('Should be return true when item of input matches the structure', () => {
		expect(A.is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar'])).toBe(true)
		expect(A.is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar', 'baz'])).toBe(true)
		expect(A.is.Array.with(1, A.typeOf('string')).fn([120, 'foo'])).toBe(true)
		expect(A.is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar', true])).toBe(true)
		expect(A.is.Array.with(1, A.typeOf('string')).fn(['foo', 120, true])).toBe(false)
		expect(A.is.Array.with(1, A.typeOf('string')).fn(['foo', true, 'bar'])).toBe(false)
	})

	test('Should be return true when item of input does not matches the structure', () => {
		expect(A.not(A.is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar'])).toBe(false)
		expect(A.not(A.is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar', 'baz'])).toBe(false)
		expect(A.not(A.is.Array.with(1, A.typeOf('string'))).fn([120, 'foo'])).toBe(false)
		expect(A.not(A.is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar', true])).toBe(false)
		expect(A.not(A.is.Array.with(1, A.typeOf('string'))).fn(['foo', 120, true])).toBe(true)
		expect(A.not(A.is.Array.with(1, A.typeOf('string'))).fn(['foo', true, 'bar'])).toBe(true)
	})
})

describe.concurrent('A.is.Map', () => {
	test('Should be return true when input is Map', () => {
		expect(A.is.Map.fn(new Map())).toBe(true)
		expect(
			A.is.Map.fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBe(true)
		expect(A.is.Map.fn([])).toBe(false)
	})

	test('Should be return true when input not is Map', () => {
		expect(A.not(A.is.Map).fn(new Map())).toBe(false)
		expect(
			A.not(A.is.Map).fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBe(false)
		expect(A.not(A.is.Map).fn([])).toBe(true)
	})
})

describe.concurrent('A.is.Nullable', () => {
	test('Should be return true when input is null or undefined', () => {
		expect(A.is.Nullable.fn(null)).toBe(true)
		expect(A.is.Nullable.fn(undefined)).toBe(true)
		expect(A.is.Nullable.fn([])).toBe(false)
	})

	test('Should be return true when input not is null or undefined', () => {
		expect(A.not(A.is.Nullable).fn(null)).toBe(false)
		expect(A.not(A.is.Nullable).fn(undefined)).toBe(false)
		expect(A.not(A.is.Nullable).fn([])).toBe(true)
	})
})

describe.concurrent('A.is.Numeric', () => {
	test('Should return true when input is number or bigint', () => {
		expect(A.is.Numeric.fn(120)).toBe(true)
		expect(A.is.Numeric.fn(120n)).toBe(true)
		expect(A.is.Numeric.fn('120n')).toBe(false)
	})

	test('Should return true when input not is number or bigint', () => {
		expect(A.not(A.is.Numeric).fn(120)).toBe(false)
		expect(A.not(A.is.Numeric).fn(120n)).toBe(false)
		expect(A.not(A.is.Numeric).fn('120n')).toBe(true)
	})
})

describe.concurrent('A.is.Numeric.[gt, gte, lt, lte]', () => {
	test('Should return true when input is great than specific value', () => {
		expect(A.is.Numeric.gt(10).fn(12)).toBe(true)
		expect(A.is.Numeric.gt(10).fn(10)).toBe(false)
		expect(A.is.Numeric.gt(10).fn(8)).toBe(false)
		expect(A.is.Numeric.gt(10).fn('foo')).toBe(false)
	})

	test('Should return true when input not is great than specific value', () => {
		expect(A.not(A.is.Numeric.gt(10)).fn(12)).toBe(false)
		expect(A.not(A.is.Numeric.gt(10)).fn(10)).toBe(true)
		expect(A.not(A.is.Numeric.gt(10)).fn(8)).toBe(true)
		expect(A.not(A.is.Numeric.gt(10)).fn('foo')).toBe(true)
	})

	test('Should return true when input is great than or equal to specific value', () => {
		expect(A.is.Numeric.gte(10).fn(12)).toBe(true)
		expect(A.is.Numeric.gte(10).fn(10)).toBe(true)
		expect(A.is.Numeric.gte(10).fn(8)).toBe(false)
		expect(A.is.Numeric.gte(10).fn('foo')).toBe(false)
	})

	test('Should return true when input not is great than or equal to specific value', () => {
		expect(A.not(A.is.Numeric.gte(10)).fn(12)).toBe(false)
		expect(A.not(A.is.Numeric.gte(10)).fn(10)).toBe(false)
		expect(A.not(A.is.Numeric.gte(10)).fn(8)).toBe(true)
		expect(A.not(A.is.Numeric.gte(10)).fn('foo')).toBe(true)
	})

	test('Should return true when input is least than specific value', () => {
		expect(A.is.Numeric.lt(10).fn(12)).toBe(false)
		expect(A.is.Numeric.lt(10).fn(10)).toBe(false)
		expect(A.is.Numeric.lt(10).fn(8)).toBe(true)
		expect(A.is.Numeric.lt(10).fn('foo')).toBe(false)
	})

	test('Should return true when input not is least than specific value', () => {
		expect(A.not(A.is.Numeric.lt(10)).fn(12)).toBe(true)
		expect(A.not(A.is.Numeric.lt(10)).fn(10)).toBe(true)
		expect(A.not(A.is.Numeric.lt(10)).fn(8)).toBe(false)
		expect(A.not(A.is.Numeric.lt(10)).fn('foo')).toBe(true)
	})

	test('Should return true when input is least than or equal to specific value', () => {
		expect(A.is.Numeric.lte(10).fn(12)).toBe(false)
		expect(A.is.Numeric.lte(10).fn(10)).toBe(true)
		expect(A.is.Numeric.lte(10).fn(8)).toBe(true)
		expect(A.is.Numeric.lte(10).fn('foo')).toBe(false)
	})

	test('Should return true when input not is least than or equal to specific value', () => {
		expect(A.not(A.is.Numeric.lte(10)).fn(12)).toBe(true)
		expect(A.not(A.is.Numeric.lte(10)).fn(10)).toBe(false)
		expect(A.not(A.is.Numeric.lte(10)).fn(8)).toBe(false)
		expect(A.not(A.is.Numeric.lte(10)).fn('foo')).toBe(true)
	})
})

describe.concurrent('A.is.Numeric.inRange', () => {
	test('Should return true when input is in the range', () => {
		expect(A.is.Numeric.inRange(5, 10).fn(5)).toBe(true)
		expect(A.is.Numeric.inRange(5, 10).fn(7)).toBe(true)
		expect(A.is.Numeric.inRange(5, 10).fn(10)).toBe(true)
		expect(A.is.Numeric.inRange(5, 10).fn(2)).toBe(false)
		expect(A.is.Numeric.inRange(5, 10).fn(12)).toBe(false)
		expect(A.is.Numeric.inRange(5, 10).fn('foo')).toBe(false)
	})
	test('Should return true when input not in the range', () => {
		expect(A.not(A.is.Numeric.inRange(5, 10)).fn(5)).toBe(false)
		expect(A.not(A.is.Numeric.inRange(5, 10)).fn(7)).toBe(false)
		expect(A.not(A.is.Numeric.inRange(5, 10)).fn(10)).toBe(false)
		expect(A.not(A.is.Numeric.inRange(5, 10)).fn(2)).toBe(true)
		expect(A.not(A.is.Numeric.inRange(5, 10)).fn(12)).toBe(true)
		expect(A.not(A.is.Numeric.inRange(5, 10)).fn('foo')).toBe(true)
	})
})

describe.concurrent('A.is.Object', () => {
	test('Should return true when input is object', () => {
		expect(A.is.Object.fn([])).toBe(true)
		expect(A.is.Object.fn({})).toBe(true)
		expect(A.is.Object.fn('foo')).toBe(false)
		expect(A.is.Object.fn(120)).toBe(false)
	})

	test('Should return true when input not is object', () => {
		expect(A.not(A.is.Object).fn([])).toBe(false)
		expect(A.not(A.is.Object).fn({})).toBe(false)
		expect(A.not(A.is.Object).fn('foo')).toBe(true)
		expect(A.not(A.is.Object).fn(120)).toBe(true)
	})
})

describe.concurrent('A.is.Object.equalTo', () => {
	test('Should return true when input matches the object structure', () => {
		expect(A.is.Object.equalTo({ foo: A.is.Any }).fn({ foo: true })).toBe(true)
		expect(A.is.Object.equalTo({ foo: A.is.Any }).fn({ foo: 120 })).toBe(true)
		expect(A.is.Object.equalTo({ foo: A.is.Any }).fn({ foo: 'foo' })).toBe(true)
		expect(A.is.Object.equalTo({ foo: A.is.Any }).fn({ bar: 'bar' })).toBe(false)
		expect(A.is.Object.equalTo({ foo: A.is.Any }).fn({ bar: 'bar', foo: 'foo' })).toBe(false)
		expect(A.is.Object.equalTo({ foo: A.is.Any }).fn({})).toBe(false)
	})

	test('Should return true when input does not matches the object structure', () => {
		expect(A.not(A.is.Object.equalTo({ foo: A.is.Any })).fn({ foo: true })).toBe(false)
		expect(A.not(A.is.Object.equalTo({ foo: A.is.Any })).fn({ foo: 120 })).toBe(false)
		expect(A.not(A.is.Object.equalTo({ foo: A.is.Any })).fn({ foo: 'foo' })).toBe(false)
		expect(A.not(A.is.Object.equalTo({ foo: A.is.Any })).fn({ bar: 'bar' })).toBe(true)
		expect(A.not(A.is.Object.equalTo({ foo: A.is.Any })).fn({ bar: 'bar', foo: 'foo' })).toBe(true)
		expect(A.not(A.is.Object.equalTo({ foo: A.is.Any })).fn({})).toBe(true)
	})
})

describe.concurrent('A.is.Object.with', () => {
	test('Should return true when input property matches structure', () => {
		expect(A.is.Object.with('foo', A.typeOf('string')).fn({ foo: 'foo' })).toBe(true)
		expect(A.is.Object.with('foo', A.typeOf('string')).fn({ foo: 120 })).toBe(false)
		expect(A.is.Object.with('foo', A.typeOf('string')).fn({ bar: 'bar', foo: 'foo' })).toBe(true)
		expect(A.is.Object.with('foo', A.typeOf('string')).fn({})).toBe(false)
	})

	test('Should return true when input property does not mathces structure', () => {
		expect(A.not(A.is.Object.with('foo', A.typeOf('string'))).fn({ foo: 'foo' })).toBe(false)
		expect(A.not(A.is.Object.with('foo', A.typeOf('string'))).fn({ foo: 120 })).toBe(true)
		expect(A.not(A.is.Object.with('foo', A.typeOf('string'))).fn({ bar: 'bar', foo: 'foo' })).toBe(false)
		expect(A.not(A.is.Object.with('foo', A.typeOf('string'))).fn({})).toBe(true)
	})
})

describe.concurrent('A.is.Object.withKey', () => {
	test('Should return true when input contains key', () => {
		expect(A.is.Object.withKey('foo').fn({ foo: 120 })).toBe(true)
		expect(A.is.Object.withKey('foo').fn({ foo: 'foo' })).toBe(true)
		expect(A.is.Object.withKey('foo').fn({ bar: 'bar', foo: 'foo' })).toBe(true)
		expect(A.is.Object.withKey('foo').fn({ bar: 'bar' })).toBe(false)
		expect(A.is.Object.withKey('foo').fn({})).toBe(false)
	})

	test('Should return true when input contains all keys', () => {
		expect(A.is.Object.withKey('foo', 'bar').fn({ bar: 'bar', foo: 'foo' })).toBe(true)
		expect(A.is.Object.withKey('foo', 'bar').fn({ bar: 'bar' })).toBe(false)
		expect(A.is.Object.withKey('foo', 'bar').fn({ foo: 'foo' })).toBe(false)
		expect(A.is.Object.withKey('foo', 'bar', 'baz').fn({ bar: 'bar', baz: 'baz', foo: 'foo' })).toBe(true)
	})

	test('Should return true when input does not contains key', () => {
		expect(A.not(A.is.Object.withKey('foo')).fn({ foo: 120 })).toBe(false)
		expect(A.not(A.is.Object.withKey('foo')).fn({ foo: 'foo' })).toBe(false)
		expect(A.not(A.is.Object.withKey('foo')).fn({ bar: 'bar', foo: 'foo' })).toBe(false)
		expect(A.not(A.is.Object.withKey('foo')).fn({ bar: 'bar' })).toBe(true)
		expect(A.not(A.is.Object.withKey('foo')).fn({})).toBe(true)
	})

	test('Should return true when input contains all keys', () => {
		expect(A.not(A.is.Object.withKey('foo', 'bar')).fn({ bar: 'bar', foo: 'foo' })).toBe(false)
		expect(A.not(A.is.Object.withKey('foo', 'bar')).fn({ bar: 'bar' })).toBe(true)
		expect(A.not(A.is.Object.withKey('foo', 'bar')).fn({ foo: 'foo' })).toBe(true)
		expect(A.not(A.is.Object.withKey('foo', 'bar', 'baz')).fn({ bar: 'bar', baz: 'baz', foo: 'foo' })).toBe(false)
	})
})

describe.concurrent('A.is.PropertyKey', () => {
	test('Should return true when input is string, symbol or number', () => {
		expect(A.is.PropertyKey.fn('foo')).toBe(true)
		expect(A.is.PropertyKey.fn(120)).toBe(true)
		expect(A.is.PropertyKey.fn(Symbol('bar'))).toBe(true)
		expect(A.is.PropertyKey.fn(Symbol.toPrimitive)).toBe(true)
		expect(A.is.PropertyKey.fn(true)).toBe(false)
		expect(A.is.PropertyKey.fn(null)).toBe(false)
		expect(A.is.PropertyKey.fn({})).toBe(false)
	})

	test('Should return true when input not is string, symbol or number', () => {
		expect(A.not(A.is.PropertyKey).fn('foo')).toBe(false)
		expect(A.not(A.is.PropertyKey).fn(120)).toBe(false)
		expect(A.not(A.is.PropertyKey).fn(Symbol('bar'))).toBe(false)
		expect(A.not(A.is.PropertyKey).fn(Symbol.toPrimitive)).toBe(false)
		expect(A.not(A.is.PropertyKey).fn(true)).toBe(true)
		expect(A.not(A.is.PropertyKey).fn(null)).toBe(true)
		expect(A.not(A.is.PropertyKey).fn({})).toBe(true)
	})
})

describe.concurrent('A.is.Set', () => {
	test('Should return true when input is Set', () => {
		expect(A.is.Set.fn('foo')).toBe(false)
		expect(A.is.Set.fn(120)).toBe(false)
		expect(A.is.Set.fn(new Map())).toBe(false)
		expect(A.is.Set.fn(new Set())).toBe(true)
		expect(A.is.Set.fn(new Set([1, 2]))).toBe(true)
		expect(A.is.Set.fn([])).toBe(false)
	})

	test('Should return true when input not is Set', () => {
		expect(A.not(A.is.Set).fn('foo')).toBe(true)
		expect(A.not(A.is.Set).fn(120)).toBe(true)
		expect(A.not(A.is.Set).fn(new Map())).toBe(true)
		expect(A.not(A.is.Set).fn(new Set())).toBe(false)
		expect(A.not(A.is.Set).fn(new Set([1, 2]))).toBe(false)
		expect(A.not(A.is.Set).fn([])).toBe(true)
	})
})

describe.concurrent('A.is.SetLike', () => {
	test('Should return true when input is Set or Map', () => {
		expect(A.is.SetLike.fn('foo')).toBe(false)
		expect(A.is.SetLike.fn(120)).toBe(false)
		expect(A.is.SetLike.fn(new Map())).toBe(true)
		expect(
			A.is.SetLike.fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBe(true)
		expect(A.is.SetLike.fn(new Set())).toBe(true)
		expect(A.is.SetLike.fn(new Set([1, 2]))).toBe(true)
		expect(A.is.SetLike.fn([])).toBe(false)
	})

	test('Should return true when input not is Set or Map', () => {
		expect(A.not(A.is.SetLike).fn('foo')).toBe(true)
		expect(A.not(A.is.SetLike).fn(120)).toBe(true)
		expect(A.not(A.is.SetLike).fn(new Map())).toBe(false)
		expect(
			A.not(A.is.SetLike).fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBe(false)
		expect(A.not(A.is.SetLike).fn(new Set())).toBe(false)
		expect(A.not(A.is.SetLike).fn(new Set([1, 2]))).toBe(false)
		expect(A.not(A.is.SetLike).fn([])).toBe(true)
	})
})
