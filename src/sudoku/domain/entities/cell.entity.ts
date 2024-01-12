import { Entity } from '~/share/domain/entities'
import { match } from '~/share/utils'

import { type CellJSON, CellKind, EMPTY_CELL_VALUE, type MoveData, type NotesData, type ValidNumbers } from '../models'
import { Notes } from './notes.entity'

export interface CellData {
	/** Get the current kind of cell. */
	readonly kind: CellKind
	/** Get the current data of cell notes. */
	notes: NotesData
	readonly solution: ValidNumbers
	/** Get the current value of cell. */
	value: number
}

export interface CellFromJSONOpts {
	cellLike: CellJSON
	solution: ValidNumbers
}

export interface CellCreateOpts {
	isInitial: boolean
	solution: ValidNumbers
}

interface CellOpts {
	notes: Notes
	readonly solution: ValidNumbers
	value: number
}

/** Simulated key for protected field. */
const notesK = Symbol('cell-notes')
const solutionK = Symbol('cell-solution')
const valueK = Symbol('cell-value')

export abstract class Cell extends Entity implements CellData {
	protected [notesK]: Notes
	protected [solutionK]: ValidNumbers
	protected [valueK]: number
	abstract readonly isCorrect: boolean
	abstract readonly kind: CellKind

	/**
	 * Creates an instance of CellState class.
	 * @param data Kind, notes, solution, pos and value for cell.
	 */
	constructor(data: CellOpts) {
		super()
		this[notesK] = data.notes
		this[solutionK] = data.solution
		this[valueK] = data.value
	}

	get notes() {
		return this[notesK].data
	}

	get notesNumber() {
		return this[notesK].toNumber()
	}

	get solution() {
		return this[solutionK]
	}

	get value() {
		return this[valueK]
	}

	/**
	 * Create an instance of CellSvc with options.
	 * @param opts Options for create cell (optional).
	 */
	static create(opts: CellCreateOpts): Cell
	static create({ isInitial, solution }: CellCreateOpts) {
		const baseData: Omit<CellOpts, 'value'> = { notes: Notes.create(), solution }

		return isInitial
			? new InitialCell({ ...baseData, value: solution })
			: new EmptyCell({ ...baseData, value: EMPTY_CELL_VALUE })
	}

	/**
	 * Create an instance of BoardSvc from a JSON string
	 * @param cellLike JSON representation of cell.
	 * @param solution Value for  solution of cell.
	 */
	static fromJSON(opts: CellFromJSONOpts): Cell
	static fromJSON({ cellLike: { kind, notes, value }, solution }: CellFromJSONOpts) {
		const data: CellOpts = { solution, value, notes: Notes.fromNumber(notes) }
		return match<CellKind, Cell>(kind, {
			[CellKind.Correct]: () => new CorrectCell(data),
			[CellKind.Empty]: () => new EmptyCell(data),
			[CellKind.Incorrect]: () => new IncorrectCell(data),
			[CellKind.Initial]: () => new InitialCell(data),
			[CellKind.Unverified]: () => new UnverifiedCell(data),
			[CellKind.WhitNotes]: () => new NotesCellSvc(data),
		})
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

	/** Converts Cell instance in JSON. */
	toJSON(): CellJSON {
		return { kind: this.kind, notes: this.notesNumber, value: this.value }
	}

	/** Converts the Cell instance to a JSON string. */
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

class InitialCell extends Cell {
	readonly isCorrect = true

	get kind() {
		return CellKind.Initial
	}
}

abstract class WritableCell extends Cell {
	addNote(num: ValidNumbers) {
		if (this[notesK].has(num)) return this

		return new NotesCellSvc({ notes: this[notesK].add(num), solution: this[solutionK], value: EMPTY_CELL_VALUE })
	}

	changeByMove(sudokuMove: MoveData): Cell {
		const notes = new Notes(sudokuMove.notes)

		const data: CellOpts = { notes, solution: this.solution, value: sudokuMove.value }
		if (!notes.isEmpty) return new NotesCellSvc(data)
		if (sudokuMove.value > EMPTY_CELL_VALUE) return new UnverifiedCell(data)
		return new EmptyCell(data)
	}

	clear() {
		return new EmptyCell({ notes: this[notesK].clear(), solution: this[solutionK], value: EMPTY_CELL_VALUE })
	}

	toggleNote(num: ValidNumbers): Cell {
		return this.addNote(num)
	}

	writeValue(num: ValidNumbers) {
		if (this[valueK] === num) return this

		return new UnverifiedCell({ notes: this[notesK].clear(), solution: this[solutionK], value: num })
	}
}

class UnverifiedCell extends WritableCell {
	get isCorrect() {
		return this.value === this.solution
	}

	get kind() {
		return CellKind.Unverified
	}

	verify(effect: (isIncorrect: boolean) => void) {
		effect(!this.isCorrect)

		return this.isCorrect
			? new CorrectCell({ notes: this[notesK], solution: this[solutionK], value: this[valueK] })
			: new IncorrectCell({ notes: this[notesK], solution: this[solutionK], value: this[valueK] })
	}
}

class EmptyCell extends WritableCell {
	readonly isCorrect = false

	get kind() {
		return CellKind.Empty
	}

	clear() {
		return this
	}
}

class CorrectCell extends WritableCell {
	readonly isCorrect = true

	get kind() {
		return CellKind.Correct
	}
}

class IncorrectCell extends WritableCell {
	readonly isCorrect = false

	get kind() {
		return CellKind.Incorrect
	}
}

class NotesCellSvc extends WritableCell {
	readonly isCorrect = false

	get kind() {
		return CellKind.WhitNotes
	}

	removeNote(num: ValidNumbers) {
		if (!this[notesK].has(num)) return this

		const notes = this[notesK].remove(num)

		return notes.isEmpty
			? new EmptyCell({ notes, solution: this[solutionK], value: this[valueK] })
			: new NotesCellSvc({ notes, solution: this[solutionK], value: this[valueK] })
	}

	toggleNote(num: ValidNumbers) {
		const notes = this[notesK].toggle(num)

		return notes.isEmpty
			? new EmptyCell({ notes, solution: this[solutionK], value: this[valueK] })
			: new NotesCellSvc({ notes, solution: this[solutionK], value: this[valueK] })
	}
}
