/** valid numbers for notes or cell values. */
export type ValidNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Notes = Array<ValidNumbers | null>
export type CellNotesJSON = ValidNumbers[]

export interface INotes {
	/** Get the current set of notes. */
	readonly data: Notes
	/** Checks if notes set is empty */
	readonly isEmpty: boolean
	/**
	 *	Add a note to the set.
	 * @param num The note add (1-9).
	 */
	add(num: ValidNumbers): this
	/** remove all notes */
	clear(): this
	/**
	 * Remove a note to the set.
	 * @param num The note remove (1-9).
	 */
	remove(num: ValidNumbers): this
	/** Converts Notes instance in JSON. */
	toJSON(): CellNotesJSON
	/** Converts Notes instance to a number. */
	toNumber(): number
	/** Converts Notes instance to a string. */
	toString(): string
	/**
	 * Toggle a note in the set (add if not present, remove if present).
	 * @param num The note to toggle (1-9).
	 */
	toggle(num: ValidNumbers): this
}
