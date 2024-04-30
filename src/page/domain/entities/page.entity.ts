import type { RequireOne } from '~/share/types'
import { _throw, capitalCase, InvalidStringPageError } from '~/share/utils'
import { type Lang, LANGS } from '$i18n/domain/const'
import { Difficulty } from '$sudoku/domain/const'

import * as Modal from './modal.entity'
import * as Route from './route.entity'

export class Page {
	readonly #lang
	readonly #modal
	readonly #route
	constructor(modal: Modal.Modal, route: Route.Route, lang?: Lang) {
		this.#lang = lang
		this.#modal = modal
		this.#route = route
	}

	get lang() {
		return this.#lang
	}

	get modal() {
		return this.#modal
	}

	get route() {
		return this.#route
	}

	toJSON() {
		return { lang: this.#lang, modal: this.#modal.toJSON(), route: this.#route.toJSON() }
	}

	unwrap() {
		return { lang: this.#lang, modal: this.#modal, route: this.#route }
	}

	with({
		lang = this.#lang,
		modal = this.#modal,
		route = this.#route,
	}: RequireOne<{
		lang: Lang | undefined
		modal: Modal.Modal
		route: Route.Route
	}>) {
		return new Page(modal, route, lang)
	}
}

const firstPattern = new RegExp(
	`^(?:(?:(${LANGS.joinValues('|')}))|(?:(${Route.KINDS.subs.COMPOUND.joinValues('|')})(?:\\/(.*))?))$`,
	'i'
)

const secondPattern = new RegExp(
	`^(${LANGS.joinValues('|')})\\/(${Route.KINDS.subs.COMPOUND.joinValues('|')})(?:\\/(.*))?$`,
	'i'
)

/**
 * internal function to split a string url-like into language, path and remainder.
 * @param str URL-like.
 * @returns Object contains lang, path and remainder
 */
function getParts(str: string) {
	if (str === '') return { path: Route.Kind.Home }
	const [, lang, path, remainder] =
		firstPattern.exec(str) ?? secondPattern.exec(str) ?? _throw(new InvalidStringPageError())

	if (lang != null && !LANGS.containsValue(lang)) throw new InvalidStringPageError()
	if (path === '' || path == null) return { lang, path: Route.Kind.Home, remainder }
	if (!Route.KINDS.subs.COMPOUND.containsValue(path)) throw new InvalidStringPageError()

	return { lang: lang as Lang | undefined, path, remainder }
}

/**
 * creates new Page from string url-like.
 * @param str URL-like.
 * @returns new Page.
 */
export function fromString(str: string) {
	const modal = new Modal.None()
	try {
		const { lang, path, remainder } = getParts(str)

		if (path === Route.Kind.Home) {
			if (remainder != null && remainder.length !== 0) throw new InvalidStringPageError()
			return new Page(modal, new Route.Home(), lang)
		} else if (path === Route.Kind.Help && (Route.HELP_SUB.containsValue(remainder) || remainder == null))
			return new Page(modal, new Route.Help(remainder ?? Route.HelpSub.Main), lang)
		else if (path === Route.Kind.Game) {
			const difficulty = remainder == null || remainder.length === 0 ? 'Basic' : capitalCase(remainder)
			if (!Difficulty.KINDS.containsKey(difficulty)) throw new InvalidStringPageError()
			return new Page(modal, new Route.Game(difficulty), lang)
		}

		return new Page(modal, new Route.NotFound(str))
	} catch (err) {
		if (err instanceof InvalidStringPageError) return new Page(modal, new Route.NotFound(str))
		throw err
	}
}

export const IDLE = new Page(Modal.IDLE, Route.IDLE)
