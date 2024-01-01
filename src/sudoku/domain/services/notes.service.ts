import { Entity } from '~/share/domain/services'
import { createArray, InvalidNoteError } from '~/share/utils'

import type { INotes, Notes, NotesJSON, ValidNumbers } from '../models'

/** Represents a Sudoku Cell Notes Service. */
export class NotesSvc extends Entity implements INotes {
	/** Represent the first 9 primes numbers. */
	static readonly #PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23]

	readonly #data

	/**
	 * Creates an instance of the NotesSvc class.
	 * @param data Initial Sudoku cell notes.
	 */
	constructor(data: Notes) {
		super()

		this.#data = data
	}

	get data() {
		return structuredClone(this.#data)
	}

	get isEmpty() {
		return !this.#data.some(num => num != null)
	}

	/**
	 * Creates an instance of the NotesSvc.
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
		return new NotesSvc(value)
	}

	/**
	 * Creates an instance of the NotesSvc from a JSON string.
	 * @param notesLike number representation of notes.
	 * @throws {InvalidBoardError} If `solutionLike` is not a valid JSON string.
	 */
	static fromNumber(notesLike: number) {
		const notes = createArray(9, (): ValidNumbers | null => null)

		for (let i = 0; i < NotesSvc.#PRIMES.length; i++)
			if (notesLike % NotesSvc.#PRIMES[i] === 0) {
				notes[i] = (1 + i) as ValidNumbers
				notesLike /= NotesSvc.#PRIMES[i]
			}

		if (notesLike !== 1)
			throw new InvalidNoteError(notes, `there is no note with the representation in primes: ${notesLike}`)

		return new NotesSvc(notes)
	}

	/**
	 * Creates an instance of the NotesSvc from a JSON string.
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

			return new NotesSvc(notes)
		} catch (err) {
			throw err instanceof InvalidNoteError ? err : new InvalidNoteError(notesLike, err)
		}
	}

	add(num: ValidNumbers) {
		if (this.has(num)) return this

		const newData = structuredClone(this.#data)
		newData[num - 1] = num
		return new NotesSvc(newData)
	}

	clear() {
		return this.isEmpty ? this : new NotesSvc(createArray(9, () => null))
	}

	copy() {
		return new NotesSvc(structuredClone(this.data))
	}

	has(num: ValidNumbers) {
		return this.#data[num - 1] != null
	}

	remove(num: ValidNumbers) {
		if (!this.has(num)) return this

		const newData = structuredClone(this.#data)
		newData[num - 1] = null
		return new NotesSvc(newData)
	}

	toJSON() {
		return this.#data.filter((val): val is ValidNumbers => val != null) as NotesJSON
	}

	toNumber() {
		let num = 1
		for (const note of this.#data) if (note != null) num *= NotesSvc.#PRIMES[note - 1]
		return num
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggle(num: ValidNumbers) {
		return this.has(num) ? this.remove(num) : this.add(num)
	}
}
