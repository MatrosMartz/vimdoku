import { describe, expect, test } from 'vitest'

import * as A from './commons.util'
import { is } from './is.util'

/* eslint-disable @typescript-eslint/no-extraneous-class */
class Foo {}
class Bar {}
/* eslint-enable @typescript-eslint/no-extraneous-class */

describe.concurrent('A.is', () => {
	test('Should return true when input instance of Object', () => {
		expect(is(Object).fn({})).toBe(true)
		expect(is(Object).fn([])).toBe(true)
		expect(is(Object).fn(new Foo())).toBe(true)
		expect(is(Object).fn(null)).toBe(false)
	})

	test('Should return true when input instance of the single specified class', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(is(Foo).fn(foo)).toBe(true)
		expect(is(Foo).fn(bar)).toBe(false)
	})

	test('Should return true when input instance any of the single specified classes', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(is(Foo, Bar).fn(foo)).toBe(true)
		expect(is(Foo, Bar).fn(bar)).toBe(true)
		expect(is(Foo, Bar).fn({})).toBe(false)
	})

	test('Should return true when input does not instance the specified class', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(A.not(is(Foo)).fn(foo)).toBe(false)
		expect(A.not(is(Foo)).fn(bar)).toBe(true)
	})
})

describe.concurrent('A.is.Any', () => {
	test('Should return true when any input', () => {
		expect(is.Any.fn(null)).toBe(true)
		expect(is.Any.fn('foo')).toBe(true)
		expect(is.Any.fn(120)).toBe(true)
		expect(is.Any.fn(Symbol('bar'))).toBe(true)
		expect(is.Any.fn(false)).toBe(true)
		expect(is.Any.fn(Foo)).toBe(true)
		expect(is.Any.fn(new Bar())).toBe(true)
		expect(is.Any.fn([])).toBe(true)
	})
})

describe.concurrent('A.is.Array', () => {
	test('Should return true when input is array', () => {
		expect(is.Array.fn([])).toBe(true)
		expect(is.Array.fn([1, 2, 3])).toBe(true)
		expect(is.Array.fn(new Array(1))).toBe(true)
		expect(is.Array.fn({})).toBe(false)
		expect(is.Array.fn('foo')).toBe(false)
	})

	test('Should be return true when input not is array', () => {
		expect(A.not(is.Array).fn([])).toBe(false)
		expect(A.not(is.Array).fn([1, 2, 3])).toBe(false)
		expect(A.not(is.Array).fn(new Array(1))).toBe(false)
		expect(A.not(is.Array).fn({})).toBe(true)
		expect(A.not(is.Array).fn('foo')).toBe(true)
	})
})

describe.concurrent('A.is.Array.equalTo', () => {
	test('Should be return true when input matches the array structure', () => {
		expect(is.Array.equalTo([A.typeOf('string')]).fn(['foo'])).toBe(true)
		expect(is.Array.equalTo([is.String.match(/^bar$/)]).fn(['bar'])).toBe(true)
		expect(is.Array.equalTo([A.typeOf('string')]).fn([])).toBe(false)
		expect(is.Array.equalTo([A.typeOf('string')]).fn(['foo', 'bar'])).toBe(false)
		expect(is.Array.equalTo([A.typeOf('string')]).fn([120])).toBe(false)
	})

	test('Should be return true when input matches some array structure', () => {
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn(['foo'])).toBe(true)
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn(['bar', 'baz'])).toBe(true)
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn(['bar'])).toBe(false)
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn(['foo', 'bar'])).toBe(false)
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn([''])).toBe(false)
	})

	test('Should be return true when input does not matches the array structure', () => {
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn(['foo'])).toBe(false)
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn(['bar'])).toBe(false)
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn([])).toBe(true)
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn(['foo', 'bar'])).toBe(true)
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn([120])).toBe(true)
	})
})

describe.concurrent('A.is.Array.with', () => {
	test('Should be return true when item of input matches the structure', () => {
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar'])).toBe(true)
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar', 'baz'])).toBe(true)
		expect(is.Array.with(1, A.typeOf('string')).fn([120, 'foo'])).toBe(true)
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar', true])).toBe(true)
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', 120, true])).toBe(false)
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', true, 'bar'])).toBe(false)
	})

	test('Should be return true when item of input does not matches the structure', () => {
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar'])).toBe(false)
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar', 'baz'])).toBe(false)
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn([120, 'foo'])).toBe(false)
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar', true])).toBe(false)
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', 120, true])).toBe(true)
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', true, 'bar'])).toBe(true)
	})
})

