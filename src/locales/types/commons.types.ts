import type { Intersect } from '~/share/types'

export type LocaleValueBase = object

export interface LocaleValueWithKeywords<Keywords extends string[]> extends LocaleValueBase {
	keywords: Keywords
}

export type LocaleValue<Keywords extends string[] = string[]> = string[] extends Keywords
	? LocaleValueBase
	: LocaleValueWithKeywords<Keywords>

export type LocaleText<Kw extends string[]> = Intersect<{
	[K in keyof Kw]: { value: `${string}{|${Kw[K]}|}${string}` }['value']
}>

export type LocaleKeywords<K extends string[]> = Record<K[number], string>
