import { _throw, capitalCase, inArray, InvalidStringPageError } from '~/share/utils'
import { type Lang, LANGS } from '$i18n/domain/const'
import { DIFFICULTIES_NAMES, DifficultyKind } from '$sudoku/domain/models'

import { COMPOUND_PATHS, HELP_SUBPATHS, HelpSubPath, Path } from './path.entity'

export abstract class Page {
	abstract readonly path: Path

	abstract readonly route: string

	static createGame(difficulty: DifficultyKind) {
		return new GamePage(difficulty)
	}

	static createHelp(subPath: HelpSubPath) {
		return new HelpPage(subPath)
	}

	static createHome() {
		return new HomePage()
	}

	static isGame(route: Page): route is GamePage {
		return route.path === Path.Game
	}

	static isHelp(route: Page): route is HelpPage {
		return route.path === Path.Help
	}

	static isHome(route: Page): route is HomePage {
		return route.path === Path.Home
	}

	static isNotFound(route: Page): route is NotFoundPage {
		return route.path === Path.NotFound
	}

	static notFound(route: string) {
		return new NotFoundPage(route)
	}

	toJSON() {
		return {
			path: this.path,
			route: this.route,
		}
	}
}

class HomePage extends Page {
	get path() {
		return Path.Home as const
	}

	get route() {
		return '' as const
	}
}

export const IDLE_PAGE = Page.createHome()

const GET_DIFFICULTY_NAME = {
	[DifficultyKind.Beginner]: 'beginner',
	[DifficultyKind.Basic]: 'basic',
	[DifficultyKind.Easy]: 'easy',
	[DifficultyKind.Medium]: 'medium',
	[DifficultyKind.Advanced]: 'advanced',
	[DifficultyKind.Hard]: 'hard',
	[DifficultyKind.Expert]: 'expert',
} as const

class GamePage extends Page {
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

class HelpPage extends Page {
	readonly #subPath
	constructor(subPath: HelpSubPath) {
		super()
		this.#subPath = subPath
	}

	get path() {
		return Path.Help as const
	}

	get route() {
		if (this.#subPath === HelpSubPath.Main) return `${this.path}` as const
		return `${this.path}/${this.subPath}` as `${Path.Help}/${Exclude<HelpSubPath, HelpSubPath.Main>}`
	}

	get subPath() {
		return this.#subPath
	}
}

class NotFoundPage extends Page {
	readonly #route

	constructor(route: string) {
		super()
		this.#route = route
	}

	get path() {
		return Path.NotFound
	}

	get route() {
		return this.#route
	}
}

export type AvailableRoutes = (GamePage | HelpPage | HomePage)['route']

export class PageWithLang {
	static readonly #firstPattern = new RegExp(
		`^(?:(?:(${LANGS.join('|')}))|(?:(${COMPOUND_PATHS.join('|')})(?:\\/(.*))?))$`,
		'i'
	)

	static readonly #secondPattern = new RegExp(`^(${LANGS.join('|')})\\/(${COMPOUND_PATHS.join('|')})(?:\\/(.*))?$`)

	readonly #lang
	readonly #page
	constructor({ lang, page }: { lang?: Lang; page: Page }) {
		this.#lang = lang
		this.#page = page
	}

	get lang() {
		return this.#lang
	}

	get page() {
		return this.#page
	}

	static fromString(str: string) {
		try {
			const { lang, path, rest } = this.#getParts(str)

			if (path === Path.Home) {
				if (rest != null && rest.length !== 0) throw new InvalidStringPageError()
				return new PageWithLang({ lang, page: Page.createHome() })
			} else if (path === Path.Help && (inArray(HELP_SUBPATHS, rest) || rest == null))
				return new PageWithLang({ lang, page: Page.createHelp(rest ?? HelpSubPath.Main) })
			else if (path === Path.Game) {
				const difficulty = rest == null || rest.length === 0 ? 'Basic' : capitalCase(rest)
				if (!inArray(DIFFICULTIES_NAMES, difficulty)) throw new InvalidStringPageError()
				return new PageWithLang({ lang, page: Page.createGame(DifficultyKind[difficulty]) })
			}

			return new PageWithLang({ page: Page.notFound(str) })
		} catch (err) {
			if (err instanceof InvalidStringPageError) return new PageWithLang({ page: Page.notFound(str) })
			throw err
		}
	}

	static #getParts(str: string) {
		if (str === '') return { path: Path.Home }
		const [, lang, path, rest] =
			this.#firstPattern.exec(str) ?? this.#secondPattern.exec(str) ?? _throw(new InvalidStringPageError())

		if (lang != null && !inArray(LANGS, lang)) throw new InvalidStringPageError()
		if (path === '' || path == null) return { lang, path: Path.Home, rest }
		if (!inArray(COMPOUND_PATHS, path)) throw new InvalidStringPageError()

		return { lang: lang as Lang | undefined, path, rest }
	}

	toJSON() {
		return {
			lang: this.#lang,
			page: this.#page,
		}
	}

	withLang(lang: Lang) {
		return new PageWithLang({ lang, page: this.#page })
	}

	withPage(page: Page) {
		return new PageWithLang({ lang: this.#lang, page })
	}
}
