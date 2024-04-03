import type { PagesKeys } from '~/locales'
import { Group } from '~/share/domain/entities'
import { type DifficultyKind } from '$sudoku/domain/const'

export enum RouteKind {
	Game = 'game',
	Help = 'help',
	Home = 'home',
	NotFound = 'not-found',
}

export const ROUTE_KINDS = (() => {
	const ALL = Group.fromValues(RouteKind)
	const SIMPLE = new Group([RouteKind.Home, RouteKind.NotFound] as const)
	const COMPOUND = ALL.difference(SIMPLE)

	return { ALL, SIMPLE, COMPOUND }
})()

export enum HelpSubRoute {
	Main = '',
}

export const HELP_SUB_ROUTES = Group.fromValues(HelpSubRoute)

export abstract class Route {
	abstract readonly kind: RouteKind

	abstract readonly path: string

	static createGame(difficulty: keyof typeof DifficultyKind) {
		return new GameRoute(difficulty)
	}

	static createHelp(subPath: HelpSubRoute) {
		return new HelpRoute(subPath)
	}

	static createHome() {
		return new HomeRoute()
	}

	static getPageKey(route: Route): PagesKeys {
		return Route.isHelp(route) ? `pages/${route.path}` : Route.isGame(route) ? `pages/${route.kind}` : 'pages/home'
	}

	static isGame(route: Route): route is GameRoute<keyof typeof DifficultyKind> {
		return route.kind === RouteKind.Game
	}

	static isHelp(route: Route): route is HelpRoute<HelpSubRoute> {
		return route.kind === RouteKind.Help
	}

	static isHome(route: Route): route is HomeRoute {
		return route.kind === RouteKind.Home
	}

	static isNotFound(route: Route): route is NotFoundRoute {
		return route.kind === RouteKind.NotFound
	}

	static notFound(path: string) {
		return new NotFoundRoute(path)
	}

	toJSON() {
		return { kind: this.kind, path: this.path }
	}
}

class HomeRoute extends Route {
	get kind() {
		return RouteKind.Home as const
	}

	get path() {
		return '' as const
	}
}

export const IDLE_ROUTE = Route.createHome()

class GameRoute<SubRoute extends keyof typeof DifficultyKind> extends Route {
	readonly #subRoute

	constructor(subRoute: SubRoute) {
		super()
		this.#subRoute = subRoute
	}

	get kind() {
		return RouteKind.Game as const
	}

	get path() {
		return `${this.kind}/${this.#subRoute}` as const
	}

	get subRoute() {
		return this.#subRoute
	}
}

class HelpRoute<SubRoute extends HelpSubRoute> extends Route {
	readonly #subRoute
	constructor(subRoute: SubRoute) {
		super()
		this.#subRoute = subRoute
	}

	get kind() {
		return RouteKind.Help as const
	}

	get path() {
		if (this.#subRoute === HelpSubRoute.Main) return `${this.kind}` as const
		return `${this.kind}/${this.subRoute}` as `${RouteKind.Help}/${Exclude<HelpSubRoute, HelpSubRoute.Main>}`
	}

	get subRoute() {
		return this.#subRoute
	}
}

class NotFoundRoute extends Route {
	readonly #path

	constructor(path: string) {
		super()
		this.#path = path
	}

	get kind() {
		return RouteKind.NotFound
	}

	get path() {
		return this.#path
	}
}

export type AvailablePaths = (GameRoute<keyof typeof DifficultyKind> | HelpRoute<HelpSubRoute> | HomeRoute)['path']
