import type { GameLocale, HelpLocale, HomeLocale } from './pages'
import type { ShareLocale } from './share.locale.ts'
import type { LocaleText, LocaleValueWithKeywords } from './types'

export interface Namespace {
	'pages/game': GameLocale
	'pages/help': HelpLocale
	'pages/home': HomeLocale
	share: ShareLocale
}

export type Locales = Namespace[keyof Namespace]
export type PagesKeys = {
	[K in keyof Namespace]: K extends `pages/${string}` ? K : never
}[keyof Namespace]

export type NamespaceTextGetter<Locale extends Locales> = {
	[Key in keyof Locale]: Locale[Key] extends LocaleValueWithKeywords<infer Kw>
		? (fallback: LocaleText<Kw>, keywords: Record<Kw[number], string>) => string
		: (fallback: string) => string
}
