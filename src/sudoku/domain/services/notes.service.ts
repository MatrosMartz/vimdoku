import { createArray, InvalidNoteError } from '~/share/utils'

import type { INotes, Notes, ValidNumbers } from '../models'

/** Represents a Sudoku Cell Notes Service. */
export class NotesService implements INotes {
	/** Represent the first 9 primes numbers. */
	static readonly #PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23]

	#data

	/**
	 * Creates an instance of the NotesService class.
	 * @param data Initial Sudoku cell notes.
	 */
	constructor(data: Notes) {
		this.#data = data
	}
	
		get data() {
			return structuredClone(this.#data)
		}

	get isEmpty() {
		return !this.#data.some(num => num != null)
	}

	/**
	 * Creates an instance of the NotesService.
	 * @param initialNotes Initial Sudoku cell notes (optional).
	 * @throws {InvalidBoardError} If `initialNotes` is not a valid array of numbers.
	 */
	static create(initialNotes?: ValidNumbers[]) {
		const value = Array(9).fill(null) as Notes
		if (initialNotes != null)
			for (const num of initialNotes) {
				if (num == null || num < 1 || num > 9) throw new InvalidNoteError(initialNotes)
				value[num - 1] = num
			}
		return new NotesService(value)
	}

	/**
	 * Creates an instance of the NotesService from a JSON string.
	 * @param notesLike number representation of notes.
	 * @throws {InvalidBoardError} If `solutionLike` is not a valid JSON string.
	 */
	static fromNumber(notesLike: number) {
		const notes = createArray(9, () => null as number | null)
		let numNotes = 0

		for (let i = 0; i < NotesService.#PRIMES.length; i++)
			if (numNotes % NotesService.#PRIMES[i] === 0) {
				notes[i] = 1 + i
				numNotes /= NotesService.#PRIMES[i]
			}

		if (numNotes !== 0)
			throw new InvalidNoteError(notes, `there is no note with the representation in primes: ${numNotes}`)

		return new NotesService(notes as Array<ValidNumbers | null>)
	}

	/**
	 * Creates an instance of the NotesService from a JSON string.
	 * @param notesLike JSON representation of notes.
	 * @throws {InvalidBoardError} If `solutionLike` is not a valid JSON string.
	 */
	static fromString(notesLike: string) {
		try {
			const notesJSON: ValidNumbers[] = JSON.parse(notesLike)
			const notes = createArray(9, () => null as ValidNumbers | null)

			for (const num of notesJSON)
				if (typeof num === 'number' || num > 0 || num < 9) notes[num - 1] = num
				else throw new InvalidNoteError(num)

			return new NotesService(notes)
		} catch (err) {
			throw err instanceof InvalidNoteError ? err : new InvalidNoteError(notesLike, err)
		}
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
		for (const note of this.#data) if (note != null) num *= NotesService.#PRIMES[note - 1]
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
