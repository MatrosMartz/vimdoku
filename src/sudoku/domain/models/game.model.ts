import type { IPosition, Position } from '~/share/domain/models'

import type { GameRepo } from '../repositories'
import type { BoardJSON, IBoard } from './board.model'
import type { GameOpts } from './game-options.model'
import type { ModeKinds } from './modes.model'
import type { ValidNumbers } from './notes.model'

export enum GameState {
	NonStarted = 'non-started',
	Started = 'started',
}

export interface INonStartedGame {
	/** Resumes a previously started Sudoku game. */
	resume(): Promise<INormalGame | null>
	/**
	 * Starts a new Sudoku game.
	 * @param opts Optional game options, including difficulty and solution.
	 */
	start(opts?: Partial<GameOpts>): Promise<IInsertGame>
	/** Get the state of the game as "NonStarted". */
	get state(): GameState.NonStarted
}

export interface StartedGameOpts {
	board: IBoard
	pos: IPosition
	repo: GameRepo
}

export interface IStartedGameRoot {
	/**
	 * Change the current position within the game board.
	 * @param position The new position.
	 */
	changePos(position: Position): this
	/** Delete the current game and returns a Non-started Game. */
	delete(): Promise<INonStartedGame>
	/** Get the game board data as a JSON object. */
	getBoard(): Promise<BoardJSON>
	/**
	 * Move the current position down by a specified number of times.
	 * @param times The number of times to move down.
	 */
	moveDown(times: number): this
	/**
	 * Move the current position left by a specified number of times.
	 * @param times The number of times to move left.
	 */
	moveLeft(times: number): this
	/**
	 * Move the current position right by a specified number of times.
	 * @param times The number of times to move right.
	 */
	moveRight(times: number): this
	/**
	 * Move the current position up by a specified number of times.
	 * @param times The number of times to move up.
	 */
	moveUp(times: number): this
	/** Save the current game state. */
	save(board: BoardJSON): Promise<void>
	/** Get the state of the game as "Started". */
	get state(): GameState.Started
}

export interface IWritableGame extends IStartedGameRoot {
	/** Clear the value at the current position on the game board. */
	clear(): this
}

export interface IAnnotationGame extends IWritableGame {
	/** Change the game mode to "Command". */
	changeToCommand(): ICommandGame
	/** Change the game mode to "Insert". */
	changeToInsert(): IInsertGame
	/** Get the game mode as "Normal". */
	changeToNormal(): INormalGame
	/** Get the game mode as "Annotation". */
	get mode(): ModeKinds.Annotation
	/**
	 * Toggle a note for a valid number at the current position on the game board.
	 * @param num The valid number to toggle as a note.
	 */
	toggleNote(num: ValidNumbers): this
}

export interface ICommandGame extends IStartedGameRoot {
	/** Get the game mode as "Annotation". */
	changeToAnnotation(): IAnnotationGame
	/** Change the game mode to "Insert". */
	changeToInsert(): IInsertGame
	/** Get the game mode as "Normal". */
	changeToNormal(): INormalGame
	/** Get the game mode as "Command". */
	get mode(): ModeKinds.Command
}

export interface IInsertGame extends IWritableGame {
	/** Get the game mode as "Annotation". */
	changeToAnnotation(): IAnnotationGame
	/** Change the game mode to "Command". */
	changeToCommand(): ICommandGame
	/** Get the game mode as "Normal". */
	changeToNormal(): INormalGame
	/** Get the game mode as "Insert". */
	get mode(): ModeKinds.Insert
	/**
	 * Write a valid number at the current position on the game board.
	 * @param num The valid number to write.
	 */
	write(num: ValidNumbers): this
}

export interface INormalGame extends IStartedGameRoot {
	/** Get the game mode as "Annotation". */
	changeToAnnotation(): IAnnotationGame
	/** Change the game mode to "Command". */
	changeToCommand(): ICommandGame
	/** Change the game mode to "Insert". */
	changeToInsert(): IInsertGame
	/** Get the game mode as "Normal". */
	get mode(): ModeKinds.Normal
}

export type IStartedGame = IAnnotationGame | ICommandGame | IInsertGame | INormalGame

export type IGame = INonStartedGame | IStartedGame
