import type { Pos } from '~/share/domain/models'
import { Entity } from '~/share/domain/services'
import { match } from '~/share/utils'

import { type MoveData, type ValidNumbers } from '../models'
import { type Cell, type CellData, type CellJSON, CellKind, EMPTY_CELL_VALUE, type ICell } from '../models/cell.model'
import { NotesSvc } from './notes.service'

export interface CellFromJSONOpts {
	cellLike: CellJSON
	pos: Pos
	solution: ValidNumbers
}

export interface CellCreateOpts {
	isInitial: boolean
	pos: Pos
	solution: ValidNumbers
}

/** Simulated key for protected field. */
const dataKey = Symbol('data')

export abstract class CellSvc extends Entity implements ICell {
	protected [dataKey]: CellData
	abstract readonly isCorrect: boolean
	abstract readonly kind: CellKind

	/**
	 * Creates an instance of CellState class.
	 * @param data Kind, notes, solution, pos and value for cell.
	 */
	constructor(data: CellData) {
		super()
		this[dataKey] = data
	}

	get data(): Cell {
		return { kind: this.kind, notes: this.notes, value: this.value }
	}

	get notes() {
		return this[dataKey].notes.data
	}

	get notesNumber() {
		return this[dataKey].notes.toNumber()
	}

	get pos() {
		return this[dataKey].pos
	}

	get solution() {
		return this[dataKey].solution
	}

	get value() {
		return this[dataKey].value
	}

	/**
	 * Create an instance of CellSvc with options.
	 * @param opts Options for create cell (optional).
	 */
	static create(opts: CellCreateOpts): CellSvc
	static create({ isInitial, pos, solution }: CellCreateOpts) {
		const baseData: Omit<CellData, 'value'> = { notes: NotesSvc.create(), solution, pos }

		return isInitial
			? new InitialCellSvc({ ...baseData, value: solution })
			: new EmptyCellSvc({ ...baseData, value: EMPTY_CELL_VALUE })
	}

	/**
	 * Create an instance of BoardSvc from a JSON string
	 * @param cellLike JSON representation of cell.
	 * @param solution Value for  solution of cell.
	 */
	static fromJSON(opts: CellFromJSONOpts): CellSvc
	static fromJSON({ cellLike: { kind, notes, value }, pos, solution }: CellFromJSONOpts) {
		const data: CellData = { pos, solution, value, notes: NotesSvc.fromNumber(notes) }
		return match<CellKind, CellSvc>(kind, {
			[CellKind.Correct]: () => new CorrectCellSvc(data),
			[CellKind.Empty]: () => new EmptyCellSvc(data),
			[CellKind.Incorrect]: () => new IncorrectCellSvc(data),
			[CellKind.Initial]: () => new InitialCellSvc(data),
			[CellKind.Unverified]: () => new UnverifiedCellSvc(data),
			[CellKind.WhitNotes]: () => new NotesCellSvc(data),
		})
	}

	addNote(num: ValidNumbers): ICell {
		return this
	}

	changeByMove(sudokuMove: MoveData): ICell {
		return this
	}

	clear(): ICell {
		return this
	}

	removeNote(num: ValidNumbers): ICell {
		return this
	}

	toJSON(): CellJSON {
		return { kind: this.kind, notes: this.notesNumber, value: this.value }
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNote(num: ValidNumbers): ICell {
		return this
	}

	verify(effect: (isIncorrect: boolean) => void): ICell {
		return this
	}

	writeValue(num: ValidNumbers): ICell {
		return this
	}
}

class InitialCellSvc extends CellSvc {
	readonly isCorrect = true

	get kind() {
		return CellKind.Initial
	}
}

abstract class WritableCellSvc extends CellSvc {
	addNote(num: ValidNumbers): ICell {
		if (this[dataKey].notes.has(num)) return this

		return new NotesCellSvc({ ...this[dataKey], notes: this[dataKey].notes.add(num), value: EMPTY_CELL_VALUE })
	}

	changeByMove(sudokuMove: MoveData): ICell {
		const notes = new NotesSvc(sudokuMove.notes)

		const data = { ...sudokuMove, pos: this.pos, notes, solution: this.solution }
		if (!notes.isEmpty && sudokuMove.value <= EMPTY_CELL_VALUE) return new NotesCellSvc(data)
		if (sudokuMove.value > EMPTY_CELL_VALUE) return new UnverifiedCellSvc(data)
		else return new EmptyCellSvc(data)
	}

	clear() {
		return new EmptyCellSvc({ ...this[dataKey], notes: this[dataKey].notes.clear(), value: EMPTY_CELL_VALUE })
	}

	toggleNote(num: ValidNumbers): ICell {
		return this.addNote(num)
	}

	writeValue(num: ValidNumbers): ICell {
		if (this[dataKey].value === num) return this

		return new UnverifiedCellSvc({ ...this[dataKey], notes: this[dataKey].notes.clear(), value: num })
	}
}

class UnverifiedCellSvc extends WritableCellSvc {
	get isCorrect() {
		return this.value === this.solution
	}

	get kind() {
		return CellKind.Unverified
	}

	verify(effect: (isIncorrect: boolean) => void) {
		effect(!this.isCorrect)

		return this.isCorrect
			? new CorrectCellSvc({ ...this[dataKey], notes: this[dataKey].notes.copy() })
			: new IncorrectCellSvc({ ...this[dataKey], notes: this[dataKey].notes.copy() })
	}
}

class EmptyCellSvc extends WritableCellSvc {
	readonly isCorrect = false

	get kind() {
		return CellKind.Empty
	}

	clear() {
		return this
	}
}

class CorrectCellSvc extends WritableCellSvc {
	readonly isCorrect = true

	get kind() {
		return CellKind.Correct
	}
}

class IncorrectCellSvc extends WritableCellSvc {
	readonly isCorrect = false

	get kind() {
		return CellKind.Incorrect
	}
}

class NotesCellSvc extends WritableCellSvc {
	readonly isCorrect = false

	get kind() {
		return CellKind.WhitNotes
	}

	removeNote(num: ValidNumbers) {
		if (!this[dataKey].notes.has(num)) return this

		const notes = this[dataKey].notes.remove(num)

		return notes.isEmpty ? new EmptyCellSvc({ ...this[dataKey], notes }) : new NotesCellSvc({ ...this[dataKey], notes })
	}

	toggleNote(num: ValidNumbers) {
		const notes = this[dataKey].notes.toggle(num)

		return notes.isEmpty ? new EmptyCellSvc({ ...this[dataKey], notes }) : new NotesCellSvc({ ...this[dataKey], notes })
	}
}
