import type { IAsyncContext, IContext, IHistoryContext, IObservable, Observer } from '../models'

export class Observable<T> implements IObservable<T> {
	#observers = new Set<Observer<T>>()

	add(sub: Observer<T>) {
		this.#observers.add(sub)
	}

	remove(sub: Observer<T>) {
		this.#observers.delete(sub)
	}

	update(data: T) {
		for (const sub of this.#observers) sub(data)
	}
}

/** Simulated key for protected field. */
const observableKey = Symbol('observable')

export class Context<T> implements IContext<T> {
	protected [observableKey]: IObservable<T>
	#data: T

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

export class AsyncContext<T> extends Context<T> implements IAsyncContext<T> {
	async load(cb: () => Promise<T>): Promise<void> {
		this.push(await cb())
	}
}

export class HistoryContext<T> extends AsyncContext<T> implements IHistoryContext<T> {
	#cursor: number
	#history: T[]

	constructor(observable: IObservable<T>, initialData: T, history: T[] = []) {
		super(observable, initialData)
		this.#history = history
		this.#cursor = this.#history.length
	}

	get history() {
		return [...this.#history]
	}

	push(data: T): void {
		this.#history.push(data)
		super.push(data)
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
