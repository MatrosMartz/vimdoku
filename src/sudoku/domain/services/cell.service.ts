import {
	type CellJSON,
	CellKinds,
	type IInitialCell,
	type InitialCellValue,
	type IWritableCell,
	type ValidNumbers,
	type WritableCellValue,
} from '../models'
import { NotesService } from './notes.service'

/** Represents a Sudoku Cell Service in Initial kind.  */
export class InitialCellService implements IInitialCell {
	#num

	/**
	 * Creates an instance of InitialCellService class.
	 * @param value Solution and value for cell.
	 */
	constructor(value: number) {
		this.#num = value as ValidNumbers
	}

	get kind() {
		return CellKinds.Initial as const
	}

	get num() {
		return this.#num
	}

	get value(): InitialCellValue {
		return { kind: CellKinds.Initial, num: this.#num }
	}

	toJSON(): CellJSON {
		return { kind: CellKinds.Initial, notes: 1, num: this.#num }
	}
}

/** Represents a Sudoku Cell Service in Non-initial kind (Correct, Incorrect, Empty, WithNotes and WithValue). */
export class WritableCellService implements IWritableCell {
	/** Number representing the empty value for cell. */
	static readonly EMPTY_VALUE = 0

	#kind
	#notes
	#num

	/**
	 * Creates an instance of the WritableCellService class.
	 * @param data Kind, value and Notes for Cell.
	 */
	constructor(data?: Partial<WritableCellValue>)
	constructor({
		kind = CellKinds.Empty,
		notes = NotesService.create(),
		num: value = WritableCellService.EMPTY_VALUE,
	}: Partial<WritableCellValue> = {}) {
		this.#num = value
		this.#kind = kind
		this.#notes = notes
	}

	get kind() {
		return this.#kind
	}

	get notes() {
		return this.#notes.value
	}

	get notesNumber() {
		return this.#notes.toNumber()
	}

	get num() {
		return this.#num
	}

	get value(): WritableCellValue {
		return { kind: this.#kind, notes: this.#notes, num: this.#num }
	}

	checkValue(solutionValue: ValidNumbers) {
		this.#kind = this.#num === solutionValue ? CellKinds.Correct : CellKinds.Incorrect
		return this
	}

	clear() {
		this.#num = WritableCellService.EMPTY_VALUE
		this.#notes.clear()
		return this
	}

	removeNote(num: ValidNumbers) {
		this.#notes = this.#notes.remove(num)
		this.#num = WritableCellService.EMPTY_VALUE
		this.#kind = this.#kindByNotes()

		return this
	}

	toJSON(): CellJSON {
		return { kind: this.#kind, notes: this.#notes.toNumber(), num: this.#num }
	}

	toggleNote(num: ValidNumbers) {
		this.#num = WritableCellService.EMPTY_VALUE
		this.#notes.toggle(num)
		this.#kind = this.#kindByNotes()
		return this
	}

	writeValue(num: ValidNumbers) {
		this.#kind = CellKinds.WithValue
		this.#num = num
		this.#notes.clear()

		return this
	}

	#kindByNotes() {
		return this.#notes.isEmpty ? CellKinds.Empty : CellKinds.WhitNotes
	}
}
