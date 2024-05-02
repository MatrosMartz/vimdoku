import { describe, expect, test } from 'vitest'

import { BuildMatcher, Case } from './match.util'

describe.concurrent('match util', () => {
	enum EnumTest {
		Foo = 'foo',
		Bar = 'bar',
		Baz = 'baz',
		QUX = 'qux',
		QUZ = 'quz',
	}

	test('Should match with `EnumTest.Foo`', () => {
		const result = new BuildMatcher<[EnumTest], string>()
			.addCase(Case.array([Case.equalTo(EnumTest.Foo)]), () => 'foo')
			.default(() => 'not foo')
			.done()(EnumTest.Foo)

		expect(result).toBe('foo')
	})

	test('Should match with default case', () => {
		const result = new BuildMatcher<[EnumTest], string>()
			.addCase(Case.array([Case.equalTo(EnumTest.Foo)]), () => 'foo')
			.default(() => 'not foo')
			.done()(EnumTest.Bar)

		expect(result).toBe('not foo')
	})

	test('Should match any of the cases in the array.', () => {
		const result = new BuildMatcher<[EnumTest], string>()
			.addCase(Case.array([Case.equalTo(EnumTest.QUX).union(Case.equalTo(EnumTest.QUZ))]), () => 'qux or quz')
			.default(() => 'other')
			.done()(EnumTest.QUZ)

		expect(result).toBe('qux or quz')
	})
})

describe.concurrent('regexp match util', () => {
	test('Should match with foo.', () => {
		const str = 'foo'

		const result = new BuildMatcher<[string], string>()
			.addCase(Case.array([Case.fromRegex(/foo/i)]), () => 'is foo')
			.default(() => 'not is foo')
			.done()(str)

		expect(result).toBe('is foo')
	})

	test('Should match if a string contains an "o".', () => {
		const str = 'foo'

		const result = new BuildMatcher<[string], string>()
			.addCase(Case.array([Case.fromRegex(/o/i)]), () => 'does includes "o" character')
			.default(() => 'does not include "o" character')
			.done()(str)

		expect(result).toBe('does includes "o" character')
	})

	test('Should return the default case if it contains any alphanumeric characters.', () => {
		const str = 'some text'

		const result = new BuildMatcher<[string], string>()
			.addCase(Case.array([Case.fromRegex(/^[^\w]*$/i)]), () => 'does not include any alphanumeric character')
			.default(() => 'include some alphanumeric character')
			.done()(str)

		expect(result).toBe('include some alphanumeric character')
	})
})
