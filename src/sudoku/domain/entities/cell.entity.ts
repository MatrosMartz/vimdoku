import { Collection, Entity } from '~/share/domain/entities'
import { Case } from '~/share/utils'

import { Notes, type NotesData, type ValidNumbers } from './notes.entity'

export enum Kind {
	Correct = 'correct',
	Empty = 'empty',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Unverified = 'unverified',
	Annotated = 'notes',
}

export const KINDS = Collection.create()
	.addEntries(Collection.entriesByObj(Kind))
	.createSubCollection('INSERT', Case.array([Case.equalTo('Correct', 'Incorrect', 'Unverified'), Case.Any]))
	.done()

export const EMPTY_VALUE = 0

export interface JSON {
	kind: Kind
	notes: number
	value: number
}

export interface MoveData {
	notes: NotesData
	value: number
}

export interface MoveItem {
	next: MoveData
	prev: MoveData
}

export type MoveMap = Map<`${number}-${number}`, MoveItem>

export interface Data {
	/** Get the current kind of cell. */
	readonly kind: Kind
	/** Get the current data of cell notes. */
	notes: NotesData
	readonly solution: ValidNumbers
	/** Get the current value of cell. */
	value: number
}

export interface FromJSONOpts {
	cellLike: JSON
	solution: ValidNumbers
}

export interface CreateOpts {
	isInitial: boolean
	solution: ValidNumbers
}

interface Opts {
	notes: Notes
	readonly solution: ValidNumbers
	value: number
}

/** Represent a Sudoku Cell. */
abstract class Base extends Entity implements Data {
	protected _notes: Notes
	protected _solution: ValidNumbers
	protected _value: number
	abstract readonly isCorrect: boolean
	abstract readonly kind: Kind

	/**
	 * Creates an instance of CellState class.
	 * @param data Kind, notes, solution, pos and value for cell.
	 */
	constructor(data: Opts) {
		super()
		this._notes = data.notes
		this._solution = data.solution
		this._value = data.value
	}

	get notes() {
		return this._notes.data
	}

	get notesNumber() {
		return this._notes.toNumber()
	}

	get solution() {
		return this._solution
	}

	get value() {
		return this._value
	}

	/**
	 * Add a note in the Notes class.
	 * @param num The note to remove (1-9).
	 * @returns The updated cell state.
	 */
	addNote(num: ValidNumbers): Cell {
		return this
	}

	/**
	 * Create a new cell from the given move.
	 * @param sudokuMove The move.
	 * @returns The new cell.
	 */
	changeByMove(sudokuMove: MoveData): Cell {
		return this
	}

	/**
	 * Remove value and clear note set.
	 * @returns The updated cell state.
	 */
	clear(): Cell {
		return this
	}

	/**
	 * Remove a note in the Notes class.
	 * @param num The note to remove (1-9).
	 * @returns The updated cell state.
	 */
	removeNote(num: ValidNumbers): Cell {
		return this
	}

	toJSON(): JSON {
		return { kind: this.kind, notes: this.notesNumber, value: this.value }
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	/**
	 * Toggle a note in the Notes class (add if not present, remove if present).
	 * @param num The note to toggle (1-9).
	 * @returns The updated cell state.
	 */
	toggleNote(num: ValidNumbers): Cell {
		return this
	}

	/**
	 * Change kind if value is the correct or incorrect.
	 * @param effect The effect function.
	 * @returns The updated cell state.
	 */
	verify(effect: (isIncorrect: boolean) => void): Cell {
		return this
	}

	/**
	 * Toggle a cell value (add if not present, remove if present).
	 * @param num The note add (1-9).
	 * @returns The updated cell state.
	 */
	writeValue(num: ValidNumbers): Cell {
		return this
	}
}

export class Initial extends Base {
	readonly isCorrect = true