describe.concurrent('A.is.Map', () => {
	test('Should be return true when input is Map', () => {
		expect(is.Map.fn(new Map())).toBe(true)
		expect(
			is.Map.fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBe(true)
		expect(is.Map.fn([])).toBe(false)
	})

	test('Should be return true when input not is Map', () => {
		expect(A.not(is.Map).fn(new Map())).toBe(false)
		expect(
			A.not(is.Map).fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBe(false)
		expect(A.not(is.Map).fn([])).toBe(true)
	})
})

describe.concurrent('A.is.Nullable', () => {
	test('Should be return true when input is null or undefined', () => {
		expect(is.Nullable.fn(null)).toBe(true)
		expect(is.Nullable.fn(undefined)).toBe(true)
		expect(is.Nullable.fn([])).toBe(false)
	})

	test('Should be return true when input not is null or undefined', () => {
		expect(A.not(is.Nullable).fn(null)).toBe(false)
		expect(A.not(is.Nullable).fn(undefined)).toBe(false)
		expect(A.not(is.Nullable).fn([])).toBe(true)
	})
})

describe.concurrent('A.is.Numeric', () => {
	test('Should return true when input is number or bigint', () => {
		expect(is.Numeric.fn(120)).toBe(true)
		expect(is.Numeric.fn(120n)).toBe(true)
		expect(is.Numeric.fn('120n')).toBe(false)
	})

	test('Should return true when input not is number or bigint', () => {
		expect(A.not(is.Numeric).fn(120)).toBe(false)
		expect(A.not(is.Numeric).fn(120n)).toBe(false)
		expect(A.not(is.Numeric).fn('120n')).toBe(true)
	})
})

describe.concurrent('A.is.Numeric.[gt, gte, lt, lte]', () => {
	test('Should return true when input is great than specific value', () => {
		expect(is.Numeric.gt(10).fn(12)).toBe(true)
		expect(is.Numeric.gt(10).fn(10)).toBe(false)
		expect(is.Numeric.gt(10).fn(8)).toBe(false)
		expect(is.Numeric.gt(10).fn('foo')).toBe(false)
	})

	test('Should return true when input not is great than specific value', () => {
		expect(A.not(is.Numeric.gt(10)).fn(12)).toBe(false)
		expect(A.not(is.Numeric.gt(10)).fn(10)).toBe(true)
		expect(A.not(is.Numeric.gt(10)).fn(8)).toBe(true)
		expect(A.not(is.Numeric.gt(10)).fn('foo')).toBe(true)
	})

	test('Should return true when input is great than or equal to specific value', () => {
		expect(is.Numeric.gte(10).fn(12)).toBe(true)
		expect(is.Numeric.gte(10).fn(10)).toBe(true)
		expect(is.Numeric.gte(10).fn(8)).toBe(false)
		expect(is.Numeric.gte(10).fn('foo')).toBe(false)
	})

	test('Should return true when input not is great than or equal to specific value', () => {
		expect(A.not(is.Numeric.gte(10)).fn(12)).toBe(false)
		expect(A.not(is.Numeric.gte(10)).fn(10)).toBe(false)
		expect(A.not(is.Numeric.gte(10)).fn(8)).toBe(true)
		expect(A.not(is.Numeric.gte(10)).fn('foo')).toBe(true)
	})

	test('Should return true when input is least than specific value', () => {
		expect(is.Numeric.lt(10).fn(12)).toBe(false)
		expect(is.Numeric.lt(10).fn(10)).toBe(false)
		expect(is.Numeric.lt(10).fn(8)).toBe(true)
		expect(is.Numeric.lt(10).fn('foo')).toBe(false)
	})

	test('Should return true when input not is least than specific value', () => {
		expect(A.not(is.Numeric.lt(10)).fn(12)).toBe(true)
		expect(A.not(is.Numeric.lt(10)).fn(10)).toBe(true)
		expect(A.not(is.Numeric.lt(10)).fn(8)).toBe(false)
		expect(A.not(is.Numeric.lt(10)).fn('foo')).toBe(true)
	})

	test('Should return true when input is least than or equal to specific value', () => {
		expect(is.Numeric.lte(10).fn(12)).toBe(false)
		expect(is.Numeric.lte(10).fn(10)).toBe(true)
		expect(is.Numeric.lte(10).fn(8)).toBe(true)
		expect(is.Numeric.lte(10).fn('foo')).toBe(false)
	})

	test('Should return true when input not is least than or equal to specific value', () => {
		expect(A.not(is.Numeric.lte(10)).fn(12)).toBe(true)
		expect(A.not(is.Numeric.lte(10)).fn(10)).toBe(false)
		expect(A.not(is.Numeric.lte(10)).fn(8)).toBe(false)
		expect(A.not(is.Numeric.lte(10)).fn('foo')).toBe(true)
	})
})

describe.concurrent('A.is.Numeric.inRange', () => {
	test('Should return true when input is in the range', () => {
		expect(is.Numeric.inRange(5, 10).fn(5)).toBe(true)
		expect(is.Numeric.inRange(5, 10).fn(7)).toBe(true)
		expect(is.Numeric.inRange(5, 10).fn(10)).toBe(true)
		expect(is.Numeric.inRange(5, 10).fn(2)).toBe(false)
		expect(is.Numeric.inRange(5, 10).fn(12)).toBe(false)
		expect(is.Numeric.inRange(5, 10).fn('foo')).toBe(false)
	})
	test('Should return true when input not in the range', () => {
		expect(A.not(is.Numeric.inRange(5, 10)).fn(5)).toBe(false)
		expect(A.not(is.Numeric.inRange(5, 10)).fn(7)).toBe(false)
		expect(A.not(is.Numeric.inRange(5, 10)).fn(10)).toBe(false)
		expect(A.not(is.Numeric.inRange(5, 10)).fn(2)).toBe(true)
		expect(A.not(is.Numeric.inRange(5, 10)).fn(12)).toBe(true)
		expect(A.not(is.Numeric.inRange(5, 10)).fn('foo')).toBe(true)
	})
})

describe.concurrent('A.is.Object', () => {
	test('Should return true when input is object', () => {
		expect(is.Object.fn([])).toBe(true)
		expect(is.Object.fn({})).toBe(true)
		expect(is.Object.fn('foo')).toBe(false)
		expect(is.Object.fn(120)).toBe(false)
	})

	test('Should return true when input not is object', () => {
		expect(A.not(is.Object).fn([])).toBe(false)
		expect(A.not(is.Object).fn({})).toBe(false)
		expect(A.not(is.Object).fn('foo')).toBe(true)
		expect(A.not(is.Object).fn(120)).toBe(true)
	})
})

describe.concurrent('A.is.Object.equalTo', () => {
	test('Should return true when input matches the object structure', () => {
		expect(is.Object.equalTo({ foo: is.Any }).fn({ foo: true })).toBe(true)
		expect(is.Object.equalTo({ foo: is.Any }).fn({ foo: 120 })).toBe(true)
		expect(is.Object.equalTo({ foo: is.Any }).fn({ foo: 'foo' })).toBe(true)
		expect(is.Object.equalTo({ foo: is.Any }).fn({ bar: 'bar' })).toBe(false)
		expect(is.Object.equalTo({ foo: is.Any }).fn({ bar: 'bar', foo: 'foo' })).toBe(false)
		expect(is.Object.equalTo({ foo: is.Any }).fn({})).toBe(false)
	})

	test('Should return true when input matches some object structure', () => {
		expect(
			is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({ foo: 'foo' })
		).toBe(true)
		expect(
			is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({ bar: 'bar', baz: 120 })
		).toBe(true)
		expect(
			is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({ bar: 'foo', baz: 120 })
		).toBe(false)
		expect(
			is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({
				foo: 'foo',
				bar: 'bar',
				baz: 120,
			})
		).toBe(false)
		expect(is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({ foo: '' })).toBe(
			false
		)
	})

	test('Should return true when input does not matches the object structure', () => {
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ foo: true })).toBe(false)
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ foo: 120 })).toBe(false)
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ foo: 'foo' })).toBe(false)
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ bar: 'bar' })).toBe(true)
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ bar: 'bar', foo: 'foo' })).toBe(true)
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({})).toBe(true)
	})
})

