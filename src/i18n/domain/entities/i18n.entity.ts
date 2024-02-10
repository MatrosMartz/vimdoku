import type enSchema from '@/locales/en.json'

import type { SchemaKeys } from './schema.entity'

export type I18nSchema = Omit<typeof enSchema, '$schema'>

type GetTemplateKey<str extends string> = str extends `${infer TK}-${'head' | 'tail'}` ? TK : never

export type I18nKeys = SchemaKeys<I18nSchema>
export type I18nTemplateKeys = GetTemplateKey<I18nKeys>

export interface I18n {
	/**
	 * Get the respective text to that key.
	 * @param key The text key.
	 * @param fallBack The alternative if the text does not exist or is not loaded already.
	 * @returns the text or fallback.
	 */
	get<K extends I18nKeys>(key: K, fallBack: string): string
	getTemplate<K extends I18nTemplateKeys>(key: K, fallback: { head: string; tail: string }, value: string): string
}

export const IDLE_I18N: I18n = {
	get(key, fallBack) {
		return fallBack
	},

	getTemplate(key, fallback, value) {
		return fallback.head + value + fallback.tail
	},
}
