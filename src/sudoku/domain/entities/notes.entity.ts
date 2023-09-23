import { InvalidNoteError } from '~/utils'

/** valid numbers for Notes. */
export type NoteNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type NoteValue = Array<NoteNumbers | null>
export type NoteJSON = NoteNumbers[]

export interface NotesInitOpts {
	/** Initial Sudoku cell notes (optional). */
	initNotes?: NoteNumbers[]
}

export interface INotes {
	/**
	 *	Add a note to the set.
	 * @param {NoteNumbers} num The note add (1 to 9).
	 */
	add(num: NoteNumbers): void
	/**
	 * Remove a note to the set.
	 * @param {NoteNumbers} num The note remove (1 to 9).
	 */
	remove(num: NoteNumbers): void
	/** Convert Notes instance in JSON. */
	toJSON(): NoteJSON
	/** Convert the Notes instance to a string. */
	toString(): string
	/**
	 * Toggle a note in the set (add if not present, remove if present).
	 * @param {NoteNumbers} num - The note to toggle (1 to 9).
	 */
	toggle(num: NoteNumbers): void
	/** Get the current set of notes. */
	get value(): NoteValue
}

/** Represent a Sudoku cell notes. */
export class Notes implements INotes {
	#value: NoteValue

	/**
	 * Creates an instance of the Notes class.
	 * @throws {InvalidNoteError} If `opts.initNotes` is invalid.
	 */
	constructor(opts?: NotesInitOpts)
	constructor({ initNotes }: NotesInitOpts = {}) {
		this.#value = Array(9).fill(null)
		if (initNotes != null)
			for (const num of initNotes) {
				if (num == null || num < 1 || num > 9) throw new InvalidNoteError(initNotes)
				this.#value[num - 1] = num
			}
	}

	get value() {
		return structuredClone(this.#value)
	}

	/**
	 * Create instance of Notes class from a JSON string.
	 * @param {string} noteLike JSON representation of notes.
	 * @throws {InvalidBoardError} If `solutionLike` is not a valid JSON string.
	 * @example
	 * const notesJSON = JSON.stringify(notesInstance)
	 * const newNotesInstance = Notes.from(notesJSON)
	 */
	static from(noteLike: string) {
		if (typeof noteLike === 'string') {
			const initNotes = JSON.parse(noteLike)
			return new Notes({ initNotes })
		}
		throw new InvalidNoteError(noteLike)
	}

	add(num: NoteNumbers) {
		this.#value[num - 1] = num
	}

	remove(num: NoteNumbers) {
		this.#value[num - 1] = null
	}

	toJSON() {
		return this.value.filter(val => val != null) as NoteJSON
	}

	toString() {
		return JSON.stringify(this.#value)
	}

	toggle(num: NoteNumbers) {
		if (this.#value[num - 1] == null) this.add(num)
		else this.remove(num)
	}
}
