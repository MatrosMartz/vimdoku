export type Observer<T> = (data: T) => void

/** Represent a Observable Service */
export class Observable<T> {
	#data: T
	readonly #observers = new Set<Observer<T>>()

	/**
	 * Creates an instance of the ObservableSvc class.
	 * @param initialData The value with which the observable is to be created.
	 */
	constructor(initialData: T) {
		this.#data = initialData
	}

	/** Get the current value of data. */
	get data() {
		return this.#data
	}

	/**
	 * Subscribe a new observer.
	 * @param observer The observer to be added.
	 */
	add(observer: Observer<T>) {
		this.#observers.add(observer)
		observer(this.#data)
		return this
	}

	/**
	 * Unsubscribe an observer.
	 * @param observer The observer to be removed.
	 */
	remove(observer: Observer<T>) {
		this.#observers.delete(observer)
		return this
	}

	/**
	 * Set all observer with the new data.
	 * @param data The new value of data.
	 */
	set(data: T) {
		this.#data = data
		for (const sub of this.#observers) sub(data)
		return this
	}

	/**
	 * Transforms and updates the previous data
	 * @param updater The function that updates the data.
	 */
	update(updater: (data: T) => T) {
		return this.set(updater(this.#data))
	}
}

/** Represent a History Observable Service */
export class HistoryObservable<T> extends Observable<T> {
	#cursor: number
	readonly #emptyState: T
	readonly #history: T[]
	#length: number

	/**
	 * Creates an instance of the HistoryObservableSvc class.
	 * @param emptyState The value that will represent empty state.
	 * @param history Optional history with which the context is to be created.
	 */
	constructor(emptyState: T, length: number, history: T[]) {
		super(emptyState)
		this.#emptyState = emptyState
		this.#length = length
		this.#history = history
		this.#cursor = this.history.length
		this.trunc()
	}

	/** Get the current value of the entire history. */
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

	/**
	 * Truncates the history based on the cursor and updates based on it.
	 * @param data The new entry of the history.
	 */
	overwrite(data: T) {
		return this.trunc().push(data)
	}

	/**
	 * Adds a new entry to the history and set the current data value to an empty state.
	 * @param data The new entry of the history.
	 */
	push(data: T) {
		const hasExceed = this.#length - this.#history.length <= 0

		if (hasExceed) this.#history.shift()

		this.#history.push(data)
		super.set(this.#emptyState)

		this.#cursor = this.#history.length

		return this
	}

	/** Navigate backwards in history. */
	redo() {
		if (this.#cursor < this.#history.length) {
			this.#cursor++
			super.set(this.#history[this.#cursor] ?? this.#emptyState)
		}
		return this
	}

	/** Truncates the history based on the cursor */
	trunc() {
		if (this.#history.length > this.#cursor) this.#history.length = this.#cursor

		return this
	}

	/** Navigate forwards in history. */
	undo() {
		if (this.#cursor > 0) {
			this.#cursor--
			super.set(this.#history[this.#cursor])
		}
		return this
	}
}
