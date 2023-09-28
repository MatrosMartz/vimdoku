import { createArray, InvalidNoteError } from '~/utils'

/** valid numbers for notes or cell values. */
export type ValidNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type CellNotesData = Array<ValidNumbers | null>
export type CellNotesJSON = ValidNumbers[]

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23]

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
	 * @param {string} notesLike JSON representation of notes.
	 * @throws {InvalidBoardError} If `solutionLike` is not a valid JSON string.
	 * @example
	 * const notesJSON = JSON.stringify(notesInstance)
	 * const newNotesInstance = Notes.from(notesJSON)
	 */
	static from(notesLike: string | number) {
		const notes = createArray<number | null>(9, () => null)
		let numNotes = 0

		if (typeof notesLike === 'string') numNotes = Number(notesLike)
		else if (typeof notesLike === 'number') numNotes = notesLike

		if (Number.isNaN(numNotes) || numNotes === 0) throw new InvalidNoteError(notesLike)

		for (let i = 0; i < primes.length; i++) if (numNotes % primes[i] === 0) notes[i] = 1 + i

		return new CellNotes(notes as Array<ValidNumbers | null>)
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
		return this.#data.filter((val): val is ValidNumbers => val != null)
	}

	toNumber() {
		let num = 1
		for (const note of this.#data) if (note != null) num *= primes[note - 1]
		return num
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggle(num: ValidNumbers) {
		if (this.#data[num - 1] == null) this.add(num)
		else this.remove(num)
		return this
	}
}
