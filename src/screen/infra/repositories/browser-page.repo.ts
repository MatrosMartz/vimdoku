import { Page, Route } from '$screen/domain/entities'
import type { PageRepo } from '$screen/domain/repositories'

/**
 * Gets the current path of the page.
 * @returns path in string format.
 */
function getPath() {
	return globalThis.location.pathname.replace(/^\/|\/$/g, '')
}

export const browserPageRepo: PageRepo = {
	async get() {
		return Page.fromString(getPath())
	},
	async set(page) {
		const fullPath = `${page.lang != null ? `/${page.lang}` : ''}${!Route.isHome(page.route) ? `/${page.route.path}` : ''}`
		window.history.pushState(page, fullPath, globalThis.location.origin + fullPath)
	},
	async update(fn) {
		await this.set(fn(await this.get()))
	},
	subscribe(sub) {
		const fn = (ev: PopStateEvent) => sub(ev.state)

		window.addEventListener('popstate', fn)

		return () => window.removeEventListener('popstate', fn)
	},
}
