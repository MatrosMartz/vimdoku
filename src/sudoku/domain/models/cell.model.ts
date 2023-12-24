import type { Pos } from '~/share/domain/models'

import type { SudokuMove } from './board.model'
import { type INotes, type Notes, type ValidNumbers } from './notes.model'

export enum CellKind {
	Correct = 'correct',
	Empty = 'empty',
	Incorrect = 'incorrect',
	Initial = 'initial',
	Unverified = 'unverified',
	WhitNotes = 'notes',
}

export type InsertKinds = CellKind.Correct | CellKind.Incorrect | CellKind.Unverified

export const INSERT_KINDS: InsertKinds[] = [CellKind.Correct, CellKind.Incorrect, CellKind.Unverified]

export interface CellData {
	kind: CellKind
	notes: INotes
	readonly pos: Pos
	readonly solution: ValidNumbers
	value: number
}

export interface Cell {
	kind: CellKind
	notes: Notes
	value: number
}

export interface CellJSON {
	kind: CellKind
	notes: number
	value: number
}

export interface ICellState {
	/** Get the current data of cell. */
	readonly data: Cell
	/** Get if the value is the same of the solution. */
	readonly isCorrect: boolean
	/** Get the current kind of cell. */
	readonly kind: CellKind
	/** Get the current data of cell notes. */
	readonly notes: Notes
	/** Get value return of Notes instance toNumber() method. */
	readonly notesNumber: number
	readonly pos: Pos
	readonly solution: ValidNumbers
	/** Get the current value of cell. */
	readonly value: number
	/**
	 * Add a note in the Notes class.
	 * @param num The note to remove (1-9).
	 * @returns The updated cell state.
	 */
	addNote(num: ValidNumbers): ICellState
	changeByMove(sudokuMove: SudokuMove): ICellState
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
	verify(effect: (isIncorrect: boolean) => void): ICellState
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
	changeByMove(sudokuMove: SudokuMove): this
	/** @returns The updated cell. */
	clear(): this
	/** @returns The updated cell. */
	removeNote(num: ValidNumbers): this
	/** Converts Cell instance in JSON. */
	toJSON(): CellJSON
	/** Converts the Cell instance to a JSON string. */
	toString(): string
	/** @returns The updated cell. */
	toggleNote(num: ValidNumbers): this
	/** @returns The updated cell. */
	verify(effect: (result: boolean) => void): this
	/** @returns The updated cell. */
	writeValue(num: ValidNumbers): this
}
