import {
	CellNotes,
	type CellNotesData,
	type CellNotesJSON,
	type ICellNotes,
	type ValidNumbers,
} from './cell-notes.model'

export enum CellKinds {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Empty = 'empty',
	WithValue = 'value',
	WhitNotes = 'notes',
}

interface ICellBase<T extends InitialCellData | WritableCellData> {
	/** Get the current value of cell. */
	get cellValue(): number
	/** Get the current data of cell. */
	get data(): T
	/** Get the current kind of cell. */
	get kind(): T extends InitialCellData ? CellKinds.Initial : Exclude<CellKinds, CellKinds.Initial>
	/** Converts Cell instance in JSON. */
	toJSON(): CellJSON
	toString(): string
}

export interface InitialCellData {
	kind: CellKinds.Initial
	value: ValidNumbers
}

export interface IInitialCell extends ICellBase<InitialCellData> {}

/** Represents a Sudoku cell of Initial kind.  */
export class InitialCell implements IInitialCell {
	#cellValue

	/**
	 * Creates an instance of the InitialCell class.
	 * @param {number} value Solution and value for cell.
	 */
	constructor(value: number) {
		this.#cellValue = value as ValidNumbers
	}

	get cellValue() {
		return this.#cellValue
	}

	get data(): InitialCellData {
		return { kind: CellKinds.Initial, value: this.#cellValue }
	}

	get kind() {
		return CellKinds.Initial as const
	}

	toJSON(): CellJSON {
		return { kind: CellKinds.Initial, notes: [], value: this.#cellValue }
	}
}

export interface WritableCellData {
	kind: Exclude<CellKinds, CellKinds.Initial>
	notes: ICellNotes
	value: number
}

export interface IWritableCell extends ICellBase<WritableCellData> {
	/**
	 * change kind if value is the correct or incorrect.
	 * @param {ValidNumbers} solutionValue Solution for this Cell.
	 */
	checkValue(solutionValue: ValidNumbers): this
	/** Remove value and clear note set. */
	clear(): this
	/** Get the current data of cell notes. */
	get notesData(): CellNotesData
	/**
	 * Remove a note in the Notes class.
	 * @param {ValidNumbers} num The note to remove (1 to 9).
	 */
	removeNote(num: ValidNumbers): this
	/**
	 * Toggle a note in the Notes class (add if not present, remove if present).
	 * @param {ValidNumbers} num The note to toggle (1 to 9).
	 */
	toggleNote(num: ValidNumbers): this
	/**
	 * Toggle a cell value (add if not present, remove if present).
	 * @param {ValidNumbers} num The note add (1 to 9).
	 */
	writeValue(num: ValidNumbers): this
}

/** Represents a Sudoku cell of non Initial kind (Correct, Incorrect, Empty, WithNotes and WithValue). */
export class WritableCell implements IWritableCell {
	static readonly EMPTY_VALUE = 0

	#cellValue
	#kind
	#notes

	/**
	 * Creates an instance of the WritableCell class.
	 * @param {Partial<WritableCellData>} [data] Kind, value and Notes for Cell.
	 */
	constructor(data?: Partial<WritableCellData>)
	constructor({
		kind = CellKinds.Empty,
		notes = CellNotes.create(),
		value = WritableCell.EMPTY_VALUE,
	}: Partial<WritableCellData> = {}) {
		this.#cellValue = value
		this.#kind = kind
		this.#notes = notes
	}

	get cellValue() {
		return this.#cellValue
	}

	get data(): WritableCellData {
		return { kind: this.#kind, notes: this.#notes, value: this.#cellValue }
	}

	get kind() {
		return this.#kind
	}

	get notesData() {
		return this.#notes.data
	}

	checkValue(solutionValue: ValidNumbers) {
		this.#kind = this.#cellValue === solutionValue ? CellKinds.Correct : CellKinds.Incorrect
		return this
	}

	clear() {
		this.#cellValue = WritableCell.EMPTY_VALUE
		this.#notes.clear()
		return this
	}

	removeNote(num: ValidNumbers) {
		this.#notes = this.#notes.remove(num)
		this.#cellValue = WritableCell.EMPTY_VALUE
		this.#kind = this.#kindByNotes()

		return this
	}

	toJSON(): CellJSON {
		return { kind: this.#kind, notes: this.#notes.toJSON(), value: this.#cellValue }
	}

	toggleNote(num: ValidNumbers) {
		this.#cellValue = WritableCell.EMPTY_VALUE
		this.#notes.toggle(num)
		this.#kind = this.#kindByNotes()
		return this
	}

	writeValue(num: ValidNumbers) {
		this.#kind = CellKinds.WithValue
		this.#cellValue = num
		this.#notes.clear()
		return this
	}

	#kindByNotes() {
		return this.#notes.isEmpty ? CellKinds.Empty : CellKinds.WhitNotes
	}
}

export type CellData = (InitialCellData & { notes: ICellNotes }) | WritableCellData

export interface CellJSON {
	kind: CellKinds
	notes: CellNotesJSON
	value: number
}

export type ICell = IInitialCell | IWritableCell
