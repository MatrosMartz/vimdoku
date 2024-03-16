import { Page } from '$screen/domain/entities'
import { Solution } from '$sudoku/domain/entities'

import type { Action, DataAction, IMed, State } from '../models'

/** Represent a Mediator Service. */
export class MedSvc implements IMed {
	#hasLoaded = false
	readonly #i18n
	readonly #prefs
	#prev: Promise<void> | null = null
	readonly #screen
	readonly #sudoku

	/**
	 * Creates an instance of the MedSvc class.
	 * @param initialState An Object contains deps that the state manages.
	 */
	constructor({ i18n, prefs, screen, sudoku }: State) {
		this.#i18n = i18n
		this.#prefs = prefs
		this.#screen = screen
		this.#sudoku = sudoku
		void this.load()
	}

	dispatch<const Data extends DataAction | never>(action: Action<Data>, data?: Data) {
		const promise = async () => {
			await action({ i18n: this.#i18n, prefs: this.#prefs, screen: this.#screen, sudoku: this.#sudoku }, data!)
			this.#prev = null
		}

		this.#prev = this.#prev != null ? this.#prev.then(promise) : promise()

		return this
	}

	async load() {
		if (this.#hasLoaded) return
		await Promise.all([this.#prefs.load(), this.#sudoku.load()])
		if (this.#screen.lang != null) await this.#prefs.setByKey('language', this.#screen.lang).save()
		else this.#screen.setLang(this.#prefs.get('language'))
		await this.#i18n.changeLang(this.#prefs.get('language'))
		if (Page.isGame(this.#screen.route)) {
			if (this.#sudoku.isASaved) {
				await this.#sudoku.resume(this.#prefs.get('timer'))
				this.#screen.gotTo(Page.createGame(this.#sudoku.difficulty!))
			} else {
				await this.#sudoku.start(
					{ difficulty: this.#screen.route.difficulty, solution: Solution.create() },
					this.#prefs.get('timer')
				)
			}
		}
		this.#hasLoaded = true
	}
}
