import type enSchema from '@/locales/en.json'
import type { Lang } from '$pref/domain/models'

import type { SchemaStr, SchemaValue } from './schemas.model'

export type I18nSchema = Omit<typeof enSchema, '$schema'>

export type I18nKeys = SchemaStr<I18nSchema>
export type I18nValue<K extends I18nKeys> = SchemaValue<K, I18nSchema>

export interface I18n {
	/**
	 * Get the respective text to that key.
	 * @param key The text key.
	 * @param fallBack The alternative if the text does not exist or is not loaded already.
	 * @returns the text or fallback.
	 */
	get<K extends I18nKeys>(key: K, fallBack: I18nValue<K>): I18nValue<K>
}

export interface II18n {
	/** The current language. */
	readonly actualLang: Lang
	/** The current data. */
	readonly data: I18n
	/**
	 * Changes languages asynchronously.
	 * @param lang The new language.
	 */
	changeLang(lang: Lang): Promise<void>
}

export const IDLE_I18N: I18n = {
	get(key, fallBack) {
		return fallBack
	},
}
