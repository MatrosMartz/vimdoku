import { describe, expect, test } from 'vitest'

import { match } from './match.util'

describe.concurrent('match util', () => {
	enum EnumTest {
		Foo = 'foo',
		Bar = 'bar',
		Baz = 'baz',
		QUX = 'qux',
		QUZ = 'quz',
	}

	test('Should match with `EnumTest.Foo`', () => {
		const result = match(EnumTest.Foo)
			.case(EnumTest.Foo, () => 'foo')
			.default(() => 'not foo')
			.done()

		expect(result).toBe('foo')
	})

	test('Should match with default case', () => {
		const result = match(EnumTest.Bar)
			.case(EnumTest.Foo, () => 'foo')
			.default(() => 'not foo')
			.done()

		expect(result).toBe('not foo')
	})

	test('Should match any of the cases in the array.', () => {
		const result = match(EnumTest.QUZ)
			.case([EnumTest.QUX, EnumTest.QUZ], () => 'qux or quz')
			.default(() => 'other')
			.done()

		expect(result).toBe('qux or quz')
	})
})

describe.concurrent('regexp match util', () => {
	test('Should match with foo.', () => {
		const str = 'foo'

		const result = match
			.rgx(str)
			.case('foo', () => 'is foo')
			.default(() => 'not is foo')
			.done()

		expect(result).toBe('is foo')
	})

	test('Should match with foo.', () => {
		const str = 'foo'

		const result = match
			.rgx(str)
			.case('o', () => 'does include "o" character')
			.default(() => 'does not include "o" character')
			.done()

		expect(result).toBe('includes "o" character')
	})

	test('Should match with foo.', () => {
		const str = 'some text'

		const result = match
			.rgx(str)
			.case('^[^\\w]*$', () => 'does not include any alphanumeric character')
			.default(() => 'include some alphanumeric character')
			.done()

		expect(result).toBe('does not include any alphanumeric character')
	})
})