describe.concurrent('A.is.Object.with', () => {
	test('Should return true when input property matches structure', () => {
		expect(is.Object.with('foo', A.typeOf('string')).fn({ foo: 'foo' })).toBe(true)
		expect(is.Object.with('foo', A.typeOf('string')).fn({ foo: 120 })).toBe(false)
		expect(is.Object.with('foo', A.typeOf('string')).fn({ bar: 'bar', foo: 'foo' })).toBe(true)
		expect(is.Object.with('foo', A.typeOf('string')).fn({})).toBe(false)
	})

	test('Should return true when input property does not mathces structure', () => {
		expect(A.not(is.Object.with('foo', A.typeOf('string'))).fn({ foo: 'foo' })).toBe(false)
		expect(A.not(is.Object.with('foo', A.typeOf('string'))).fn({ foo: 120 })).toBe(true)
		expect(A.not(is.Object.with('foo', A.typeOf('string'))).fn({ bar: 'bar', foo: 'foo' })).toBe(false)
		expect(A.not(is.Object.with('foo', A.typeOf('string'))).fn({})).toBe(true)
	})
})

describe.concurrent('A.is.Object.withKey', () => {
	test('Should return true when input contains key', () => {
		expect(is.Object.withKey('foo').fn({ foo: 120 })).toBe(true)
		expect(is.Object.withKey('foo').fn({ foo: 'foo' })).toBe(true)
		expect(is.Object.withKey('foo').fn({ bar: 'bar', foo: 'foo' })).toBe(true)
		expect(is.Object.withKey('foo').fn({ bar: 'bar' })).toBe(false)
		expect(is.Object.withKey('foo').fn({})).toBe(false)
	})

	test('Should return true when input contains all keys', () => {
		expect(is.Object.withKey('foo', 'bar').fn({ bar: 'bar', foo: 'foo' })).toBe(true)
		expect(is.Object.withKey('foo', 'bar').fn({ bar: 'bar' })).toBe(false)
		expect(is.Object.withKey('foo', 'bar').fn({ foo: 'foo' })).toBe(false)
		expect(is.Object.withKey('foo', 'bar', 'baz').fn({ bar: 'bar', baz: 'baz', foo: 'foo' })).toBe(true)
	})

	test('Should return true when input does not contains key', () => {
		expect(A.not(is.Object.withKey('foo')).fn({ foo: 120 })).toBe(false)
		expect(A.not(is.Object.withKey('foo')).fn({ foo: 'foo' })).toBe(false)
		expect(A.not(is.Object.withKey('foo')).fn({ bar: 'bar', foo: 'foo' })).toBe(false)
		expect(A.not(is.Object.withKey('foo')).fn({ bar: 'bar' })).toBe(true)
		expect(A.not(is.Object.withKey('foo')).fn({})).toBe(true)
	})

	test('Should return true when input contains all keys', () => {
		expect(A.not(is.Object.withKey('foo', 'bar')).fn({ bar: 'bar', foo: 'foo' })).toBe(false)
		expect(A.not(is.Object.withKey('foo', 'bar')).fn({ bar: 'bar' })).toBe(true)
		expect(A.not(is.Object.withKey('foo', 'bar')).fn({ foo: 'foo' })).toBe(true)
		expect(A.not(is.Object.withKey('foo', 'bar', 'baz')).fn({ bar: 'bar', baz: 'baz', foo: 'foo' })).toBe(false)
	})
})

