import { capitalCase, inArray } from '~/share/utils'
import { type Lang, LANGS, USER_IDLE_PREFS } from '$pref/domain/models'
import { DIFFICULTIES_NAMES, DifficultyKind } from '$sudoku/domain/models'

import { COMPLEX_PATHS, Path } from './path.entity'

export abstract class Route {
	abstract readonly path: Path

	abstract readonly route: string

	static createGame(difficulty: DifficultyKind) {
		return new GameRoute(difficulty)
	}

	static createHelp(index: string) {
		return new HelpRoute(index)
	}

	static createHome() {
		return new HomeRoute()
	}

	static isGame(route: Route): route is GameRoute {
		return route.path === Path.Game
	}

	static isHelp(route: Route): route is HelpRoute {
		return route.path === Path.Help
	}

	static isHome(route: Route): route is HomeRoute {
		return route.path === Path.Home
	}

	static isNotFound(route: Route): route is NotFoundRoute {
		return route.path === Path.NotFound
	}

	static notFound(original: string) {
		return new NotFoundRoute(original)
	}
}

class HomeRoute extends Route {
	get path() {
		return Path.Home as const
	}

	get route() {
		return '' as const
	}
}

export const IDLE_ROUTE = Route.createHome()

const GET_DIFFICULTY_NAME = {
	[DifficultyKind.Beginner]: 'beginner',
	[DifficultyKind.Basic]: 'basic',
	[DifficultyKind.Easy]: 'easy',
	[DifficultyKind.Medium]: 'medium',
	[DifficultyKind.Advanced]: 'advanced',
	[DifficultyKind.Hard]: 'hard',
	[DifficultyKind.Expert]: 'expert',
} as const

class GameRoute extends Route {
	readonly #difficulty

	constructor(difficulty: DifficultyKind) {
		super()
		this.#difficulty = difficulty
	}

	get difficulty() {
		return this.#difficulty
	}

	get difficultyName() {
		return GET_DIFFICULTY_NAME[this.#difficulty]
	}

	get path() {
		return Path.Game as const
	}

	get route() {
		return `${this.path}/${this.difficultyName}` as const
	}
}

class HelpRoute extends Route {
	readonly #index
	constructor(index: string) {
		super()
		this.#index = index
	}

	get index() {
		return this.#index
	}

	get path() {
		return Path.Help as const
	}

	get route() {
		return `${this.path}/${this.index}` as const
	}
}

class NotFoundRoute extends Route {
	readonly #originalPath

	constructor(original: string) {
		super()
		this.#originalPath = original
	}

	get path() {
		return Path.NotFound
	}

	get route() {
		return this.#originalPath
	}
}

export type AvailableRoutes = (GameRoute | HelpRoute | HomeRoute)['route']

export class FullRoute {
	static readonly #firstPattern = new RegExp(
		`^(?:(?:(${LANGS.join('|')}))|(?:(${COMPLEX_PATHS.join('|')})(?:\\/(.*))?))$`,
		'i'
	)

	static readonly #secondPattern = new RegExp(`^(${LANGS.join('|')})\\/(${COMPLEX_PATHS.join('|')})(?:\\/(.*))?$`)

	readonly #lang
	readonly #route
	constructor({ lang, route }: { lang?: Lang; route: Route }) {
		this.#lang = lang
		this.#route = route
	}

	get lang() {
		return this.#lang
	}

	get route() {
		return this.#route
	}

	static fromString(str: string) {
		const { lang, path, rest } = this.#getParts(str)

		if (path === Path.Home) {
			if (rest != null && rest.length !== 0) throw new Error('rest in home path should be empty')
			return new FullRoute({ lang, route: Route.createHome() })
		} else if (path === Path.Help) return new FullRoute({ lang, route: Route.createHelp(rest ?? '') })
		else if (path === Path.Game) {
			const difficulty = rest == null || rest.length === 0 ? 'Basic' : capitalCase(rest)
			if (!inArray(DIFFICULTIES_NAMES, difficulty)) throw new Error(`rest cannot be "${rest}"`)
			return new FullRoute({ lang, route: Route.createGame(DifficultyKind[difficulty]) })
		}

		throw new Error(`path cannot be "${path}"`)
	}

	static #getParts(str: string) {
		if (str === '') return { lang: USER_IDLE_PREFS.language, path: Path.Home }
		const [, lang, path, rest] =
			this.#firstPattern.exec(str) ??
			this.#secondPattern.exec(str) ??
			(() => {
				throw new Error('str not satisfies route regexp')
			})()

		if (lang != null && !inArray(LANGS, lang)) throw new Error(`Lang should be not "${lang}"`)
		if (path === '' || path == null) return { lang, path: Path.Home, rest }
		if (!inArray(COMPLEX_PATHS, path)) {
			throw new Error(`path should be not "${path}"`)
		}

		return { lang: lang as Lang | undefined, path, rest }
	}

	withLang(lang: Lang) {
		return new FullRoute({ lang, route: this.#route })
	}

	withRoute(route: Route) {
		return new FullRoute({ lang: this.#lang, route })
	}
}
