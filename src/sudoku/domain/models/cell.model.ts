import { type CellNotesData, type INotes, type ValidNumbers } from './notes.model'

export enum CellKinds {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Empty = 'empty',
	WithValue = 'value',
	WhitNotes = 'notes',
}

export interface InitialCellData {
	kind: CellKinds.Initial
	value: ValidNumbers
}

export interface WritableCellData {
	kind: Exclude<CellKinds, CellKinds.Initial>
	notes: INotes
	value: number
}

export type CellData = (InitialCellData & { notes: INotes }) | WritableCellData

export interface CellJSON {
	kind: CellKinds
	notes: number
	value: number
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
	/** Converts the Cell instance to a JSON string. */
	toString(): string
}

export interface IInitialCell extends ICellBase<InitialCellData> {}

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
	 * @param {ValidNumbers} num The note to remove (1-9).
	 */
	removeNote(num: ValidNumbers): this
	/**
	 * Toggle a note in the Notes class (add if not present, remove if present).
	 * @param {ValidNumbers} num The note to toggle (1-9).
	 */
	toggleNote(num: ValidNumbers): this
	/**
	 * Toggle a cell value (add if not present, remove if present).
	 * @param {ValidNumbers} num The note add (1-9).
	 */
	writeValue(num: ValidNumbers): this
}

export type ICell = IInitialCell | IWritableCell
