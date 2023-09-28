/** valid numbers for notes or cell values. */
export type ValidNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type CellNotesData = Array<ValidNumbers | null>
export type CellNotesJSON = ValidNumbers[]

export interface INotes {
	/**
	 *	Add a note to the set.
	 * @param {ValidNumbers} num The note add (1 to 9).
	 */
	add(num: ValidNumbers): this
	/** remove all notes */
	clear(): this
	/** Get the current set of notes. */
	get data(): CellNotesData
	/** Checks if notes set is empty */
	get isEmpty(): boolean
	/**
	 * Remove a note to the set.
	 * @param {ValidNumbers} num The note remove (1 to 9).
	 */
	remove(num: ValidNumbers): this
	/** Converts Notes instance in JSON. */
	toJSON(): CellNotesJSON
	/** Converts Notes instance in num. */
	toNumber(): number
	/** Converts Notes instance to a string. */
	toString(): string
	/**
	 * Toggle a note in the set (add if not present, remove if present).
	 * @param {ValidNumbers} num - The note to toggle (1 to 9).
	 */
	toggle(num: ValidNumbers): this
}
