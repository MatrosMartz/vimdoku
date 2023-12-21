import type { Pos } from '~/share/domain/models'
import { PosSvc } from '~/share/domain/services'
import { match } from '~/share/utils'

import { type SudokuMove, type ValidNumbers } from '../models'
import { type Cell, type CellData, type CellJSON, CellKind, type ICell, type ICellState } from '../models/cell.model'
import { NotesSvc } from './notes.service'

/** Represents a Sudoku Cell Entity.  */
class CellEntity implements CellData {
	kind
	notes
	readonly pos
	readonly solution
	value

	constructor(data: CellData) {
		this.kind = data.kind
		this.notes = data.notes
		this.pos = data.pos
		this.solution = data.solution
		this.value = data.value
	}
}

interface CellCreateOpts {
	isInitial: boolean
	pos: Pos
	solution: ValidNumbers
}

interface CellFromJSONOpts {
	cellLike: CellJSON
	pos: Pos
	solution: ValidNumbers
}

/** Represents a Sudoku Cell Service.  */
export class CellSvc implements ICell {
	#state: ICellState

	/**
	 * Creates an instance of CellSvc class.
	 * @param data Kind, notes, solution and value for cell.
	 */
	constructor(data: CellEntity) {
		this.#state = this.#stateForKind(data)
	}

	get data(): Cell {
		return this.data
	}

	get isCorrect() {
		return this.#state.isCorrect
	}

	get kind() {
		return this.#state.kind
	}

	get notes() {
		return this.#state.notes
	}

	get notesNumber() {
		return this.#state.notesNumber
	}

	get pos() {
		return this.#state.pos
	}

	get solution() {
		return this.#state.solution
	}

	get value() {
		return this.#state.value
	}

	/**
	 * Create an instance of CellSvc with options.
	 * @param opts Options for create cell (optional).
	 */
	static create(opts: CellCreateOpts): CellSvc
	static create({ isInitial, pos, solution }: CellCreateOpts) {
		const baseData: Omit<CellData, 'kind' | 'value'> = { notes: NotesSvc.create(), solution, pos }

		const specificData: Pick<CellData, 'kind' | 'value'> = isInitial
			? { kind: CellKind.Initial, value: solution }
			: { kind: CellKind.Empty, value: CellState.EMPTY_VALUE }

		return new CellSvc(new CellEntity({ ...baseData, ...specificData }))
	}

	/**
	 * Create an instance of BoardSvc from a JSON string
	 * @param cellLike JSON representation of cell.
	 * @param solution Value for  solution of cell.
	 */
	static fromJSON(opts: CellFromJSONOpts): CellSvc
	static fromJSON({ cellLike: { kind, notes, value }, pos, solution }: CellFromJSONOpts) {
		const data = new CellEntity({ kind, notes: NotesSvc.fromNumber(notes), pos, solution, value })
		return new CellSvc(data)
	}

	addNote(num: ValidNumbers) {
		this.#state = this.#state.addNote(num)
		return this
	}

	changeByMove(sudokuMove: SudokuMove): this {
		throw new Error('Method not implemented.')
	}

	clear() {
		this.#state = this.#state.clear()
		return this
	}

	redo() {
		return this
	}

	removeNote(num: ValidNumbers) {
		this.#state = this.#state.removeNote(num)
		return this
	}

	toJSON(): CellJSON {
		return { kind: this.#state.kind, notes: this.#state.notesNumber, value: this.#state.value }
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNote(num: ValidNumbers) {
		this.#state = this.#state.toggleNote(num)
		return this
	}

	undo() {
		return this
	}

	verify(effect: (result: boolean) => void) {
		this.#state = this.#state.verify(effect)
		return this
	}

	writeValue(num: ValidNumbers) {
		this.#state = this.#state.writeValue(num)
		return this
	}

	#stateForKind(data: CellData) {
		return match<CellKind, CellState>(data.kind, {
			[CellKind.Correct]: () => new CorrectCellState({ data }),
			[CellKind.Empty]: () => new EmptyCellState({ data }),
			[CellKind.Incorrect]: () => new IncorrectCellState({ data }),
			[CellKind.Initial]: () => new InitialCellState({ data }),
			[CellKind.Unverified]: () => new UnverifiedCellState({ data }),
			[CellKind.WhitNotes]: () => new NotesCellState({ data }),
		})
	}
}

/** Simulated key for protected field. */
const data = Symbol('data')

interface CellStateDeps {
	data: CellEntity
}

/** Represents a Sudoku Cell State.  */
abstract class CellState implements ICellState {
	/** Number representing the empty value for cell. */
	static readonly EMPTY_VALUE = 0

	protected [data]: CellEntity
	abstract readonly isCorrect: boolean

	/**
	 * Creates an instance of CellState class.
	 * @param deps Kind, notes, solution and value for cell.
	 */
	constructor(deps: CellStateDeps) {
		this[data] = deps.data
	}

	get data(): Cell {
		return {
			kind: this[data].kind,
			notes: this[data].notes.data,
			value: this[data].value,
		}
	}

