import { IDLE_PREFS } from '$pref/domain/models'
import { Page, PageWithLang } from '$screen/domain/entities'
import type { PageRepo } from '$screen/domain/repositories'

export const browserPageRepo: PageRepo = {
	async get() {
		return PageWithLang.fromString(globalThis.location.pathname.replace(/^\/|\/$/g, ''))
	},
	async set({ lang, page }) {
		const fullPath = Page.isHome(page)
			? `/${lang ?? IDLE_PREFS.language}`
			: `/${lang ?? IDLE_PREFS.language}/${page.route}`
		window.history.pushState(null, fullPath, globalThis.location.origin + fullPath)
	},
	async update(fn) {
		await this.set(fn(await this.get()))
	},
}
