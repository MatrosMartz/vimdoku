import type { Pos } from '~/share/domain/entities'

import type { ModeKind } from '../const'
import type { ValidNumbers } from '../entities'
import type { BoardJSON } from '.'
import type { SudokuInfo, SudokuSetts, SudokuSettsJSON } from './sudoku-settings.model'

export interface ISudoku {
	readonly setts?: SudokuSettsJSON
	readonly hasWin: boolean
	readonly isASaved: boolean
	/**
	 * Change the current mode within the game board.
	 * @param mode The new mode.
	 * @returns The updated game.
	 */
	changeMode(mode: ModeKind): this
	/**
	 * Clear the value and notes at the current position on the game board.
	 * @returns The updated game.
	 */
	clear(): this
	/**
	 * Continue The current game.
	 * @returns The updated game.
	 */
	continue(): this
	/**
	 * End the current game.
	 * @returns The new Non-started game.
	 */
	end(): Promise<void>
	/**
	 * Move the current position down by a specified number of times.
	 * @param dir The direction of move.
	 * @param times The number of times to move down.
	 * @returns The updated game.
	 */
	move(dir: 'Down' | 'Left' | 'Right' | 'Up', times: number): this
	/**
	 * Change the current position within the game board.
	 * @param position The new position.
	 * @returns The updated game.
	 */
	moveTo(position: Pos): this
	/**
	 * Pause the current game.
	 * @returns The updated game.
	 */
	pause(): this
	/**
	 * Redo the next action.
	 * @returns The updated game.
	 */
	redo(): this
	/** Resumes a previously started Sudoku game. */
	resume(withTimer: boolean): this
	/** Save the current game state. */
	save(): Promise<void>
	setData(data: { board?: BoardJSON | null; info?: SudokuInfo | null; setts?: SudokuSettsJSON | null }): this
	/**
	 * Starts a new Sudoku game.
	 * @param opts Optional game options, including difficulty and solution.
	 */
	start(opts: SudokuSetts, withTimer: boolean): this
	/**
	 * Undo the previous action.
	 * @returns The updated game.
	 */
	undo(): this
	/**
	 * Check if any cell values are incorrect.
	 * @returns The updated game.
	 */
	verify(): this
	/**
	 * Write a valid number as value or notes depending on the game mode in the current position cell.
	 * @param num The valid number to write.
	 * @param opts Indicates if it should remove the related notes and validate after write number.
	 * @returns The updated game.
	 */
	write(num: ValidNumbers, opts: { removeNotes: boolean; validate: boolean }): this
}
