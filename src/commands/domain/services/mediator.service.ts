import { Route } from '$screen/domain/entities'
import { DifficultyKind, GET_DIFFICULTY_NAME } from '$sudoku/domain/const'
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
		await Promise.all([this.#prefs.load(), this.#sudoku.load(), this.#screen.load()])
		await this.#i18n.load(this.#screen.route)
		if (Route.isGame(this.#screen.route)) {
			if (this.#sudoku.isASaved) {
				await this.#sudoku.resume(this.#prefs.get('timer'))
				await this.#screen.gotTo(Route.createGame(GET_DIFFICULTY_NAME[this.#sudoku.difficulty!]))
			} else {
				await this.#sudoku.start(
					{ difficulty: DifficultyKind[this.#screen.route.subRoute], solution: Solution.create() },
					this.#prefs.get('timer')
				)
			}
		}
		this.#sudoku.difficulty!

		this.#hasLoaded = true
	}

	async unload() {
		await Promise.all([this.#screen.unload()])
	}
}
