import type { GameLocale, HomeLocale, ShareLocale } from '~/locales'
import { inArray, inject } from '~/share/utils'

import { type Lang, LANGS } from '../const'
import { IDLE_I18N } from '../entities'
import { type II18n } from '../models'
import type { I18nRepo } from '../repositories/i18n.repo'
import { I18nObs } from './i18n-obs.service'

export class I18nSvc implements II18n {
	readonly #obs = inject(I18nObs)
	readonly #repo

	constructor(repo: I18nRepo) {
		this.#repo = repo
	}

	get data() {
		return this.#obs.data
	}

	async changeLang(lang: Lang): Promise<void> {
		if (!inArray(LANGS, lang)) {
			this.#obs.set(IDLE_I18N)
			return
		}

		const namespaces = await this.#getNamespaces(lang)

		this.#obs.set({
			lang,
			ns: namespace => {
				const locale = namespaces[namespace]

				if (locale == null) throw new Error('namespace is not valid.')

				return new Proxy(
					{},
					{
						get(_, prop) {
							if (prop in locale)
								return (fallback: string, keywords?: Record<string, string>) => {
									let text = locale[prop as keyof typeof locale] as string
									if (keywords != null)
										for (const [keyword, value] of Object.entries(keywords))
											text = text.replaceAll(`{|${keyword}|}`, value)
									return text
								}
						},
					}
				) as never
			},
		})
	}

	async load(): Promise<void> {
		const lang = await this.#repo.get()
		if (lang != null) await this.changeLang(lang)
	}

	async #fetch<O>(namespace: string, lang: Lang) {
		return await fetch(globalThis.location.origin + `/locales/${namespace}/${lang}.json`).then<Record<keyof O, string>>(
			async res => await res.json()
		)
	}

	async #getNamespaces(lang: Lang) {
		const [game, home, share] = await Promise.all([
			this.#fetch<GameLocale>('pages/game', lang),
			this.#fetch<HomeLocale>('pages/home', lang),
			this.#fetch<ShareLocale>('share', lang),
		])
		return { 'pages/game': game, 'pages/home': home, share }
	}
}
