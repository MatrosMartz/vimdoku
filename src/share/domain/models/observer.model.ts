export type Obsr<T> = (data: T) => void

export interface IObs<T> {
	/** Get the current value of data. */
	readonly data: T
	/**
	 * Subscribe a new observer.
	 * @param observer The observer to be added.
	 */
	add(observer: Obsr<T>): this
	/**
	 * Unsubscribe an observer.
	 * @param observer The observer to be removed.
	 */
	remove(observer: Obsr<T>): this
	/**
	 * Updates all observer with the new data.
	 * @param data The new value of data.
	 */
	update(data: T): this
}

export interface IHistoryObs<T> extends IObs<T> {
	/** Get the current value of the entire history. */
	readonly history: T[]
	length: number
	/** Navigate backwards in history. */
	redo(): this
	/**
	 * Truncates the history based on the index and updates based on it.
	 * @param data The new entry of the history.
	 */
	rewrite(data: T): this
	/** Navigate forwards in history. */
	undo(): this
	/**
	 * Adds a new entry to the history and set the current data value to an empty state.
	 * @param data The new entry of the history.
	 */
	update(data: T): this
}
