import type { Action, DataAction, IMed, State } from '../models'

/** Represent a Mediator Service. */
export class MedSvc implements IMed {
	#hasLoaded = false
	#prev: Promise<void> | null = null
	readonly #state: State

	/**
	 * Creates an instance of the MedSvc class.
	 * @param initialState An Object contains deps that the state manages.
	 */
	constructor(initialState: State) {
		this.#state = initialState
		void this.load()
	}

	dispatch<const Data extends DataAction | never>(action: Action<Data>, data?: Data) {
		const promise = async () => {
			await action(this.#state, data!)
			this.#prev = null
		}

		this.#prev = this.#prev != null ? this.#prev.then(promise) : promise()

		return this
	}

	async load() {
		if (this.#hasLoaded) return
		await Promise.all([this.#state.prefs.load(), this.#state.sudoku.load()])
		await this.#state.i18n.changeLang(this.#state.prefs.data.language)
		this.#hasLoaded = true
	}
}
