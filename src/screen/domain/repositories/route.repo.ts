import type { FullRoute } from '../entities'

export interface RouteRepo {
	get(): FullRoute
	set(fullRoute: FullRoute): void
	update(fn: (fullRoute: FullRoute) => FullRoute): void
}
