import type { Position } from '~/share/domain/models'
import type { Tuple } from '~/share/types'

import { type CellJSON, type ICell } from './cell.model'
import { type ValidNumbers } from './notes.model'

export type Board = Tuple<Tuple<ICell, 9>, 9>

export type BoardJSON = Tuple<Tuple<CellJSON, 9>, 9>

export interface IBoard {
	/**
	 * Remove cell value and clear note set.
	 * @param cellPos Position of the cell to be cleared.
	 */
	clear(cellPos: Position): this
	/** Get the current cells of board. */
	get data(): Board
	/** Converts Board instance in JSON. */
	toJSON(): BoardJSON
	/** Converts the Board instance to a JSON string. */
	toString(): string
	/**
	 * Toggle a note in the Notes class (add if not present, remove if present).
	 * @param cellPos Position of the cell to which the notes are to be toggled.
	 * @param num The note to toggle (1-9).
	 */
	toggleNotes(cellPos: Position, num: ValidNumbers): this
	/**
	 * Toggle a cell value (add if not present, remove if present).
	 * @param cellPos Position of the cell to which the value is changed.
	 * @param num The note add (1-9).
	 */
	write(cellPos: Position, num: ValidNumbers): this
}
