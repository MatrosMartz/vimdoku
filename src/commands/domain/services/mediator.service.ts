import type { Action, DataAction, IMed, State } from '../models'

/** Represent a Mediator Service. */
export class MedSvc implements IMed {
	#hasLoaded = false
	#state: State

	/**
	 * Creates an instance of the MedSvc class.
	 * @param initialState An Object contains deps that the state manages.
	 */
	constructor(initialState: State) {
		this.#state = initialState
		void this.load()
	}

	dispatch<const Data extends DataAction | never>(action: Action<Data>, data?: Data) {
		void (async () => (this.#state = await action(this.#state, data!)))()

		return this
	}

	async load() {
		if (this.#hasLoaded) return
		await Promise.all([this.#state.prefs.load(), this.#state.game.load()])
		await this.#state.i18n.changeLang(this.#state.prefs.data.language)
		this.#hasLoaded = true
	}
}
