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
	}

	remove(observer: Obsr<T>) {
		this.#observers.delete(observer)
	}

	update(data: T) {
		this.#data = data
		for (const sub of this.#observers) sub(data)
	}
}

/** Represent a History Observable Service */
export class HistoryObsSvc<T> extends ObsSvc<T> implements IHistoryObs<T> {
	#cursor: number
	readonly #emptyState: T
	readonly #history: T[]

	/**
	 * Creates an instance of the HistoryObservableSvc class.
	 * @param emptyState The value that will represent empty state.
	 * @param history Optional history with which the context is to be created.
	 */
	constructor(emptyState: T, history: T[] = []) {
		super(emptyState)
		this.#emptyState = emptyState
		this.#history = history
		this.#cursor = this.#history.length
	}

	get history() {
		return [...this.#history]
	}

	redo(): void {
		if (this.#cursor < this.#history.length) this.#cursor++
		super.update(this.data)
	}

	undo(): void {
		if (this.#cursor > 0) this.#cursor--
		super.update(this.data)
	}

	update(data: T): void {
		this.#history.push(data)
		super.update(this.#emptyState)
	}
}
