import type { PagesKeys } from '~/locales'
import { Collection } from '~/share/domain/entities'
import { A, Protocol } from '~/share/utils'
import type { Difficulty } from '$sudoku/domain/const'

export enum Kind {
	Game = 'game',
	Help = 'help',
	Home = 'home',
	NotFound = 'not-found',
}

export const KINDS = new Collection.Builder().addToMain
	.fromObject(Kind)
	.addNewSub.conditional('SIMPLE', 'COMPOUND', A.is.Array.equalTo([A.equalTo('Home', 'NotFound'), A.is.Any]))
	.done()

export enum HelpSub {
	Main = '',
}

export const HELP_SUB = new Collection.Builder().addToMain.fromObject(HelpSub).done()

export abstract class Base implements Protocol.IEquals<Route> {
	abstract readonly kind: Kind

	abstract readonly path: string

	constructor() {
		if (![Home, Game, Help, NotFound].includes(new.target as never)) throw new Error('Can not extends Base.')
	}

	toJSON() {
		return { kind: this.kind, path: this.path }
	}

	toString() {
		return this.path
	}

	abstract [Protocol.equalsTo](other: Route): boolean
}

export class Home extends Base {
	readonly kind = Kind.Home

	readonly path = ''

	static is(route: unknown): route is Home {
		return route instanceof Home
	}

	[Protocol.equalsTo](other: Route) {
		return other.kind === Kind.Home
	}
}

export type GameSub = keyof typeof Difficulty.Kind

export class Game<SubRoute extends GameSub> extends Base {
	readonly kind = Kind.Game
	readonly path
	readonly subRoute

	constructor(subRoute: SubRoute) {
		super()
		this.subRoute = subRoute
		this.path = `${this.kind}/${this.subRoute}`
	}

	static is<Sub extends GameSub | undefined>(
		route: unknown,
		sub?: Sub
	): route is Game<Sub extends undefined ? GameSub : Sub> {
		return route instanceof Game && (sub == null || route.subRoute === sub)
	}

	[Protocol.equalsTo](other: Route) {
		return other.kind === Kind.Game && other.subRoute === this.subRoute
	}
}

export class Help<SubRoute extends HelpSub> extends Base {
	readonly kind = Kind.Help
	readonly path
	readonly subRoute

	constructor(subRoute: SubRoute) {
		super()
		this.subRoute = subRoute
		this.path =
			subRoute === HelpSub.Main
				? (`${this.kind}` as const)
				: (`${this.kind}/${this.subRoute}` as `${Kind.Help}/${Exclude<HelpSub, HelpSub.Main>}`)
	}

	static is<Sub extends HelpSub | undefined>(
		route: unknown,
		sub?: Sub
	): route is Help<Sub extends undefined ? HelpSub : Sub> {
		return route instanceof Help && (sub == null || route.subRoute === sub)
	}

	[Protocol.equalsTo](other: Route) {
		return other.kind === Kind.Help && this.subRoute === other.subRoute
	}
}

export class NotFound extends Base {
	readonly kind = Kind.NotFound
	readonly path

	constructor(path: string) {
		super()
		this.path = path
	}

	static is(route: unknown): route is NotFound {
		return route instanceof NotFound
	}

	[Protocol.equalsTo](other: Route) {
		return other.kind === Kind.NotFound && this.path === other.path
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
