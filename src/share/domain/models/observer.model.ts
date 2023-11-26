export type Obsr<T> = (data: T) => void

export interface IObs<T> {
	/** Get the current value of data. */
	readonly data: T
	/**
	 * Subscribe a new observer.
	 * @param observer The observer to be added.
	 */
	add(observer: Obsr<T>): void
	/**
	 * Unsubscribe an observer.
	 * @param observer The observer to be removed.
	 */
	remove(observer: Obsr<T>): void
	/**
	 * Updates all observer with the new data.
	 * @param data The new value of data.
	 */
	update(data: T): void
}

export interface IAsyncObs<T> extends IObs<T> {
	/**
	 * Update the current value data after the callback.
	 * @param cb The callback which returns the new value of the data.
	 */
	load(cb: () => Promise<T>): Promise<void>
}

export interface IHistoryObs<T> extends IAsyncObs<T> {
	/** Get the current value of the entire history. */
	readonly history: T[]
	/**
	 * Adds a new entry to the history and set the current data value to an empty state.
	 * @param data The new entry of the history.
	 */
	update(data: T): void
	/** Navigate backwards in history. */
	redo(): void
	/** Navigate forwards in history. */
	undo(): void
}

export type Store<State extends Record<string, IObs<unknown>>> = {
	[key in keyof State]: State[key]
}
