import { describe, expect, test } from 'vitest'

import * as A from './assert'
import * as Match from './match.util'

describe.concurrent('match util', () => {
	enum EnumTest {
		Foo = 'foo',
		Bar = 'bar',
		Baz = 'baz',
		QUX = 'qux',
		QUZ = 'quz',
	}

	test('Should match with `EnumTest.Foo`', () => {
		const result = new Match.Builder<readonly [EnumTest], string>()
			.addCase(A.is.Array.equalTo([A.equalTo(EnumTest.Foo)]), () => 'foo')
			.default(() => 'not foo')
			.done()(EnumTest.Foo)

		expect(result).toBe('foo')
	})

	test('Should match with default case', () => {
		const result = new Match.Builder<[EnumTest], string>()
			.addCase(A.is.Array.equalTo([A.equalTo(EnumTest.Foo)]), () => 'foo')
			.default(() => 'not foo')
			.done()(EnumTest.Bar)

		expect(result).toBe('not foo')
	})

	test('Should match any of the cases in the array', () => {
		const result = new Match.Builder<[EnumTest], string>()
			.addCase(A.is.Array.equalTo([A.equalTo(EnumTest, EnumTest.QUZ)]), () => 'qux or quz')
			.default(() => 'other')
			.done()(EnumTest.QUZ)

		expect(result).toBe('qux or quz')
	})
})

describe.concurrent('regexp match util', () => {
	test('Should match with foo', () => {
		const input = 'foo'

		const result = new Match.Builder<[string], string>()
			.addCase(A.is.Array.equalTo([A.is.String.match(/foo/i)]), () => 'is foo')
			.default(() => 'not is foo')
			.done()(input)

		expect(result).toBe('is foo')
	})

	test('Should match if a string contains an "o"', () => {
		const input = 'foo'

		const result = new Match.Builder<[string], string>()
			.addCase(A.is.Array.equalTo([A.is.String.match(/o/i)]), () => 'does includes "o" character')
			.default(() => 'does not include "o" character')
			.done()(input)

		expect(result).toBe('does includes "o" character')
	})

	test('Should return the default case if it contains any alphanumeric characters', () => {
		const input = 'some text'

		const result = new Match.Builder<[string], string>()
			.addCase(
				A.is.Array.equalTo([A.is.String.match(/^[^\w]*$/i)]),
				() => 'does not include any alphanumeric character'
			)
			.default(() => 'include some alphanumeric character')
			.done()(input)

		expect(result).toBe('include some alphanumeric character')
	})
})
