import type { IPos, Pos } from '~/share/domain/models'

import type { GameRepo } from '../repositories'
import type { Board, IBoard } from './board.model'
import type { GameInfo, GameOpts } from './game-options.model'
import type { ModeKinds } from './modes.model'
import type { ValidNumbers } from './notes.model'

export interface Game {
	readonly board: IBoard
	mode: ModeKinds
	readonly pos: IPos
}

export interface StartedGameOpts {
	data: Game
	info: GameInfo
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
	changePos(position: Pos): this
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
	 * Write a valid number as value or notes depending on the game mode in the current position cell.
	 * @param num The valid number to write.
	 * @param removeNotes Indicates if it should remove the related notes.
	 */
	write(num: ValidNumbers, removeNotes?: boolean): this
}

export interface IGame {
	/** Get the game board data as a JSON Object. */
	readonly board: Board | null
	/** Get the errors that have been found in the current game. */
	readonly errors: number
	/** Get if there is a saved game. */
	readonly isASaved: boolean
	/** Get if the game has started. */
	readonly isStarted: boolean
	/** Get the game mode. */
	readonly mode: ModeKinds
	/** Get the current position. */
	readonly pos: Pos
	/** Get the current value of timer. */
	readonly timer: string
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
	changePos(position: Pos): this
	/**
	 * Clear the value and notes at the current position on the game board.
	 * @returns The updated game.
	 */
	clear(): this
	/**
	 * End the current game.
	 * @returns The new Non-started game.
	 */
	end(): Promise<IGame>
	/** Load from the repo. */
	load(): Promise<void>
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
	 * Resumes a previously started Sudoku game.
	 * @returns The saved game exists.
	 */
	resume(): Promise<IGame | null>
	/** Save the current game state. */
	save(): Promise<void>
	/**
	 * Starts a new Sudoku game.
	 * @param opts Optional game options, including difficulty and solution.
	 * @returns The new started game.
	 */
	start(opts?: Partial<GameOpts>): Promise<IGame>
	timerDec(): this
	timerInc(): this
	/**
	 * Check if any cell values are incorrect.
	 * @returns The updated game.
	 */
	verify(): this
	/**
	 * Write a valid number as value or notes depending on the game mode in the current position cell.
	 * @param num The valid number to write.
	 * @param removeNotes Indicates if it should remove the related notes.
	 */
	write(num: ValidNumbers, removeNotes?: boolean): this
}