	get kind() {
		return Kind.Initial
	}
}

abstract class Writable extends Base {
	addNote(num: ValidNumbers): Cell {
		if (this._notes.has(num)) return this

		return new Annotated({ notes: this._notes.add(num), solution: this._solution, value: EMPTY_VALUE })
	}

	changeByMove(sudokuMove: MoveData): Cell {
		const notes = new Notes(sudokuMove.notes)

		const data: Opts = { notes, solution: this.solution, value: sudokuMove.value }
		if (!notes.isEmpty) return new Annotated(data)
		if (sudokuMove.value > EMPTY_VALUE) return new Unverified(data)
		return new Empty(data)
	}

	clear() {
		return new Empty({ notes: this._notes.clear(), solution: this._solution, value: EMPTY_VALUE })
	}

	toggleNote(num: ValidNumbers): Cell {
		return this.addNote(num)
	}

	writeValue(num: ValidNumbers): Cell {
		if (this._value === num) return this

		return new Unverified({ notes: this._notes.clear(), solution: this._solution, value: num })
	}
}

export class Unverified extends Writable {
	get isCorrect() {
		return this.value === this.solution
	}

	get kind() {
		return Kind.Unverified
	}

	verify(effect: (isIncorrect: boolean) => void) {
		effect(!this.isCorrect)

		return this.isCorrect
			? new Correct({ notes: this._notes, solution: this._solution, value: this._value })
			: new Incorrect({ notes: this._notes, solution: this._solution, value: this._value })
	}
}

export class Empty extends Writable {
	readonly isCorrect = false

	get kind() {
		return Kind.Empty
	}

	clear() {
		return this
	}
}

export class Correct extends Writable {
	readonly isCorrect = true

	get kind() {
		return Kind.Correct
	}
}

export class Incorrect extends Writable {
	readonly isCorrect = false

	get kind() {
		return Kind.Incorrect
	}
}

class Annotated extends Writable {
	readonly isCorrect = false

	get kind() {
		return Kind.Annotated
	}

	removeNote(num: ValidNumbers): Cell {
		if (!this._notes.has(num)) return this

		const notes = this._notes.remove(num)

		return notes.isEmpty
			? new Empty({ notes, solution: this._solution, value: this._value })
			: new Annotated({ notes, solution: this._solution, value: this._value })
	}

	toggleNote(num: ValidNumbers): Cell {
		const notes = this._notes.toggle(num)

		return notes.isEmpty
			? new Empty({ notes, solution: this._solution, value: this._value })
			: new Annotated({ notes, solution: this._solution, value: this._value })
	}
}

export type Cell = Correct | Empty | Incorrect | Initial | Unverified | Annotated | Base

/**
 * Create an instance of CellSvc with options.
 * @param opts Options for create cell (optional).
 * @returns New Cell
 */
export function create(opts: CreateOpts): Cell
// eslint-disable-next-line jsdoc/require-jsdoc
export function create({ isInitial, solution }: CreateOpts) {
	const baseData: Omit<Opts, 'value'> = { notes: Notes.create(), solution }

	return isInitial ? new Initial({ ...baseData, value: solution }) : new Empty({ ...baseData, value: EMPTY_VALUE })
}

/**
 * Create an instance of BoardSvc from a JSON string
 * @param opts JSON representation and solution for cell.
 * @returns new Cell
 */
export function fromJSON(opts: FromJSONOpts): Cell
// eslint-disable-next-line jsdoc/require-jsdoc
export function fromJSON({ cellLike: { kind, notes, value }, solution }: FromJSONOpts) {
	const data: Opts = { solution, value, notes: Notes.fromNumber(notes) }
	if (kind === Kind.Correct) return new Correct(data)
	if (kind === Kind.Empty) return new Empty(data)
	if (kind === Kind.Incorrect) return new Incorrect(data)
	if (kind === Kind.Initial) return new Initial(data)
	if (kind === Kind.Unverified) return new Unverified(data)
	if (kind === Kind.Annotated) return new Annotated(data)
	throw new Error('kind is invalid')
}
