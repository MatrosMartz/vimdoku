import {
	type CellJSON,
	CellKinds,
	type IInitialCell,
	type InitialCellData,
	type IWritableCell,
	type ValidNumbers,
	type WritableCellData,
} from '../models'
import { NotesService } from './notes.service'

/** Represents a Sudoku cell of Initial kind.  */
export class InitialCellService implements IInitialCell {
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
		return { kind: CellKinds.Initial, notes: 1, value: this.#cellValue }
	}
}

/** Represents a Sudoku cell of non Initial kind (Correct, Incorrect, Empty, WithNotes and WithValue). */
export class WritableCellService implements IWritableCell {
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
		notes = NotesService.create(),
		value = WritableCellService.EMPTY_VALUE,
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
		this.#cellValue = WritableCellService.EMPTY_VALUE
		this.#notes.clear()
		return this
	}

	removeNote(num: ValidNumbers) {
		this.#notes = this.#notes.remove(num)
		this.#cellValue = WritableCellService.EMPTY_VALUE
		this.#kind = this.#kindByNotes()

		return this
	}

	toJSON(): CellJSON {
		return { kind: this.#kind, notes: this.#notes.toNumber(), value: this.#cellValue }
	}

	toggleNote(num: ValidNumbers) {
		this.#cellValue = WritableCellService.EMPTY_VALUE
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
