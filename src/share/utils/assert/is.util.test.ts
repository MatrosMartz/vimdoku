import { describe, expect, test } from 'vitest'

import * as A from './commons.util'
import { is } from './is.util'

/* eslint-disable @typescript-eslint/no-extraneous-class */
class Foo {}
class Bar {}
/* eslint-enable @typescript-eslint/no-extraneous-class */

describe.concurrent('A.is', () => {
	test('Should return true when input instance of Object', () => {
		expect(is(Object).fn({})).toBeTrue()
		expect(is(Object).fn([])).toBeTrue()
		expect(is(Object).fn(new Foo())).toBeTrue()
		expect(is(Object).fn(null)).toBeFalse()
	})

	test('Should return true when input instance of the single specified class', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(is(Foo).fn(foo)).toBeTrue()
		expect(is(Foo).fn(bar)).toBeFalse()
	})

	test('Should return true when input instance any of the single specified classes', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(is(Foo, Bar).fn(foo)).toBeTrue()
		expect(is(Foo, Bar).fn(bar)).toBeTrue()
		expect(is(Foo, Bar).fn({})).toBeFalse()
	})

	test('Should return true when input does not instance the specified class', () => {
		const foo = new Foo()
		const bar = new Bar()

		expect(A.not(is(Foo)).fn(foo)).toBeFalse()
		expect(A.not(is(Foo)).fn(bar)).toBeTrue()
	})
})

describe.concurrent('A.is.Any', () => {
	test('Should return true when any input', () => {
		expect(is.Any.fn(null)).toBeTrue()
		expect(is.Any.fn('foo')).toBeTrue()
		expect(is.Any.fn(120)).toBeTrue()
		expect(is.Any.fn(Symbol('bar'))).toBeTrue()
		expect(is.Any.fn(false)).toBeTrue()
		expect(is.Any.fn(Foo)).toBeTrue()
		expect(is.Any.fn(new Bar())).toBeTrue()
		expect(is.Any.fn([])).toBeTrue()
	})
})

describe.concurrent('A.is.Array', () => {
	test('Should return true when input is array', () => {
		expect(is.Array.fn([])).toBeTrue()
		expect(is.Array.fn([1, 2, 3])).toBeTrue()
		expect(is.Array.fn(new Array(1))).toBeTrue()
		expect(is.Array.fn({})).toBeFalse()
		expect(is.Array.fn('foo')).toBeFalse()
	})

	test('Should be return true when input not is array', () => {
		expect(A.not(is.Array).fn([])).toBeFalse()
		expect(A.not(is.Array).fn([1, 2, 3])).toBeFalse()
		expect(A.not(is.Array).fn(new Array(1))).toBeFalse()
		expect(A.not(is.Array).fn({})).toBeTrue()
		expect(A.not(is.Array).fn('foo')).toBeTrue()
	})
})

describe.concurrent('A.is.Array.equalTo', () => {
	test('Should be return true when input matches the array structure', () => {
		expect(is.Array.equalTo([A.typeOf('string')]).fn(['foo'])).toBeTrue()
		expect(is.Array.equalTo([is.String.match(/^bar$/)]).fn(['bar'])).toBeTrue()
		expect(is.Array.equalTo([A.typeOf('string')]).fn([])).toBeFalse()
		expect(is.Array.equalTo([A.typeOf('string')]).fn(['foo', 'bar'])).toBeFalse()
		expect(is.Array.equalTo([A.typeOf('string')]).fn([120])).toBeFalse()
	})

	test('Should be return true when input matches some array structure', () => {
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn(['foo'])).toBeTrue()
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn(['bar', 'baz'])).toBeTrue()
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn(['bar'])).toBeFalse()
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn(['foo', 'bar'])).toBeFalse()
		expect(is.Array.equalTo([A.equalTo('foo')], [A.equalTo('bar'), is.Any]).fn([''])).toBeFalse()
	})

	test('Should be return true when input does not matches the array structure', () => {
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn(['foo'])).toBeFalse()
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn(['bar'])).toBeFalse()
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn([])).toBeTrue()
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn(['foo', 'bar'])).toBeTrue()
		expect(A.not(is.Array.equalTo([A.typeOf('string')])).fn([120])).toBeTrue()
	})
})

