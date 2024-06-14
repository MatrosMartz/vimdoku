import { describe, expectTypeOf, test } from 'vitest'

import type { Entry } from '~/share/types'

import { Main, Sub } from './collection.entity'

type IsFoo = Entry<'foo', 1>
type StartWithB = Entry<'bar', 2> | Entry<'baz', 3>
type StartWithQ = Entry<'quux', 4> | Entry<'quuz', 5>
type EndWithZ = Entry<'baz', 3> | Entry<'quuz', 5>

type AllEntries = IsFoo | StartWithB | StartWithQ | EndWithZ

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type SubCollections = {
	readonly endWithZ: Sub<EndWithZ>
	readonly isFoo: Sub<IsFoo>
	readonly startWithB: Sub<StartWithB>
	readonly startWithQ: Sub<StartWithQ>
}

declare const collection: Main<AllEntries, SubCollections>

describe('Main', () => {
	test('Should return only valid key types', () => {
		expectTypeOf(collection.randomKey()).toEqualTypeOf<'foo' | 'bar' | 'baz' | 'quux' | 'quuz'>()
	})

	test('Should return only valid values types', () => {
		expectTypeOf(collection.randomValue()).toEqualTypeOf<1 | 2 | 3 | 4 | 5>
	})

	test('Should get the value matching the key', () => {
		expectTypeOf(collection.valueByKey('foo')).toEqualTypeOf<1>()
	})

	test('Should get the key matching the value', () => {
		expectTypeOf(collection.keyByValue(1)).toEqualTypeOf<'foo'>()
	})
})

describe('Subs', () => {
	test('Should be SubCollections', () => {
		expectTypeOf(collection.subs).toEqualTypeOf<SubCollections>()
	})

	test('Should return only valid key types', () => {
		expectTypeOf(collection.subs.isFoo.randomKey()).toEqualTypeOf<'foo'>()
		expectTypeOf(collection.subs.startWithB.randomKey()).toEqualTypeOf<'bar' | 'baz'>()
		expectTypeOf(collection.subs.startWithQ.randomKey()).toEqualTypeOf<'quuz' | 'quux'>()
		expectTypeOf(collection.subs.endWithZ.randomKey()).toEqualTypeOf<'baz' | 'quuz'>()
	})

	test('Should return only valid value types', () => {
		expectTypeOf(collection.subs.isFoo.randomValue()).toEqualTypeOf<1>()
		expectTypeOf(collection.subs.startWithB.randomValue()).toEqualTypeOf<2 | 3>()
		expectTypeOf(collection.subs.startWithQ.randomValue()).toEqualTypeOf<4 | 5>()
		expectTypeOf(collection.subs.endWithZ.randomValue()).toEqualTypeOf<3 | 5>()
	})

	test('Should get the value matching the key', () => {
		expectTypeOf(collection.subs.isFoo.valueByKey('foo')).toEqualTypeOf<1>()
		expectTypeOf(collection.subs.startWithB.valueByKey('bar')).toEqualTypeOf<2>()
		expectTypeOf(collection.subs.startWithQ.valueByKey('quuz')).toEqualTypeOf<5>()
		expectTypeOf(collection.subs.endWithZ.valueByKey('baz')).toEqualTypeOf<3>()
	})

	test('Should get the key matchin the value', () => {
		expectTypeOf(collection.subs.isFoo.keyByValue(1)).toEqualTypeOf<'foo'>()
		expectTypeOf(collection.subs.startWithB.keyByValue(3)).toEqualTypeOf<'baz'>()
		expectTypeOf(collection.subs.startWithQ.keyByValue(4)).toEqualTypeOf<'quux'>()
		expectTypeOf(collection.subs.endWithZ.keyByValue(5)).toEqualTypeOf<'quuz'>()
	})
})
