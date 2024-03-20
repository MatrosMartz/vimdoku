import { Page, PageWithLang } from '$screen/domain/entities'
import type { PageRepo } from '$screen/domain/repositories'

export const browserPageRepo: PageRepo = {
	async get() {
		return PageWithLang.fromString(globalThis.location.pathname.replace(/^\/|\/$/g, ''))
	},
	async set({ lang, page }) {
		const fullPath = `${lang != null ? `/${lang}` : ''}${!Page.isHome(page) ? `/${page.route}` : ''}`
		window.history.pushState(null, fullPath, globalThis.location.origin + fullPath)
	},
	async update(fn) {
		await this.set(fn(await this.get()))
	},
}
