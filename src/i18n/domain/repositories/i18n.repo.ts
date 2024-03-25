import type { Namespace } from '~/locales'
import type { Lang } from '../const'

export interface I18nRepo {
	getLang(): Promise<Lang | null>
	getLocale(lang: Lang): Promise<{ [Ns in keyof Namespace]: Record<keyof Namespace[Ns], string> }>
}
