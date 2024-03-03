import { FullRoute } from '$screen/domain/entities'
import type { RouteRepo } from '$screen/domain/repositories'

export const browserRouteRepo: RouteRepo = {
	get() {
		return FullRoute.fromString(globalThis.location.pathname.replace(/^\/|\/$/g, ''))
	},
	set({ lang, route }) {
		const fullPath = route.route !== '' ? `/${lang}/${route.route}` : `/${lang}`

		window.history.pushState(null, fullPath, globalThis.location.origin + fullPath)
	},
	update(fn) {
		this.set(fn(this.get()))
	},
}
