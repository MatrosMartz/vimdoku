import {
	type Cell,
	type CellJSON,
	CellKinds,
	type ICell,
	type ICellState,
	type INotes,
	type ValidNumbers,
} from '../models'
import { NotesService } from './notes.service'

/** Represents a Sudoku Cell Entity.  */
class CellEntity implements Cell {
	kind: CellKinds
	notes: INotes
	readonly solution: ValidNumbers
	value: number

	constructor(data: Cell) {
		this.kind = data.kind
		this.notes = data.notes
		this.solution = data.solution
		this.value = data.value
	}
}

interface CellOpts {
	isInitial: boolean
	solution: ValidNumbers
}

/** Represents a Sudoku Cell Service.  */
export class CellService implements ICell {
	#data: CellEntity
	#state: ICellState

	/**
	 * Creates an instance of CellService class.
	 * @param data Kind, notes, solution and value for cell.
	 */
	constructor(data: CellEntity) {
		this.#data = data
		this.#state = this.#stateForKind(data)
	}

	get data() {
		return { ...this.#data, notes: new NotesService(this.#data.notes.data) }
	}

	get kind() {
		return this.data.kind
	}

	get notes() {
		return this.data.notes.toJSON()
	}

	get notesNumber() {
		return this.data.notes.toNumber()
	}

	get value() {
		return this.data.value
	}

	/**
	 * Create an instance of CellService with options.
	 * @param opts Options for create cell (optional).
	 */
	static create(opts: CellOpts): CellService
	static create({ isInitial, solution }: CellOpts) {
		const baseData: Omit<Cell, 'kind' | 'value'> = { notes: NotesService.create(), solution }

		const specificData: Pick<Cell, 'kind' | 'value'> = isInitial
			? { kind: CellKinds.Initial, value: solution }
			: { kind: CellKinds.Empty, value: CellState.EMPTY_VALUE }

		return new CellService(new CellEntity({ ...baseData, ...specificData }))
	}

	/**
	 * Create an instance of BoardService from a JSON string
	 * @param cellLike JSON representation of cell.
	 * @param solution Value for  solution of cell.
	 */
	static fromJSON(cellLike: CellJSON, solution: ValidNumbers): CellService
	static fromJSON({ kind, notes, value }: CellJSON, solution: ValidNumbers) {
		const data = new CellEntity({ kind, notes: NotesService.fromNumber(notes), solution, value })
		return new CellService(data)
	}

	addNote(num: ValidNumbers) {
		this.#state.addNote(num)
		return this
	}

	clear() {
		this.#state.clear()
		return this
	}

	removeNote(num: ValidNumbers) {
		this.#state.removeNote(num)
		return this
	}

	toJSON(): CellJSON {
		return { kind: this.#data.kind, notes: this.#data.notes.toNumber(), value: this.#data.value }
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNote(num: ValidNumbers) {
		this.#state.toggleNote(num)
		return this
	}

	verify() {
		this.#state.verify()
		return this
	}

	writeValue(num: ValidNumbers) {
		this.#state.writeValue(num)
		return this
	}

	#stateForKind(data: Cell) {
		switch (data.kind) {
			case CellKinds.Correct:
				return new CorrectCellState(data)
			case CellKinds.Empty:
				return new EmptyCellState(data)
			case CellKinds.Incorrect:
				return new IncorrectCellState(data)
			case CellKinds.Initial:
				return new InitialCellState(data)
			case CellKinds.Unverified:
				return new UnverifiedCellState(data)
			case CellKinds.WhitNotes:
				return new NotesCellState(data)
		}
	}
}

/** Simulated key for protected field. */
const data = Symbol('data')

/** Represents a Sudoku Cell State.  */
abstract class CellState implements ICellState {
	/** Number representing the empty value for cell. */
	static readonly EMPTY_VALUE = 0

	protected [data]: CellEntity

	/**
	 * Creates an instance of CellState class.
	 * @param data Kind, notes, solution and value for cell.
	 */
	constructor(data: CellEntity)
	constructor(cellData: CellEntity) {
		this[data] = cellData
	}

	addNote(num: ValidNumbers): ICellState {
		return this
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

	verify(): ICellState {
		return this
	}

	writeValue(num: ValidNumbers): ICellState {
		return this
	}
}

class InitialCellState extends CellState {
	constructor(data: CellEntity) {
		data.kind = CellKinds.Incorrect
		super(data)
	}
}

abstract class WritableCellState extends CellState {
	addNote(num: ValidNumbers) {
		return new NotesCellState(this[data]).addNote(num)
	}

	clear() {
		return new EmptyCellState(this[data]).clear()
	}

	writeValue(num: ValidNumbers) {
		return new UnverifiedCellState(this[data]).writeValue(num)
	}
}

class UnverifiedCellState extends WritableCellState {
	constructor(data: CellEntity) {
		data.kind = CellKinds.Unverified
		super(data)
	}

	verify() {
		return this[data].solution === this[data].value
			? new CorrectCellState(this[data])
			: new IncorrectCellState(this[data])
	}

	writeValue(num: ValidNumbers) {
		this[data].notes.clear()
		this[data].value = num

		return this
	}
}

class EmptyCellState extends WritableCellState {
	constructor(data: Cell) {
		data.kind = CellKinds.Empty
		super(data)
	}

	clear() {
		this[data].notes.clear()
		this[data].value = CellState.EMPTY_VALUE

		return this
	}
}
class CorrectCellState extends WritableCellState {
	constructor(data: CellEntity) {
		data.kind = CellKinds.Correct
		super(data)
	}
}
class IncorrectCellState extends WritableCellState {
	constructor(data: CellEntity) {
		data.kind = CellKinds.Incorrect
		super(data)
	}
}

class NotesCellState extends WritableCellState {
	constructor(data: CellEntity) {
		data.kind = CellKinds.WhitNotes
		super(data)
	}

	addNote(num: ValidNumbers) {
		this[data].notes.add(num)
		this[data].value = CellState.EMPTY_VALUE

		return this
	}

	removeNote(num: ValidNumbers) {
		this[data].notes.remove(num)

		return this
	}

	toggleNote(num: ValidNumbers) {
		this[data].notes.toggle(num)

		return this
	}
}
