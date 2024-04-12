import { _throw, capitalCase, InvalidStringPageError } from '~/share/utils'
import { type Lang, LANGS } from '$i18n/domain/const'
import { DIFFICULTIES_NAMES } from '$sudoku/domain/const'

import { HELP_SUB_ROUTES, HelpSubRoute, ROUTE_KINDS, RouteBase, RouteKind } from './route.entity'

export class Page {
	static readonly #firstPattern = new RegExp(
		`^(?:(?:(${LANGS.join('|')}))|(?:(${ROUTE_KINDS.COMPOUND.join('|')})(?:\\/(.*))?))$`,
		'i'
	)

	static readonly #secondPattern = new RegExp(
		`^(${LANGS.join('|')})\\/(${ROUTE_KINDS.COMPOUND.join('|')})(?:\\/(.*))?$`,
		'i'
	)

	readonly #lang
	readonly #route
	constructor({ lang, route }: { lang?: Lang; route: RouteBase }) {
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
		try {
			const { lang, path, rest } = this.#getParts(str)

			if (path === RouteKind.Home) {
				if (rest != null && rest.length !== 0) throw new InvalidStringPageError()
				return new Page({ lang, route: RouteBase.createHome() })
			} else if (path === RouteKind.Help && (HELP_SUB_ROUTES.contains(rest) || rest == null))
				return new Page({ lang, route: RouteBase.createHelp(rest ?? HelpSubRoute.Main) })
			else if (path === RouteKind.Game) {
				const difficulty = rest == null || rest.length === 0 ? 'Basic' : capitalCase(rest)
				if (!DIFFICULTIES_NAMES.contains(difficulty)) throw new InvalidStringPageError()
				return new Page({ lang, route: RouteBase.createGame(difficulty) })
			}

			return new Page({ route: RouteBase.notFound(str) })
		} catch (err) {
			if (err instanceof InvalidStringPageError) return new Page({ route: RouteBase.notFound(str) })
			throw err
		}
	}

	static #getParts(str: string) {
		if (str === '') return { path: RouteKind.Home }
		const [, lang, path, rest] =
			this.#firstPattern.exec(str) ?? this.#secondPattern.exec(str) ?? _throw(new InvalidStringPageError())

		if (lang != null && !LANGS.contains(lang)) throw new InvalidStringPageError()
		if (path === '' || path == null) return { lang, path: RouteKind.Home, rest }
		if (!ROUTE_KINDS.COMPOUND.contains(path)) throw new InvalidStringPageError()

		return { lang: lang as Lang | undefined, path, rest }
	}

	toJSON() {
		return { lang: this.#lang, route: this.#route.toJSON() }
	}

	unwrap() {
		return { lang: this.#lang, route: this.#route }
	}

	with({ lang = this.#lang, route = this.#route }: { lang?: Lang; route?: RouteBase }) {
		return new Page({ lang, route })
	}
}