describe.concurrent('A.is.Array.with', () => {
	test('Should be return true when item of input matches the structure', () => {
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar'])).toBeTrue()
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar', 'baz'])).toBeTrue()
		expect(is.Array.with(1, A.typeOf('string')).fn([120, 'foo'])).toBeTrue()
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', 'bar', true])).toBeTrue()
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', 120, true])).toBeFalse()
		expect(is.Array.with(1, A.typeOf('string')).fn(['foo', true, 'bar'])).toBeFalse()
	})

	test('Should be return true when item of input does not matches the structure', () => {
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar'])).toBeFalse()
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar', 'baz'])).toBeFalse()
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn([120, 'foo'])).toBeFalse()
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', 'bar', true])).toBeFalse()
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', 120, true])).toBeTrue()
		expect(A.not(is.Array.with(1, A.typeOf('string'))).fn(['foo', true, 'bar'])).toBeTrue()
	})
})

describe.concurrent('A.is.Map', () => {
	test('Should be return true when input is Map', () => {
		expect(is.Map.fn(new Map())).toBeTrue()
		expect(
			is.Map.fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBeTrue()
		expect(is.Map.fn([])).toBeFalse()
	})

	test('Should be return true when input not is Map', () => {
		expect(A.not(is.Map).fn(new Map())).toBeFalse()
		expect(
			A.not(is.Map).fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBeFalse()
		expect(A.not(is.Map).fn([])).toBeTrue()
	})
})

describe.concurrent('A.is.Nullable', () => {
	test('Should be return true when input is null or undefined', () => {
		expect(is.Nullable.fn(null)).toBeTrue()
		expect(is.Nullable.fn(undefined)).toBeTrue()
		expect(is.Nullable.fn([])).toBeFalse()
	})

	test('Should be return true when input not is null or undefined', () => {
		expect(A.not(is.Nullable).fn(null)).toBeFalse()
		expect(A.not(is.Nullable).fn(undefined)).toBeFalse()
		expect(A.not(is.Nullable).fn([])).toBeTrue()
	})
})

describe.concurrent('A.is.Numeric', () => {
	test('Should return true when input is number or bigint', () => {
		expect(is.Numeric.fn(120)).toBeTrue()
		expect(is.Numeric.fn(120n)).toBeTrue()
		expect(is.Numeric.fn('120n')).toBeFalse()
	})

	test('Should return true when input not is number or bigint', () => {
		expect(A.not(is.Numeric).fn(120)).toBeFalse()
		expect(A.not(is.Numeric).fn(120n)).toBeFalse()
		expect(A.not(is.Numeric).fn('120n')).toBeTrue()
	})
})

describe.concurrent('A.is.Numeric.[gt, gte, lt, lte]', () => {
	test('Should return true when input is great than specific value', () => {
		expect(is.Numeric.gt(10).fn(12)).toBeTrue()
		expect(is.Numeric.gt(10).fn(10)).toBeFalse()
		expect(is.Numeric.gt(10).fn(8)).toBeFalse()
		expect(is.Numeric.gt(10).fn('foo')).toBeFalse()
	})

	test('Should return true when input not is great than specific value', () => {
		expect(A.not(is.Numeric.gt(10)).fn(12)).toBeFalse()
		expect(A.not(is.Numeric.gt(10)).fn(10)).toBeTrue()
		expect(A.not(is.Numeric.gt(10)).fn(8)).toBeTrue()
		expect(A.not(is.Numeric.gt(10)).fn('foo')).toBeTrue()
	})

	test('Should return true when input is great than or equal to specific value', () => {
		expect(is.Numeric.gte(10).fn(12)).toBeTrue()
		expect(is.Numeric.gte(10).fn(10)).toBeTrue()
		expect(is.Numeric.gte(10).fn(8)).toBeFalse()
		expect(is.Numeric.gte(10).fn('foo')).toBeFalse()
	})

	test('Should return true when input not is great than or equal to specific value', () => {
		expect(A.not(is.Numeric.gte(10)).fn(12)).toBeFalse()
		expect(A.not(is.Numeric.gte(10)).fn(10)).toBeFalse()
		expect(A.not(is.Numeric.gte(10)).fn(8)).toBeTrue()
		expect(A.not(is.Numeric.gte(10)).fn('foo')).toBeTrue()
	})

	test('Should return true when input is least than specific value', () => {
		expect(is.Numeric.lt(10).fn(12)).toBeFalse()
		expect(is.Numeric.lt(10).fn(10)).toBeFalse()
		expect(is.Numeric.lt(10).fn(8)).toBeTrue()
		expect(is.Numeric.lt(10).fn('foo')).toBeFalse()
	})

	test('Should return true when input not is least than specific value', () => {
		expect(A.not(is.Numeric.lt(10)).fn(12)).toBeTrue()
		expect(A.not(is.Numeric.lt(10)).fn(10)).toBeTrue()
		expect(A.not(is.Numeric.lt(10)).fn(8)).toBeFalse()
		expect(A.not(is.Numeric.lt(10)).fn('foo')).toBeTrue()
	})

	test('Should return true when input is least than or equal to specific value', () => {
		expect(is.Numeric.lte(10).fn(12)).toBeFalse()
		expect(is.Numeric.lte(10).fn(10)).toBeTrue()
		expect(is.Numeric.lte(10).fn(8)).toBeTrue()
		expect(is.Numeric.lte(10).fn('foo')).toBeFalse()
	})

	test('Should return true when input not is least than or equal to specific value', () => {
		expect(A.not(is.Numeric.lte(10)).fn(12)).toBeTrue()
		expect(A.not(is.Numeric.lte(10)).fn(10)).toBeFalse()
		expect(A.not(is.Numeric.lte(10)).fn(8)).toBeFalse()
		expect(A.not(is.Numeric.lte(10)).fn('foo')).toBeTrue()
	})
})

describe.concurrent('A.is.Numeric.inRange', () => {
	test('Should return true when input is in the range', () => {
		expect(is.Numeric.inRange(5, 10).fn(5)).toBeTrue()
		expect(is.Numeric.inRange(5, 10).fn(7)).toBeTrue()
		expect(is.Numeric.inRange(5, 10).fn(10)).toBeTrue()
		expect(is.Numeric.inRange(5, 10).fn(2)).toBeFalse()
		expect(is.Numeric.inRange(5, 10).fn(12)).toBeFalse()
		expect(is.Numeric.inRange(5, 10).fn('foo')).toBeFalse()
	})
	test('Should return true when input not in the range', () => {
		expect(A.not(is.Numeric.inRange(5, 10)).fn(5)).toBeFalse()
		expect(A.not(is.Numeric.inRange(5, 10)).fn(7)).toBeFalse()
		expect(A.not(is.Numeric.inRange(5, 10)).fn(10)).toBeFalse()
		expect(A.not(is.Numeric.inRange(5, 10)).fn(2)).toBeTrue()
		expect(A.not(is.Numeric.inRange(5, 10)).fn(12)).toBeTrue()
		expect(A.not(is.Numeric.inRange(5, 10)).fn('foo')).toBeTrue()
	})
})

describe.concurrent('A.is.Object', () => {
	test('Should return true when input is object', () => {
		expect(is.Object.fn([])).toBeTrue()
		expect(is.Object.fn({})).toBeTrue()
		expect(is.Object.fn('foo')).toBeFalse()
		expect(is.Object.fn(120)).toBeFalse()
	})

	test('Should return true when input not is object', () => {
		expect(A.not(is.Object).fn([])).toBeFalse()
		expect(A.not(is.Object).fn({})).toBeFalse()
		expect(A.not(is.Object).fn('foo')).toBeTrue()
		expect(A.not(is.Object).fn(120)).toBeTrue()
	})
})

describe.concurrent('A.is.Object.equalTo', () => {
	test('Should return true when input matches the object structure', () => {
		expect(is.Object.equalTo({ foo: is.Any }).fn({ foo: true })).toBeTrue()
		expect(is.Object.equalTo({ foo: is.Any }).fn({ foo: 120 })).toBeTrue()
		expect(is.Object.equalTo({ foo: is.Any }).fn({ foo: 'foo' })).toBeTrue()
		expect(is.Object.equalTo({ foo: is.Any }).fn({ bar: 'bar' })).toBeFalse()
		expect(is.Object.equalTo({ foo: is.Any }).fn({ bar: 'bar', foo: 'foo' })).toBeFalse()
		expect(is.Object.equalTo({ foo: is.Any }).fn({})).toBeFalse()
	})

	test('Should return true when input matches some object structure', () => {
		expect(
			is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({ foo: 'foo' })
		).toBeTrue()
		expect(
			is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({ bar: 'bar', baz: 120 })
		).toBeTrue()
		expect(
			is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({ bar: 'foo', baz: 120 })
		).toBeFalse()
		expect(
			is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({
				foo: 'foo',
				bar: 'bar',
				baz: 120,
			})
		).toBeFalse()
		expect(is.Object.equalTo({ foo: A.equalTo('foo') }, { bar: A.equalTo('bar'), baz: is.Any }).fn({ foo: '' })).toBe(
			false
		)
	})

	test('Should return true when input does not matches the object structure', () => {
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ foo: true })).toBeFalse()
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ foo: 120 })).toBeFalse()
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ foo: 'foo' })).toBeFalse()
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ bar: 'bar' })).toBeTrue()
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({ bar: 'bar', foo: 'foo' })).toBeTrue()
		expect(A.not(is.Object.equalTo({ foo: is.Any })).fn({})).toBeTrue()
	})
})

