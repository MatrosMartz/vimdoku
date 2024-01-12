import { Entity } from '~/share/domain/entities'
import { createArray, InvalidNoteError } from '~/share/utils'

import { type NotesData, type NotesJSON, PRIMES, type ValidNumbers } from '../models'

/** Represents a Sudoku Cell Notes Service. */
export class Notes extends Entity {
	readonly #data

	/**
	 * Creates an instance of the NotesSvc class.
	 * @param data Initial Sudoku cell notes.
	 */
	constructor(data: NotesData) {
		super()

		this.#data = data
	}

	/** Get the current set of notes. */
	get data() {
		return structuredClone(this.#data)
	}

	/** Checks if notes set is empty */
	get isEmpty() {
		return !this.#data.some(num => num != null)
	}

	/**
	 * Creates an instance of the NotesSvc.
	 * @param initialNotes Initial Sudoku cell notes (optional).
	 * @throws {InvalidBoardError} If `initialNotes` is not a valid array of numbers.
	 */
	static create(initialNotes?: ValidNumbers[]) {
		const value = Array(9).fill(null) as NotesData
		if (initialNotes != null)
			for (const num of initialNotes) {
				if (num == null || num < 1 || num > 9) throw new InvalidNoteError(initialNotes)
				value[num - 1] = num
			}
		return new Notes(value)
	}

	/**
	 * Creates an instance of the NotesSvc from a JSON string.
	 * @param notesLike number representation of notes.
	 * @throws {InvalidBoardError} If `solutionLike` is not a valid JSON string.
	 */
	static fromNumber(notesLike: number) {
		const notes = createArray(9, (): ValidNumbers | null => null)

		for (let i = 0; i < PRIMES.length; i++)
			if (notesLike % PRIMES[i] === 0) {
				notes[i] = (1 + i) as ValidNumbers
				notesLike /= PRIMES[i]
			}

		if (notesLike !== 1)
			throw new InvalidNoteError(notes, `there is no note with the representation in primes: ${notesLike}`)

		return new Notes(notes)
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

			return new Notes(notes)
		} catch (err) {
			throw err instanceof InvalidNoteError ? err : new InvalidNoteError(notesLike, err)
		}
	}

	/**
	 *	Add a note to the set.
	 * @param num The note add (1-9).
	 */
	add(num: ValidNumbers) {
		if (this.has(num)) return this

		const newData = structuredClone(this.#data)
		newData[num - 1] = num
		return new Notes(newData)
	}

	/** remove all notes */
	clear() {
		return this.isEmpty ? this : new Notes(createArray(9, () => null))
	}

	/**
	 * Return a copy of Notes.
	 * @returns A new notes object with the same data.
	 */
	copy() {
		return new Notes(structuredClone(this.data))
	}

	/**
	 * Check if it contains the note.
	 * @param num The note to be checked (1-9).
	 */
	has(num: ValidNumbers) {
		return this.#data[num - 1] != null
	}

	/**
	 * Remove a note to the set.
	 * @param num The note remove (1-9).
	 */
	remove(num: ValidNumbers) {
		if (!this.has(num)) return this

		const newData = structuredClone(this.#data)
		newData[num - 1] = null
		return new Notes(newData)
	}

	/** Converts Notes instance in JSON. */
	toJSON() {
		return this.#data.filter((val): val is ValidNumbers => val != null) as NotesJSON
	}

	/** Converts Notes instance to a number. */
	toNumber() {
		return this.#data.reduce((acc: number, curr) => (curr != null ? acc * PRIMES[curr - 1] : acc), 1)
	}

	/** Converts Notes instance to a string. */
	toString() {
		return JSON.stringify(this.toJSON())
	}

	/**
	 * Toggle a note in the set (add if not present, remove if present).
	 * @param num The note to toggle (1-9).
	 */
	toggle(num: ValidNumbers) {
		return this.has(num) ? this.remove(num) : this.add(num)
	}
}