	get kind() {
		return this[data].kind
	}

	get notes() {
		return this[data].notes.data
	}

	get notesNumber() {
		return this[data].notes.toNumber()
	}

	get pos() {
		return this[data].pos
	}

	get solution() {
		return this[data].solution
	}

	get value() {
		return this[data].value
	}

	addNote(num: ValidNumbers): ICellState {
		return this
	}

	changeByMove(sudokuMove: SudokuMove): CellState {
		if (!PosSvc.equalsPos(sudokuMove.pos, this[data].pos)) return this
		const notes = new NotesSvc(sudokuMove.notes)

		if (!notes.isEmpty && sudokuMove.value < 0)
			return NotesCellState.create({ ...sudokuMove, notes, solution: this.solution })
		if (sudokuMove.value > 0) return UnverifiedCellState.create({ ...sudokuMove, notes, solution: this.solution })
		else return EmptyCellState.create({ ...sudokuMove, notes, solution: this.solution })
	}

	clear(): ICellState {
		return this
	}

	removeNote(num: ValidNumbers): ICellState {
		return this
	}

	toggleNote(num: ValidNumbers): ICellState {
		return this
	}

	verify(effect: (result: boolean) => void): ICellState {
		return this
	}

	writeValue(num: ValidNumbers): ICellState {
		return this
	}
}

class InitialCellState extends CellState {
	readonly isCorrect = true

	constructor(deps: CellStateDeps) {
		deps.data.kind = CellKind.Initial
		super(deps)
	}

	static create(data: Omit<CellData, 'kind'>) {
		return new UnverifiedCellState({ data: new CellEntity({ kind: CellKind.Initial, ...data }) })
	}
}

abstract class WritableCellState extends CellState {
	addNote(num: ValidNumbers): CellState {
		if (this[data].notes.has(num)) return this

		this[data].notes.add(num)
		this[data].value = CellState.EMPTY_VALUE

		return new NotesCellState({ data: this[data] })
	}

	clear() {
		this[data].notes.clear()
		this[data].value = CellState.EMPTY_VALUE

		return new EmptyCellState({ data: this[data] })
	}

	toggleNote(num: ValidNumbers): CellState {
		this[data].notes.add(num)
		this[data].value = CellState.EMPTY_VALUE

		return new NotesCellState({ data: this[data] })
	}

	writeValue(num: ValidNumbers) {
		if (this[data].value === num) return this

		this[data].notes.clear()
		this[data].value = num

		return new UnverifiedCellState({ data: this[data] })
	}
}

class UnverifiedCellState extends WritableCellState {
	constructor(deps: CellStateDeps) {
		deps.data.kind = CellKind.Unverified
		super(deps)
	}

	get isCorrect() {
		return this.value === this.solution
	}

	static create(data: Omit<CellData, 'kind'>) {
		return new UnverifiedCellState({ data: new CellEntity({ kind: CellKind.Unverified, ...data }) })
	}

	verify(effect: (result: boolean) => void) {
		effect(!this.isCorrect)

		return this.isCorrect ? new CorrectCellState({ data: this[data] }) : new IncorrectCellState({ data: this[data] })
	}
}

class EmptyCellState extends WritableCellState {
	readonly isCorrect = false

	constructor(deps: CellStateDeps) {
		deps.data.kind = CellKind.Empty
		super(deps)
	}

	static create(data: Omit<CellData, 'kind'>) {
		return new UnverifiedCellState({ data: new CellEntity({ kind: CellKind.Empty, ...data }) })
	}

	clear() {
		return this
	}
}

class CorrectCellState extends WritableCellState {
	readonly isCorrect = true

	constructor(deps: CellStateDeps) {
		deps.data.kind = CellKind.Correct
		super(deps)
	}

	static create(data: Omit<CellData, 'kind'>) {
		return new UnverifiedCellState({ data: new CellEntity({ kind: CellKind.Correct, ...data }) })
	}
}

class IncorrectCellState extends WritableCellState {
	readonly isCorrect = false

	constructor(deps: CellStateDeps) {
		deps.data.kind = CellKind.Incorrect
		super(deps)
	}

	static create(data: Omit<CellData, 'kind'>) {
		return new UnverifiedCellState({ data: new CellEntity({ kind: CellKind.Incorrect, ...data }) })
	}
}

class NotesCellState extends WritableCellState {
	readonly isCorrect = false

	constructor(deps: CellStateDeps) {
		deps.data.kind = CellKind.WhitNotes
		super(deps)
	}

	static create(data: Omit<CellData, 'kind'>) {
		return new UnverifiedCellState({ data: new CellEntity({ kind: CellKind.WhitNotes, ...data }) })
	}

	removeNote(num: ValidNumbers) {
		if (!this[data].notes.has(num)) return this

		this[data].notes.remove(num)

		return this[data].notes.isEmpty ? new EmptyCellState({ data: this[data] }) : this
	}

	toggleNote(num: ValidNumbers) {
		this[data].notes.toggle(num)

		return this[data].notes.isEmpty ? new EmptyCellState({ data: this[data] }) : this
	}
}
