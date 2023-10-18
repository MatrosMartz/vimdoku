import type { Tuple } from '~/share/types'

/** valid numbers for notes or cell values. */
export type ValidNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Notes = Tuple<ValidNumbers | null, 9>
export type NotesJSON = Tuple<ValidNumbers, 9>

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
	 * Return a copy of Notes.
	 * @returns A new notes object with the same data.
	 */
	copy(): INotes
	/**
	 * Remove a note to the set.
	 * @param num The note remove (1-9).
	 */
	remove(num: ValidNumbers): this
	/** Converts Notes instance in JSON. */
	toJSON(): NotesJSON
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
