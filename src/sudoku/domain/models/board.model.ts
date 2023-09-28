import type { Position } from '~/share/domain/models'

import { type CellJSON, type ICell } from './cell.model'
import { type ValidNumbers } from './notes.model'

export type BoardData = ICell[][]

export interface IBoard {
	/**
	 * Remove value and clear note set.
	 * @param {Position} cellPos Position of the cell to be cleared.
	 */
	clear(cellPos: Position): this
	/** Get the current cells of board. */
	get data(): BoardData
	/** Converts Board instance in JSON. */
	toJSON(): CellJSON[][]
	/** Converts the Board instance to a JSON string. */
	toString(): string
	/**
	 * Toggle a note in the Notes class (add if not present, remove if present).
	 * @param {Position} cellPos Position of the cell to which the notes are to be toggled.
	 * @param {ValidNumbers} num The note to toggle (1-9).
	 */
	toggleNotes(cellPos: Position, num: ValidNumbers): this
	/**
	 * Toggle a cell value (add if not present, remove if present).
	 * @param {Position} cellPos Position of the cell to which the value is changed.
	 * @param {ValidNumbers} num The note add (1-9).
	 */
	write(cellPos: Position, num: ValidNumbers): this
}
