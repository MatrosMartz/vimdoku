import { type INotes, type Notes, type ValidNumbers } from './notes.model'

export enum CellKinds {
	Correct = 'correct',
	Empty = 'empty',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Unverified = 'unverified',
	WhitNotes = 'notes',
}

export interface Cell {
	kind: CellKinds
	notes: INotes
	readonly solution: ValidNumbers
	value: number
}

export interface CellJSON {
	kind: CellKinds
	notes: number
	value: number
}

export interface ICellState {
	/**
	 * Add a note in the Notes class.
	 * @param num The note to remove (1-9).
	 * @returns The updated cell state.
	 */
	addNote(num: ValidNumbers): ICellState
	/**
	 * Remove value and clear note set.
	 * @returns The updated cell state.
	 */
	clear(): ICellState
	/**
	 * Remove a note in the Notes class.
	 * @param num The note to remove (1-9).
	 * @returns The updated cell state.
	 */
	removeNote(num: ValidNumbers): ICellState
	/**
	 * Toggle a note in the Notes class (add if not present, remove if present).
	 * @param num The note to toggle (1-9).
	 * @returns The updated cell state.
	 */
	toggleNote(num: ValidNumbers): ICellState
	/**
	 * Change kind if value is the correct or incorrect.
	 * @returns The updated cell state.
	 */
	verify(): ICellState
	/**
	 * Toggle a cell value (add if not present, remove if present).
	 * @param num The note add (1-9).
	 * @returns The updated cell state.
	 */
	writeValue(num: ValidNumbers): ICellState
}

export interface ICell extends ICellState {
	/** @returns The updated cell. */
	addNote(num: ValidNumbers): this
	/** @returns The updated cell. */
	clear(): this
	/** Get the current data of cell. */
	get data(): Cell
	/** Get the current kind of cell. */
	get kind(): CellKinds
	/** Get the current data of cell notes. */
	get notes(): Notes
	/** Get value return of Notes instance toNumber() method. */
	get notesNumber(): number
	/** @returns The updated cell. */
	removeNote(num: ValidNumbers): this
	/** Converts Cell instance in JSON. */
	toJSON(): CellJSON
	/** Converts the Cell instance to a JSON string. */
	toString(): string
	/** @returns The updated cell. */
	toggleNote(num: ValidNumbers): this
	/** Get the current value of cell. */
	get value(): number
	/** @returns The updated cell. */
	verify(): this
	/** @returns The updated cell. */
	writeValue(num: ValidNumbers): this
}
