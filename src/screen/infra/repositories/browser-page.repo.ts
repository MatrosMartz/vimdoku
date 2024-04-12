import { Page, RouteBase } from '$screen/domain/entities'
import type { PageRepo } from '$screen/domain/repositories'

export const browserPageRepo: PageRepo = {
	get: async () => Page.fromString(globalThis.location.pathname.replace(/^\/|\/$/g, '')),
	async save(page: Page) {
		const fullPath = `${page.lang != null ? `/${page.lang}` : ''}${!RouteBase.isHome(page.route) ? `/${page.route.path}` : ''}`
		window.history.pushState(page, fullPath, globalThis.location.origin + fullPath)
	},
	subscribe(sub: (page: Page) => void | Promise<void>) {
		const fn = (ev: PopStateEvent) => {
			void sub(ev.state)
		}

		window.addEventListener('popstate', fn)

		return async () => window.removeEventListener('popstate', fn)
	},
}