describe.concurrent('A.is.Object.with', () => {
	test('Should return true when input property matches structure', () => {
		expect(is.Object.with('foo', A.typeOf('string')).fn({ foo: 'foo' })).toBeTrue()
		expect(is.Object.with('foo', A.typeOf('string')).fn({ foo: 120 })).toBeFalse()
		expect(is.Object.with('foo', A.typeOf('string')).fn({ bar: 'bar', foo: 'foo' })).toBeTrue()
		expect(is.Object.with('foo', A.typeOf('string')).fn({})).toBeFalse()
	})

	test('Should return true when input property does not mathces structure', () => {
		expect(A.not(is.Object.with('foo', A.typeOf('string'))).fn({ foo: 'foo' })).toBeFalse()
		expect(A.not(is.Object.with('foo', A.typeOf('string'))).fn({ foo: 120 })).toBeTrue()
		expect(A.not(is.Object.with('foo', A.typeOf('string'))).fn({ bar: 'bar', foo: 'foo' })).toBeFalse()
		expect(A.not(is.Object.with('foo', A.typeOf('string'))).fn({})).toBeTrue()
	})
})

describe.concurrent('A.is.Object.withKey', () => {
	test('Should return true when input contains key', () => {
		expect(is.Object.withKey('foo').fn({ foo: 120 })).toBeTrue()
		expect(is.Object.withKey('foo').fn({ foo: 'foo' })).toBeTrue()
		expect(is.Object.withKey('foo').fn({ bar: 'bar', foo: 'foo' })).toBeTrue()
		expect(is.Object.withKey('foo').fn({ bar: 'bar' })).toBeFalse()
		expect(is.Object.withKey('foo').fn({})).toBeFalse()
	})

	test('Should return true when input contains all keys', () => {
		expect(is.Object.withKey('foo', 'bar').fn({ bar: 'bar', foo: 'foo' })).toBeTrue()
		expect(is.Object.withKey('foo', 'bar').fn({ bar: 'bar' })).toBeFalse()
		expect(is.Object.withKey('foo', 'bar').fn({ foo: 'foo' })).toBeFalse()
		expect(is.Object.withKey('foo', 'bar', 'baz').fn({ bar: 'bar', baz: 'baz', foo: 'foo' })).toBeTrue()
	})

	test('Should return true when input does not contains key', () => {
		expect(A.not(is.Object.withKey('foo')).fn({ foo: 120 })).toBeFalse()
		expect(A.not(is.Object.withKey('foo')).fn({ foo: 'foo' })).toBeFalse()
		expect(A.not(is.Object.withKey('foo')).fn({ bar: 'bar', foo: 'foo' })).toBeFalse()
		expect(A.not(is.Object.withKey('foo')).fn({ bar: 'bar' })).toBeTrue()
		expect(A.not(is.Object.withKey('foo')).fn({})).toBeTrue()
	})

	test('Should return true when input contains all keys', () => {
		expect(A.not(is.Object.withKey('foo', 'bar')).fn({ bar: 'bar', foo: 'foo' })).toBeFalse()
		expect(A.not(is.Object.withKey('foo', 'bar')).fn({ bar: 'bar' })).toBeTrue()
		expect(A.not(is.Object.withKey('foo', 'bar')).fn({ foo: 'foo' })).toBeTrue()
		expect(A.not(is.Object.withKey('foo', 'bar', 'baz')).fn({ bar: 'bar', baz: 'baz', foo: 'foo' })).toBeFalse()
	})
})

