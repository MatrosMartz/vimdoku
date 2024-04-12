import type { GameLocale, HelpLocale, HomeLocale } from './pages'
import type { ShareLocale } from './share.locale.ts'
import type { LocaleText, LocaleValueBase, LocaleValueWithKeywords } from './types'

export interface Namespace {
	'pages/game': GameLocale
	'pages/help': HelpLocale
	'pages/home': HomeLocale
	share: ShareLocale
}

export type LocaleType = Record<string, LocaleValueBase | LocaleValueWithKeywords<string[]>>

export type LocaleStr<Locale extends LocaleType> = {
	[K in keyof Locale]: Locale[K] extends LocaleValueWithKeywords<infer Kw> ? LocaleText<Kw> : string
}

export type PagesKeys = {
	[K in keyof Namespace]: K extends `pages/${string}` ? K : never
}[keyof Namespace]

export type TextGetter<Locale extends LocaleType> = {
	[Key in keyof Locale]: Locale[Key] extends LocaleValueWithKeywords<infer Kw>
		? (fallback: LocaleText<Kw>, keywords: Record<Kw[number], string>) => string
		: (fallback: string) => string
}

export type NsFn = <K extends keyof Namespace>(localeKey: K) => TextGetter<Namespace[K] & LocaleType>
