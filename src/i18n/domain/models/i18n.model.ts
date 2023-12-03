import type enSchema from '@/locales/en.json'
import type { Langs } from '$pref/domain/models'

import type { SchemaStr, SchemaValue } from './schemas.model'

export type I18nSchema = Omit<typeof enSchema, '$schema'>

export type I18nKeys = SchemaStr<I18nSchema>
export type I18nValue<K extends I18nKeys> = SchemaValue<K, I18nSchema>

export interface I18nData {
	get<K extends I18nKeys>(key: K, fallBack: I18nValue<K>): I18nValue<K>
}

export interface II18n {
	readonly actualLang: Langs
	readonly data: I18nData
	changeLang(lang: Langs): Promise<void>
}