describe.concurrent('A.is.PropertyKey', () => {
	test('Should return true when input is string, symbol or number', () => {
		expect(is.PropertyKey.fn('foo')).toBe(true)
		expect(is.PropertyKey.fn(120)).toBe(true)
		expect(is.PropertyKey.fn(Symbol('bar'))).toBe(true)
		expect(is.PropertyKey.fn(Symbol.toPrimitive)).toBe(true)
		expect(is.PropertyKey.fn(true)).toBe(false)
		expect(is.PropertyKey.fn(null)).toBe(false)
		expect(is.PropertyKey.fn({})).toBe(false)
	})

	test('Should return true when input not is string, symbol or number', () => {
		expect(A.not(is.PropertyKey).fn('foo')).toBe(false)
		expect(A.not(is.PropertyKey).fn(120)).toBe(false)
		expect(A.not(is.PropertyKey).fn(Symbol('bar'))).toBe(false)
		expect(A.not(is.PropertyKey).fn(Symbol.toPrimitive)).toBe(false)
		expect(A.not(is.PropertyKey).fn(true)).toBe(true)
		expect(A.not(is.PropertyKey).fn(null)).toBe(true)
		expect(A.not(is.PropertyKey).fn({})).toBe(true)
	})
})

describe.concurrent('A.is.Set', () => {
	test('Should return true when input is Set', () => {
		expect(is.Set.fn('foo')).toBe(false)
		expect(is.Set.fn(120)).toBe(false)
		expect(is.Set.fn(new Map())).toBe(false)
		expect(is.Set.fn(new Set())).toBe(true)
		expect(is.Set.fn(new Set([1, 2]))).toBe(true)
		expect(is.Set.fn([])).toBe(false)
	})

	test('Should return true when input not is Set', () => {
		expect(A.not(is.Set).fn('foo')).toBe(true)
		expect(A.not(is.Set).fn(120)).toBe(true)
		expect(A.not(is.Set).fn(new Map())).toBe(true)
		expect(A.not(is.Set).fn(new Set())).toBe(false)
		expect(A.not(is.Set).fn(new Set([1, 2]))).toBe(false)
		expect(A.not(is.Set).fn([])).toBe(true)
	})
})

