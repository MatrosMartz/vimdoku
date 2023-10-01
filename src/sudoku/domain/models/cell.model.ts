import { type INotes, type Notes, type ValidNumbers } from './notes.model'

export enum CellKinds {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Empty = 'empty',
	WithValue = 'value',
	WhitNotes = 'notes',
}

export interface InitialCellValue {
	kind: CellKinds.Initial
	num: ValidNumbers
}

export interface WritableCellValue {
	kind: Exclude<CellKinds, CellKinds.Initial>
	notes: INotes
	num: number
}

export type CellValue = (InitialCellValue & { notes: INotes }) | WritableCellValue

export interface CellJSON {
	kind: CellKinds
	notes: number
	num: number
}

interface ICellBase<T extends InitialCellValue | WritableCellValue> {
	/** Get the current kind of cell. */
	get kind(): T extends InitialCellValue ? CellKinds.Initial : Exclude<CellKinds, CellKinds.Initial>
	/** Get the current value of cell. */
	get num(): number
	/** Converts Cell instance in JSON. */
	toJSON(): CellJSON
	/** Converts the Cell instance to a JSON string. */
	toString(): string
	/** Get the current data of cell. */
	get value(): T
}

export interface IInitialCell extends ICellBase<InitialCellValue> {}

export interface IWritableCell extends ICellBase<WritableCellValue> {
	/**
	 * change kind if value is the correct or incorrect.
	 * @param solutionValue Solution for this Cell.
	 */
	checkValue(solutionValue: ValidNumbers): this
	/** Remove value and clear note set. */
	clear(): this
	/** Get the current data of cell notes. */
	get notes(): Notes
	/** Get value return of Notes instance toNumber() method. */
	get notesNumber(): number
	/**
	 * Remove a note in the Notes class.
	 * @param num The note to remove (1-9).
	 */
	removeNote(num: ValidNumbers): this
	/**
	 * Toggle a note in the Notes class (add if not present, remove if present).
	 * @param num The note to toggle (1-9).
	 */
	toggleNote(num: ValidNumbers): this
	/**
	 * Toggle a cell value (add if not present, remove if present).
	 * @param num The note add (1-9).
	 */
	writeValue(num: ValidNumbers): this
}

export type ICell = IInitialCell | IWritableCell
