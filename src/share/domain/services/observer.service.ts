import type { IHistoryObs, IObs, Obsr } from '../models'

/** Represent a Observable Service */
export class ObsSvc<T> implements IObs<T> {
	#data: T
	readonly #observers = new Set<Obsr<T>>()

	/**
	 * Creates an instance of the ObservableSvc class.
	 * @param initialData The value with which the observable is to be created.
	 */
	constructor(initialData: T) {
		this.#data = initialData
	}

	get data() {
		return this.#data
	}

	add(observer: Obsr<T>) {
		this.#observers.add(observer)
		observer(this.#data)
		return this
	}

	remove(observer: Obsr<T>) {
		this.#observers.delete(observer)
		return this
	}

	update(data: T) {
		this.#data = data
		for (const sub of this.#observers) sub(data)
		return this
	}
}

/** Represent a History Observable Service */
export class HistoryObsSvc<T> extends ObsSvc<T> implements IHistoryObs<T> {
	#cursor: number
	readonly #emptyState: T
	readonly #history: T[]
	#length

	/**
	 * Creates an instance of the HistoryObservableSvc class.
	 * @param emptyState The value that will represent empty state.
	 * @param history Optional history with which the context is to be created.
	 */
	constructor(emptyState: T, history: T[] = [], length: number) {
		super(emptyState)
		this.#emptyState = emptyState
		this.#history = history
		this.#cursor = this.#history.length
		this.#length = length
	}

	get history() {
		return [...this.#history]
	}

	get length() {
		return this.#length
	}

	set length(length: number) {
		this.#length = length
		if (this.#history.length > length) this.#history.length = length
	}

	redo() {
		if (this.#cursor < this.#history.length) this.#cursor++
		super.update(this.data)
		return this
	}

	rewrite(data: T) {
		return this.#trunc().update(this.#emptyState)
	}

	undo() {
		if (this.#cursor > 0) this.#cursor--
		super.update(this.data)
		return this
	}

	update(data: T) {
		this.#history.push(data)
		super.update(this.#emptyState)

		const exceeds = this.#length - this.#history.length

		if (exceeds <= 0) return this

		this.#history.splice(0, exceeds)

		return this
	}

	#trunc() {
		if (this.#history.length > this.#cursor) this.#history.length = this.#cursor

		return this
	}
}