describe.concurrent('A.is.SetLike', () => {
	test('Should return true when input is Set or Map', () => {
		expect(is.SetLike.fn('foo')).toBe(false)
		expect(is.SetLike.fn(120)).toBe(false)
		expect(is.SetLike.fn(new Map())).toBe(true)
		expect(
			is.SetLike.fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBe(true)
		expect(is.SetLike.fn(new Set())).toBe(true)
		expect(is.SetLike.fn(new Set([1, 2]))).toBe(true)
		expect(is.SetLike.fn([])).toBe(false)
	})

	test('Should return true when input not is Set or Map', () => {
		expect(A.not(is.SetLike).fn('foo')).toBe(true)
		expect(A.not(is.SetLike).fn(120)).toBe(true)
		expect(A.not(is.SetLike).fn(new Map())).toBe(false)
		expect(
			A.not(is.SetLike).fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBe(false)
		expect(A.not(is.SetLike).fn(new Set())).toBe(false)
		expect(A.not(is.SetLike).fn(new Set([1, 2]))).toBe(false)
		expect(A.not(is.SetLike).fn([])).toBe(true)
	})
})

describe.concurrent('A.is.String.endWith', () => {
	test('Should return true when input ending with "foo"', () => {
		expect(is.String.endWith('foo').fn('foo')).toBe(true)
		expect(is.String.endWith('foo').fn('bar-foo')).toBe(true)
		expect(is.String.endWith('foo').fn('bar')).toBe(false)
		expect(is.String.endWith('foo').fn('foo  ')).toBe(false)
	})

	test('Should return true when input not ending with "foo"', () => {
		expect(A.not(is.String.endWith('foo')).fn('foo')).toBe(false)
		expect(A.not(is.String.endWith('foo')).fn('bar-foo')).toBe(false)
		expect(A.not(is.String.endWith('foo')).fn('bar')).toBe(true)
		expect(A.not(is.String.endWith('foo')).fn('foo  ')).toBe(true)
	})
})

describe.concurrent('A.is.String.match', () => {
	test('Should return true when input matches the specified regex', () => {
		expect(is.String.match(/^<[^<>]+>$/i).fn('<foo>')).toBe(true)
		expect(is.String.match(/^<[^<>]+>$/i).fn('foo')).toBe(false)
	})

	test('Should return true when input not matches the specified regex', () => {
		expect(A.not(is.String.match(/^<[^<>]+>$/i)).fn('<foo>')).toBe(false)
		expect(A.not(is.String.match(/^<[^<>]+>$/i)).fn('foo')).toBe(true)
	})
})

describe.concurrent('A.is.String.startWith', () => {
	test('Should return true when input starting with "foo"', () => {
		expect(is.String.startWith('foo').fn('foo')).toBe(true)
		expect(is.String.startWith('foo').fn('foo-bar')).toBe(true)
		expect(is.String.startWith('foo').fn('bar')).toBe(false)
		expect(is.String.startWith('foo').fn('  foo')).toBe(false)
	})

	test('Should return true when input not starting with "foo"', () => {
		expect(A.not(is.String.startWith('foo')).fn('foo')).toBe(false)
		expect(A.not(is.String.startWith('foo')).fn('foo-bar')).toBe(false)
		expect(A.not(is.String.startWith('foo')).fn('bar')).toBe(true)
		expect(A.not(is.String.startWith('foo')).fn('  foo')).toBe(true)
	})
})
