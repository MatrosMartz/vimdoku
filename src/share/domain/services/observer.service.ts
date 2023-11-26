import type { IAsyncContext, IContext, IHistoryContext, IObservable, Observer } from '../models'

export class Observable<T> implements IObservable<T> {
	readonly #observers = new Set<Observer<T>>()

	add(observer: Observer<T>) {
		this.#observers.add(observer)
	}

	remove(observer: Observer<T>) {
		this.#observers.delete(observer)
	}

	update(data: T) {
		for (const sub of this.#observers) sub(data)
	}
}

/** Simulated key for protected field. */
const observableKey = Symbol('observable')

/** Represent a Context Service */
export class ContextSvc<T> implements IContext<T> {
	protected [observableKey]: IObservable<T>
	#data: T

	/**
	 * Creates an instance of the ContextSvc class.
	 * @param observable Subscriptions Handler.
	 * @param initialData The value with which the context is to be created.
	 */
	constructor(observable: IObservable<T>, initialData: T) {
		this.#data = initialData
		this[observableKey] = observable
	}

	get data() {
		return this.#data
	}

	push(data: T): void {
		this.#data = data
		this[observableKey].update(data)
	}
}

/** Represent a Async Context Service */
export class AsyncContextSvc<T> extends ContextSvc<T> implements IAsyncContext<T> {
	async load(cb: () => Promise<T>): Promise<void> {
		this.push(await cb())
	}
}

/** Represent a History Context Service */
export class HistoryContextSvc<T> extends AsyncContextSvc<T> implements IHistoryContext<T> {
	#cursor: number
	readonly #emptyState: T
	readonly #history: T[]

	/**
	 * Creates an instance of the HistoryContextSvc class.
	 * @param observable Subscriptions Handler.
	 * @param emptyState The value that will represent empty state.
	 * @param history Optional history with which the context is to be created.
	 */
	constructor(observable: IObservable<T>, emptyState: T, history: T[] = []) {
		super(observable, emptyState)
		this.#emptyState = emptyState
		this.#history = history
		this.#cursor = this.#history.length
	}

	get history() {
		return [...this.#history]
	}

	push(data: T): void {
		this.#history.push(data)
		super.push(this.#emptyState)
	}

	redo(): void {
		if (this.#cursor < this.#history.length) this.#cursor++
		super.push(this.data)
	}

	undo(): void {
		if (this.#cursor > 0) this.#cursor--
		super.push(this.data)
	}
}
