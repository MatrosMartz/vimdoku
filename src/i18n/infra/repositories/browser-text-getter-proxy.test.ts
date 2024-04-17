import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import type { LocaleStr, LocaleType, TextGetter } from '~/locales'
import type { LocaleValue } from '~/locales/types'
import { Lang } from '$i18n/domain/const'

import { TextGetterProxy } from './browser-text-getter-proxy'

interface LocaleExample extends LocaleType {
	bar_bar: LocaleValue
	baz: LocaleValue<['foo']>
	foo: LocaleValue
}

const LOCALE_EXAMPLE: LocaleStr<LocaleExample> = {
	bar_bar: 'bar bar',
	baz: 'lorem {|foo|} ipsum',
	foo: 'foo',
}
let textGetter: TextGetter<LocaleExample>

describe.concurrent('TextGetterProxy.create with locale', () => {
	beforeEach(() => {
		textGetter = TextGetterProxy.create(LOCALE_EXAMPLE)
	})

	test('Should return the same value as locale', () => {
		expect(textGetter.foo('ignore')).toBe(LOCALE_EXAMPLE.foo)
	})

	test('Should replace "{|foo|}" with the set value', () => {
		expect(textGetter.baz('ignore this {|foo|}', { foo: 'replaced' })).toBe(
			LOCALE_EXAMPLE.baz.replaceAll('{|foo|}', 'replaced')
		)
	})
})

describe.concurrent('TextGetterProxy.create with empty locale', () => {
	beforeEach(() => {
		textGetter = TextGetterProxy.create<LocaleExample>({} as never)
	})

	test('Should return the fallback value', () => {
		expect(textGetter.foo('ignore')).not.toBe(LOCALE_EXAMPLE.foo)
		expect(textGetter.foo('ignore')).toBe('ignore')
	})

	test('Should replace "{|foo|}" with the set value', () => {
		expect(textGetter.baz('ignore this {|foo|}', { foo: 'replaced' })).toBe('ignore this replaced')
	})
})

describe('TextGetterProxy.getLocale ', () => {
	beforeAll(() => {
		const fetchMock = vi.fn(
			async () =>
				await Promise.resolve({
					json: async () => await Promise.resolve(LOCALE_EXAMPLE),
				})
		)
		vi.stubGlobal('fetch', fetchMock)
	})

	beforeEach(() => {
		return () => vi.clearAllMocks()
	})

	test('Should get the locale', async () => {
		expect(await TextGetterProxy.getLocale('foo', Lang.EN)).toEqual(LOCALE_EXAMPLE)
		expect(fetch).toBeCalledTimes(1)
		expect(fetch).toBeCalledWith(globalThis.location.origin + '/locales/foo/en.json')
	})

	test('', async () => {
		await expect(TextGetterProxy.fromLocale('foo', Lang.EN)).resolves.toMatchObject({ proxy: expect.any(Object) })
	})
})
