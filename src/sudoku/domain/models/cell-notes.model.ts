import { createArray, InvalidNoteError } from '~/utils'

/** valid numbers for notes or cell values. */
export type ValidNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type CellNotesData = Array<ValidNumbers | null>
export type CellNotesJSON = ValidNumbers[]

export interface ICellNotes {
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
	/** Converts Notes instance to a string. */
	toString(): string
	/**
	 * Toggle a note in the set (add if not present, remove if present).
	 * @param {ValidNumbers} num - The note to toggle (1 to 9).
	 */
	toggle(num: ValidNumbers): this
}

/** Represents a Sudoku cell notes. */
export class CellNotes implements ICellNotes {
	#data

	/**
	 * Creates an instance of the Notes class.
	 * @param {CellNotesData} data Initial Sudoku cell notes (optional).
	 */
	constructor(data: CellNotesData) {
		this.#data = data
	}

	get data() {
		return structuredClone(this.#data)
	}

	get isEmpty() {
		return !this.#data.some(num => num != null)
	}

	/**
	 * Create an instance of the Notes class.
	 * @param {ValidNumbers[]} [initialNotes] Initial Sudoku cell notes (optional).
	 * @throws {InvalidBoardError} If `initialNotes` is not a valid array of numbers.
	 */
	static create(initialNotes?: ValidNumbers[]) {
		const value = Array(9).fill(null) as CellNotesData
		if (initialNotes != null)
			for (const num of initialNotes) {
				if (num == null || num < 1 || num > 9) throw new InvalidNoteError(initialNotes)
				value[num - 1] = num
			}
		return new CellNotes(value)
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
			return new CellNotes(initNotes)
		}
		throw new InvalidNoteError(noteLike)
	}

	add(num: ValidNumbers) {
		this.#data[num - 1] = num
		return this
	}

	clear() {
		this.#data = createArray(9, () => null)
		return this
	}

	remove(num: ValidNumbers) {
		this.#data[num - 1] = null
		return this
	}

	toJSON() {
		return this.data.filter((val): val is ValidNumbers => val != null)
	}

	toString() {
		return JSON.stringify(this.#data)
	}

	toggle(num: ValidNumbers) {
		if (this.#data[num - 1] == null) this.add(num)
		else this.remove(num)
		return this
	}
}
