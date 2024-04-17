import type { PagesKeys } from '~/locales'
import { Group } from '~/share/domain/entities'
import { type DifficultyKind } from '$sudoku/domain/const'

export enum Kind {
	Game = 'game',
	Help = 'help',
	Home = 'home',
	NotFound = 'not-found',
}

export const NAMES = Group.fromKeys(Kind)

export const KINDS = (() => {
	const ALL = Group.fromValues(Kind)
	const SIMPLE = new Group([Kind.Home, Kind.NotFound])
	const COMPOUND = ALL.difference(SIMPLE)

	return { ALL, SIMPLE, COMPOUND }
})()

export enum HelpSub {
	Main = '',
}

export const HELP_SUB = Group.fromValues(HelpSub)

abstract class Base {
	abstract readonly kind: Kind

	abstract readonly path: string

	toJSON() {
		return { kind: this.kind, path: this.path }
	}

	toString() {
		return this.path
	}

	abstract equals(other: Route): boolean
}

export class Home extends Base {
	get kind() {
		return Kind.Home as const
	}

	get path() {
		return '' as const
	}

	static is(route: unknown): route is Home {
		return route instanceof Home
	}

	equals(other: Route) {
		return Home.is(other)
	}
}

export type GameSub = keyof typeof DifficultyKind

export class Game<SubRoute extends GameSub> extends Base {
	readonly #subRoute

	constructor(subRoute: SubRoute) {
		super()
		this.#subRoute = subRoute
	}

	get kind() {
		return Kind.Game as const
	}

	get path() {
		return `${this.kind}/${this.#subRoute}` as const
	}

	get subRoute() {
		return this.#subRoute
	}

	static is<Sub extends GameSub | undefined>(
		route: unknown,
		sub?: Sub
	): route is Game<Sub extends undefined ? GameSub : Sub> {
		return route instanceof Game && (sub == null || route.#subRoute === sub)
	}

	equals(other: Route) {
		return Game.is(other) && this.subRoute === other.subRoute
	}
}

export class Help<SubRoute extends HelpSub> extends Base {
	readonly #subRoute
	constructor(subRoute: SubRoute) {
		super()
		this.#subRoute = subRoute
	}

	get kind() {
		return Kind.Help as const
	}

	get path() {
		if (this.#subRoute === HelpSub.Main) return `${this.kind}` as const
		return `${this.kind}/${this.subRoute}` as `${Kind.Help}/${Exclude<HelpSub, HelpSub.Main>}`
	}

	get subRoute() {
		return this.#subRoute
	}

	static is<Sub extends HelpSub | undefined>(
		route: unknown,
		sub?: Sub
	): route is Help<Sub extends undefined ? HelpSub : Sub> {
		return route instanceof Help && (sub == null || route.subRoute === sub)
	}

	equals(other: Route) {
		return Help.is(other) && this.subRoute === other.subRoute
	}
}

export class NotFound extends Base {
	readonly #path

	constructor(path: string) {
		super()
		this.#path = path
	}

	get kind() {
		return Kind.NotFound
	}

	get path() {
		return this.#path
	}

	static is(route: unknown): route is NotFound {
		return route instanceof NotFound
	}

	equals(other: Route) {
		return NotFound.is(other) && this.path === other.path
	}
}

/**
 * Gets the page key.
 * @param route Any Route.
 * @returns PagesKeys.
 */
export function getPageKey(route: Base): PagesKeys {
	return Help.is(route) ? `pages/${route.path}` : Game.is(route) ? `pages/${route.kind}` : 'pages/home'
}

/**
 * check if any value is Route.
 * @param value Value to check.
 * @returns True if some value is Route, false otherwise.
 */
export function is(value: unknown): value is Route {
	return value instanceof Base
}

export type AvailablePaths = (Game<GameSub> | Help<HelpSub> | Home)['path']

export type Route = Game<GameSub> | Help<HelpSub> | Home | NotFound

export const IDLE: Route = new Home()