describe.concurrent('A.is.PropertyKey', () => {
	test('Should return true when input is string, symbol or number', () => {
		expect(is.PropertyKey.fn('foo')).toBeTrue()
		expect(is.PropertyKey.fn(120)).toBeTrue()
		expect(is.PropertyKey.fn(Symbol('bar'))).toBeTrue()
		expect(is.PropertyKey.fn(Symbol.toPrimitive)).toBeTrue()
		expect(is.PropertyKey.fn(true)).toBeFalse()
		expect(is.PropertyKey.fn(null)).toBeFalse()
		expect(is.PropertyKey.fn({})).toBeFalse()
	})

	test('Should return true when input not is string, symbol or number', () => {
		expect(A.not(is.PropertyKey).fn('foo')).toBeFalse()
		expect(A.not(is.PropertyKey).fn(120)).toBeFalse()
		expect(A.not(is.PropertyKey).fn(Symbol('bar'))).toBeFalse()
		expect(A.not(is.PropertyKey).fn(Symbol.toPrimitive)).toBeFalse()
		expect(A.not(is.PropertyKey).fn(true)).toBeTrue()
		expect(A.not(is.PropertyKey).fn(null)).toBeTrue()
		expect(A.not(is.PropertyKey).fn({})).toBeTrue()
	})
})

