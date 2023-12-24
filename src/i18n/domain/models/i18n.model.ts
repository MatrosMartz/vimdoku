import type enSchema from '@/locales/en.json'
import type { Lang } from '$pref/domain/models'

import type { SchemaStr, SchemaValue } from './schemas.model'

export type I18nSchema = Omit<typeof enSchema, '$schema'>

export type I18nKeys = SchemaStr<I18nSchema>
export type I18nValue<K extends I18nKeys> = SchemaValue<K, I18nSchema>

export interface I18n {
	get<K extends I18nKeys>(key: K, fallBack: I18nValue<K>): I18nValue<K>
}

export interface II18n {
	readonly actualLang: Lang
	readonly data: I18n
	changeLang(lang: Lang): Promise<void>
}

export const IDLE_I18N: I18n = {
	get(key, fallBack) {
		return fallBack
	},
}
