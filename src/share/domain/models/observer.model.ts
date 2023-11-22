export type Observer<T> = (value: T) => void

export type RemoveObserver = () => void

export interface IObservable<T> {
	/**
	 * Subscribe a new observer.
	 * @param observer The observer to be added.
	 */
	add(observer: Observer<T>): void
	/**
	 * Unsubscribe an observer.
	 * @param observer The observer to be removed.
	 */
	remove(observer: Observer<T>): void
	/**
	 * Updates all observer with the new value.
	 * @param value The new value.
	 */
	update(value: T): void
}

export interface IContext<T> {
	/** Get the current value of data. */
	readonly data: T
	/**
	 * Update the current value data.
	 * @param data The new value of data.
	 */
	push(data: T): void
}

export interface IAsyncContext<T> extends IContext<T> {
	/**
	 * Update the current value data after the callback.
	 * @param cb The callback which returns the new value of the data.
	 */
	load(cb: () => Promise<T>): Promise<void>
}

export interface IHistoryContext<T> extends IAsyncContext<T> {
	/** Get the current value of the entire history. */
	readonly history: T[]
	/**
	 * Adds a new entry to the history and set the current data value to an empty state.
	 * @param data The new entry of the history.
	 */
	push(data: T): void
	/** Navigate backwards in history. */
	redo(): void
	/** Navigate forwards in history. */
	undo(): void
}

export type Store<State extends Record<string, IContext<unknown>>> = {
	[key in keyof State]: State[key]
}
