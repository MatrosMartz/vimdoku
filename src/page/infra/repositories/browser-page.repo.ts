import { promiseResolvers } from '~/share/utils'
import { Page, Route } from '$page/domain/entities'
import type { PageRepo } from '$page/domain/repositories'

const firstState = Page.fromString(globalThis.location.pathname.replace(/^\/|\/$/g, ''))

export const browserPageRepo: PageRepo = {
	get: async () => Page.fromString(globalThis.location.pathname.replace(/^\/|\/$/g, '')),
	async go(delta: 'back' | 'forward') {
		const { promise, resolve } = promiseResolvers<Page.Page>()
		const handler = ({ state }: PopStateEvent) => {
			globalThis.removeEventListener('popstate', handler)
			resolve(state ?? firstState)
		}

		globalThis.addEventListener('popstate', handler)

		globalThis.history.go(delta === 'back' ? -1 : delta === 'forward' ? 1 : 0)

		return await promise
	},
	async save(page: Page.Page) {
		const fullPath = `${page.lang != null ? `/${page.lang}` : ''}${!Route.Home.is(page.route) ? `/${page.route.path}` : ''}`
		globalThis.history.pushState(page, fullPath, globalThis.location.origin + fullPath)
	},
	subscribe(sub: (page: Page.Page) => void | Promise<void>) {
		const fn = (ev: PopStateEvent) => {
			void sub(ev.state ?? firstState)
		}

		globalThis.addEventListener('popstate', fn)

		return async () => globalThis.removeEventListener('popstate', fn)
	},
}