describe.concurrent('A.is.Set', () => {
	test('Should return true when input is Set', () => {
		expect(is.Set.fn('foo')).toBeFalse()
		expect(is.Set.fn(120)).toBeFalse()
		expect(is.Set.fn(new Map())).toBeFalse()
		expect(is.Set.fn(new Set())).toBeTrue()
		expect(is.Set.fn(new Set([1, 2]))).toBeTrue()
		expect(is.Set.fn([])).toBeFalse()
	})

	test('Should return true when input not is Set', () => {
		expect(A.not(is.Set).fn('foo')).toBeTrue()
		expect(A.not(is.Set).fn(120)).toBeTrue()
		expect(A.not(is.Set).fn(new Map())).toBeTrue()
		expect(A.not(is.Set).fn(new Set())).toBeFalse()
		expect(A.not(is.Set).fn(new Set([1, 2]))).toBeFalse()
		expect(A.not(is.Set).fn([])).toBeTrue()
	})
})

describe.concurrent('A.is.SetLike', () => {
	test('Should return true when input is Set or Map', () => {
		expect(is.SetLike.fn('foo')).toBeFalse()
		expect(is.SetLike.fn(120)).toBeFalse()
		expect(is.SetLike.fn(new Map())).toBeTrue()
		expect(
			is.SetLike.fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBeTrue()
		expect(is.SetLike.fn(new Set())).toBeTrue()
		expect(is.SetLike.fn(new Set([1, 2]))).toBeTrue()
		expect(is.SetLike.fn([])).toBeFalse()
	})

	test('Should return true when input not is Set or Map', () => {
		expect(A.not(is.SetLike).fn('foo')).toBeTrue()
		expect(A.not(is.SetLike).fn(120)).toBeTrue()
		expect(A.not(is.SetLike).fn(new Map())).toBeFalse()
		expect(
			A.not(is.SetLike).fn(
				new Map([
					['foo', 1],
					['bar', 2],
				])
			)
		).toBeFalse()
		expect(A.not(is.SetLike).fn(new Set())).toBeFalse()
		expect(A.not(is.SetLike).fn(new Set([1, 2]))).toBeFalse()
		expect(A.not(is.SetLike).fn([])).toBeTrue()
	})
})

describe.concurrent('A.is.String.endWith', () => {
	test('Should return true when input ending with "foo"', () => {
		expect(is.String.endWith('foo').fn('foo')).toBeTrue()
		expect(is.String.endWith('foo').fn('bar-foo')).toBeTrue()
		expect(is.String.endWith('foo').fn('bar')).toBeFalse()
		expect(is.String.endWith('foo').fn('foo  ')).toBeFalse()
	})

	test('Should return true when input not ending with "foo"', () => {
		expect(A.not(is.String.endWith('foo')).fn('foo')).toBeFalse()
		expect(A.not(is.String.endWith('foo')).fn('bar-foo')).toBeFalse()
		expect(A.not(is.String.endWith('foo')).fn('bar')).toBeTrue()
		expect(A.not(is.String.endWith('foo')).fn('foo  ')).toBeTrue()
	})
})

describe.concurrent('A.is.String.match', () => {
	test('Should return true when input matches the specified regex', () => {
		expect(is.String.match(/^<[^<>]+>$/i).fn('<foo>')).toBeTrue()
		expect(is.String.match(/^<[^<>]+>$/i).fn('foo')).toBeFalse()
	})

	test('Should return true when input not matches the specified regex', () => {
		expect(A.not(is.String.match(/^<[^<>]+>$/i)).fn('<foo>')).toBeFalse()
		expect(A.not(is.String.match(/^<[^<>]+>$/i)).fn('foo')).toBeTrue()
	})
})

describe.concurrent('A.is.String.startWith', () => {
	test('Should return true when input starting with "foo"', () => {
		expect(is.String.startWith('foo').fn('foo')).toBeTrue()
		expect(is.String.startWith('foo').fn('foo-bar')).toBeTrue()
		expect(is.String.startWith('foo').fn('bar')).toBeFalse()
		expect(is.String.startWith('foo').fn('  foo')).toBeFalse()
	})

	test('Should return true when input not starting with "foo"', () => {
		expect(A.not(is.String.startWith('foo')).fn('foo')).toBeFalse()
		expect(A.not(is.String.startWith('foo')).fn('foo-bar')).toBeFalse()
		expect(A.not(is.String.startWith('foo')).fn('bar')).toBeTrue()
		expect(A.not(is.String.startWith('foo')).fn('  foo')).toBeTrue()
	})
})
