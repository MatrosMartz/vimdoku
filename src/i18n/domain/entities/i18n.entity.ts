import type enSchema from '@/locales/en.json'
import type { VariablesFromStr } from '~/share/types'

import { IDLE_LANG, type Lang } from '../const'
import type { SchemaKeys } from './schema.entity'

export type I18nSchema = Omit<typeof enSchema, '$schema'>

type GetTemplateKey<str extends string> = str extends `${infer TK}-${'head' | 'tail'}` ? TK : never

export type I18nKeys = SchemaKeys<I18nSchema>
export type I18nTemplateKeys = GetTemplateKey<I18nKeys>

export interface I18n {
	lang: Lang
	/**
	 * Get the respective text to that key.
	 * @param key The text key.
	 * @param fallBack The alternative if the text does not exist or is not loaded already.
	 * @param keywords Object with keywords to be inserted in the text.
	 * @returns the text or fallback.
	 */
	get<K extends I18nKeys, F extends string>(key: K, fallBack: F, keywords?: Record<VariablesFromStr<F>, string>): string
}

export const IDLE_I18N: I18n = {
	lang: IDLE_LANG,
	get(_, fallBack) {
		return fallBack
	},
}
