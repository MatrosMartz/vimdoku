import { describe, expect, test } from 'vitest'

import * as A from '~/share/utils/assert'

import { Builder, Sub } from './collection.entity'

const entries = [
	['foo', 1],
	['bar', 2],
	['baz', 3],
	['quux', 4],
	['quuz', 5],
] as const

const object = {
	foo: 1,
	bar: 2,
	baz: 3,
	quux: 4,
	quuz: 5,
} as const

describe.concurrent('Collection.Builder.addToMain', () => {
	test('Should add entries directly to the main', () => {
		const collection = new Builder().addToMain.fromEntries(entries).done()

		expect(collection.size).toBe(5)
		expect(collection.subs).toEqual({})
	})

	test('Should add entries from object directly to the main', () => {
		const collection = new Builder().addToMain.fromObject(object).done()

		expect(collection.size).toBe(5)
		expect(collection.subs).toEqual({})
	})
})

describe.concurrent('Collection.Builder.addNewSub', () => {
	test('Should add entries by new sub-collection', () => {
		const collection = new Builder().addNewSub.fromEntries('foo', entries).done()

		expect(collection.size).toBe(5)
		expect(collection.subs).toEqual({ foo: expect.any(Sub) })
		expect(collection.subs.foo.size).toBe(5)
	})

	test('Should add entries from object by new sub-collection', () => {
		const collection = new Builder().addNewSub.fromObject('foo', object).done()

		expect(collection.size).toBe(5)
		expect(collection.subs).toEqual({ foo: expect.any(Sub) })
		expect(collection.subs.foo.size).toBe(5)
	})

	test('Should create new sub-collection by condition', () => {
		const collection = new Builder().addToMain
			.fromEntries(entries)
			.addNewSub.create('bar', A.is.Array.with(0, A.is.String.startWith('b')))
			.done()

		expect(collection.subs).toEqual({ bar: expect.any(Sub) })
		expect(collection.subs.bar.size).toBe(2)
	})

	test('Should separate all entries into two new sub-collections', () => {
		const collection = new Builder().addToMain
			.fromEntries(entries)
			.addNewSub.conditional('one', 'two', A.is.Array.with(0, A.is.String.endWith('z')))
			.done()

		expect(collection.subs).toEqual({ one: expect.any(Sub), two: expect.any(Sub) })
	})
})

const collection = new Builder().addToMain
	.fromEntries(entries)
	.addNewSub.conditional('endInZ', 'notEndInZ', A.is.Array.with(0, A.is.String.endWith('z')))
	.addNewSub.create('isFoo', A.is.Array.with(0, A.equalTo('foo')))
	.done()

describe.concurrent('Main', () => {
	const validKeys = ['foo', 'bar', 'baz', 'quux', 'quuz']
	const validValues = [1, 2, 3, 4, 5]

	test('Should return random key and value', () => {
		expect(collection.randomKey()).toSatisfy((val: string) => validKeys.includes(val))
		expect(collection.randomValue()).toSatisfy((val: number) => validValues.includes(val))
	})

	test('should contains the random key', () => {
		const randomKey = validKeys[Math.floor(Math.random() * validKeys.length)]

		expect(collection.containsKey(randomKey)).toBe(true)
	})

	test('Should get index from value or key', () => {
		const randomIndex = Math.floor(Math.random() * validKeys.length)
		const [key, value] = entries[randomIndex]

		expect(collection.indexByKey(key)).toBe(randomIndex)
		expect(collection.indexByValue(value)).toBe(randomIndex)
	})

	test('Should be bi-directional', () => {
		const randomIndex = Math.floor(Math.random() * validKeys.length)
		const [key, value] = entries[randomIndex]

		expect(collection.keyByValue(value)).toBe(key)
		expect(collection.valueByKey(key)).toBe(value)
	})

	test('Should get entry by index', () => {
		const randomIndex = Math.floor(Math.random() * validKeys.length)
		const entry = entries[randomIndex]

		expect(collection.entryByIndex(randomIndex)).toEqual(entry)
	})

	test('Should find index', () => {
		const randomIndex = Math.floor(Math.random() * validKeys.length)
		const [key, value] = entries[randomIndex]

		expect(collection.findIndex(([k]) => k === key)).toBe(randomIndex)
		expect(collection.findIndex(([, v]) => v === value)).toBe(randomIndex)
		expect(collection.findIndex(() => false)).toBe(-1)
	})

	test('Should join keys', () => {
		expect(collection.joinKeys()).toBe('foo,bar,baz,quux,quuz')
		expect(collection.joinKeys('-')).toBe('foo-bar-baz-quux-quuz')
	})

	test('Should join values', () => {
		expect(collection.joinValues()).toBe('1,2,3,4,5')
		expect(collection.joinValues('-')).toBe('1-2-3-4-5')
	})
})
