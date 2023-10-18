import type { IPosition, Position } from '~/share/domain/models'

import type { GameRepo } from '../repositories'
import type { BoardJSON, IBoard } from './board.model'
import type { GameOpts } from './game-options.model'
import type { ModeKinds } from './modes.model'
import type { ValidNumbers } from './notes.model'

export interface INonStartedGame {
	/** Get if the game has started. */
	readonly isStarted: false
	/**
	 * Resumes a previously started Sudoku game.
	 * @returns The saved game exists.
	 */
	resume(): Promise<IStartedGame | null>
	/**
	 * Starts a new Sudoku game.
	 * @param opts Optional game options, including difficulty and solution.
	 * @returns The new started game.
	 */
	start(opts?: Partial<GameOpts>): Promise<IStartedGame>
}

export interface StartedGame {
	readonly board: IBoard
	mode: ModeKinds
	readonly pos: IPosition
}

export interface StartedGameOpts {
	data: StartedGame
	repo: GameRepo
}

export interface IGameState {
	/**
	 * Change the current mode within the game board.
	 * @param mode The new mode.
	 * @returns The updated game state.
	 */
	changeMode(mode: ModeKinds): IGameState
	/**
	 * Change the current position within the game board.
	 * @param position The new position.
	 * @returns The updated game state.
	 */
	changePos(position: Position): this
	/**
	 * Clear the value and notes at the selected cell on the game.
	 * @returns The updated game state object.
	 */
	clear(): this
	/**
	 * Move the current position down by a specified number of times.
	 * @param times The number of times to move down.
	 * @returns The updated game.
	 */
	moveDown(times: number): this
	/**
	 * Move the current position left by a specified number of times.
	 * @param times The number of times to move left.
	 * @returns The updated game.
	 */
	moveLeft(times: number): this
	/**
	 * Move the current position right by a specified number of times.
	 * @param times The number of times to move right.
	 * @returns The updated game.
	 */
	moveRight(times: number): this
	/**
	 * Move the current position up by a specified number of times.
	 * @param times The number of times to move up.
	 * @returns The updated game.
	 */
	moveUp(times: number): this
	/**
	 * Checks if the value of the selected cell is correct.
	 * @param Solution for this Cell.
	 * @returns The updated game state.
	 */
	verify(): this
	/**
	 * Write a valid number as value or notes depending on the game mode in the selected cell.
	 * @param num The valid number to write.
	 * @returns The updated game state.
	 */
	write(num: ValidNumbers): this
}

export interface IStartedGame {
	/** Get the game board data as a JSON Object. */
	readonly board: BoardJSON
	/** Get if the game has started. */
	readonly isStarted: true
	/** Get the game mode. */
	readonly mode: ModeKinds
	/**
	 * Change the current mode within the game board.
	 * @param mode The new mode.
	 * @returns The updated game.
	 */
	changeMode(mode: ModeKinds): this
	/**
	 * Change the current position within the game board.
	 * @param position The new position.
	 * @returns The updated game.
	 */
	changePos(position: Position): this
	/**
	 * Clear the value and notes at the current position on the game board.
	 * @returns The updated game.
	 */
	clear(): this
	/**
	 * End the current game.
	 * @returns The new Non-started game.
	 */
	end(): Promise<INonStartedGame>
	/**
	 * Move the current position down by a specified number of times.
	 * @param times The number of times to move down.
	 * @returns The updated game.
	 */
	moveDown(times: number): this
	/**
	 * Move the current position left by a specified number of times.
	 * @param times The number of times to move left.
	 * @returns The updated game.
	 */
	moveLeft(times: number): this
	/**
	 * Move the current position right by a specified number of times.
	 * @param times The number of times to move right.
	 * @returns The updated game.
	 */
	moveRight(times: number): this
	/**
	 * Move the current position up by a specified number of times.
	 * @param times The number of times to move up.
	 * @returns The updated game.
	 */
	moveUp(times: number): this
	/** Save the current game state. */
	save(): Promise<void>
	/**
	 * Write a valid number as value or notes depending on the game mode in the current position cell.
	 * @param num The valid number to write.
	 */
	write(num: ValidNumbers): this
}

export type IGame = INonStartedGame | IStartedGame
