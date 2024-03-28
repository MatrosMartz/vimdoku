import type { Locales, PagesKeys } from '~/locales'
import type { RequireOne } from '~/share/types'
import { inArray, inject, option } from '~/share/utils'
import { Page } from '$screen/domain/entities'

import { type Lang, LANGS } from '../const'
import { IDLE_I18N, IDLE_I18N_HANDLER } from '../entities'
import { type II18n } from '../models'
import type { I18nRepo } from '../repositories/i18n.repo'
import { I18nObs } from './i18n-obs.service'

export class I18nSvc implements II18n {
	readonly #obs = inject(I18nObs)
	#page: PagesKeys = 'pages/home'
	readonly #repo

	constructor(repo: I18nRepo) {
		this.#repo = repo
	}

	get data() {
		return this.#obs.data
	}

	async load(): Promise<void> {
		const lang = await this.#repo.getLang()
		if (lang != null) await this.updateFor({ lang })
	}

	async updateFor(screen: RequireOne<{ lang: Lang; page: Page }>) {
		const lang = screen.lang ?? this.#obs.data.lang
		this.#page = option(screen.page, Page.getPageKey) ?? this.#page

		if (!inArray(LANGS, lang)) {
			this.#obs.set(IDLE_I18N)
			return
		}

		const namespace = await this.#repo.getLocale(lang, this.#page)

		this.#obs.set({
			lang,
			ns: localeKey => {
				const locale = namespace[localeKey]

				return new Proxy(
					{},
					{
						get(_, prop) {
							if (locale != null && prop in locale)
								return (fallback: string, keywords?: Record<string, string>) => {
									let text = locale[prop as keyof Locales] as string
									if (keywords != null)
										for (const [keyword, value] of Object.entries(keywords))
											text = text.replaceAll(`{|${keyword}|}`, value)
									return text
								}

							return IDLE_I18N_HANDLER.get
						},
					}
				) as never
			},
		})
	}
}
