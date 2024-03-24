import type { GameLocale } from './pages/game.locale.ts'
import type { HomeLocale } from './pages/home.locale.ts'
import type { ShareLocale } from './share.locale.ts'
import type { LocaleText, LocaleValueWithKeywords } from './types'

export interface Namespace {
	'pages/game': GameLocale
	'pages/home': HomeLocale
	share: ShareLocale
}
export type Locales = Namespace[keyof Namespace]

export type NamespaceTextGetter<Locale extends Locales> = {
	[Key in keyof Locale]: Locale[Key] extends LocaleValueWithKeywords<infer Kw>
		? (fallback: LocaleText<Kw>, keywords: Record<Kw[number], string>) => string
		: (fallback: string) => string
}
