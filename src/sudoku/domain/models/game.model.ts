import type { Pos } from '~/share/domain/entities'
import type { Modes } from '$cmd/domain/const'

import type { ValidNumbers } from '../entities'
import type { BoardJSON } from './board.model'

export interface IGame {
	readonly errors: number
	readonly hasWin: boolean
	/**
	 * Change the current mode within the game board.
	 * @param mode The new mode.
	 * @returns The updated game.
	 */
	changeMode(mode: Modes.Kind): IGame
	/**
	 * Clear the value and notes at the selected cell on the game.
	 * @returns The updated game state object.
	 */
	clear(): this
	/**
	 * Move the current position in direction by a specified number of times.
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
	moveTo(position: Pos.Pos): this
	/**
	 * Redo the next game action.
	 * @returns The updated game.
	 */
	redo(): this
	/** Get the board in JSON format. */
	toJSON(): BoardJSON
	/**
	 * Redo the next game action.
	 * @returns The updated game.
	 */
	undo(): this
	/**
	 * check if the number in the current position is correct.
	 * @returns The updated game.
	 */
	validateWrite(): this
	/**
	 * Checks if the value of the selected cell is correct.
	 * @param Solution for this Cell.
	 * @returns The updated game.
	 */
	verify(): this
	/**
	 * Write a valid number as value or notes depending on the game mode in the current position cell.
	 * @param num The valid number to write.
	 * @param opts removeNotes: Indicates if it should remove the related notes.
	 */
	write(num: ValidNumbers, opts: { removeNotes: boolean; validate: boolean }): this
}
