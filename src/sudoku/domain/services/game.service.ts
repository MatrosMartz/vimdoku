import type { Position } from '~/share/domain/models'
import { PositionService } from '~/share/domain/services'
import type { OptionalKeys } from '~/share/types'

import { DifficultyKinds, type GameOpts, type ITimer, ModeKinds, type ValidNumbers } from '../models'
import type { Game, IGame, IGameState, StartedGameOpts } from '../models/game.model'
import type { GameRepo } from '../repositories'
import { BoardService } from './board.service'
import { SolutionService } from './solution.service'
import { TimerService } from './timer.service'

/** Simulated key for protected field. */
const repo = Symbol('board-repo')

abstract class GameService implements IGame {
	abstract readonly mode?: ModeKinds | null
	abstract readonly position?: Position | null
	abstract readonly timer?: string | null
	protected readonly [repo]: GameRepo
	abstract readonly isStarted: boolean

	/**
	 * Creates an instance of the NonStartedGameService class.
	 * @param repo The repository for game data.
	 */
	constructor(repo: GameRepo)
	constructor(gRepo: GameRepo) {
		this[repo] = gRepo
	}

	changeMode(mode: ModeKinds) {
		return this
	}

	changePos(position: Position) {
		return this
	}

	clear() {
		return this
	}

	async end(): Promise<IGame> {
		return this
	}

	moveDown(times: number) {
		return this
	}

	moveLeft(times: number) {
		return this
	}

	moveRight(times: number) {
		return this
	}

	moveUp(times: number) {
		return this
	}

	async resume(): Promise<IGame | null> {
		return this
	}

	async save(): Promise<void> {}

	async start(opts?: Partial<GameOpts> | undefined): Promise<IGame> {
		return this
	}

	timerDec() {
		return this
	}

	timerInc() {
		return this
	}

	write(num: ValidNumbers) {
		return this
	}
}

/** Represent a Non-started Sudoku Game Service. */
export class NonStartedGameService extends GameService {
	readonly board = null
	readonly isStarted = false
	readonly mode = null
	readonly position = null
	readonly timer = null

	async resume() {
		const boardData = await this[repo].getBoard()
		const optsData = await this[repo].getOpts()
		const timerData = await this[repo].getTimer()

		if (boardData == null || optsData == null || timerData == null) return null

		const data = new StartedGameData({
			board: BoardService.fromJSON(boardData, optsData.solution),
			pos: new PositionService(),
		})

		return new StartedGameService({ data, repo: this[repo], timer: Number(timerData) })
	}

	async start(opts?: Partial<GameOpts>): Promise<StartedGameService>
	async start({ difficulty = DifficultyKinds.Beginner, solution = SolutionService.create() }: Partial<GameOpts> = {}) {
		const board = BoardService.create({ difficulty, solution })

		await this[repo].create({ difficulty, solution: solution.toJSON() }, board.toJSON())

		const data = new StartedGameData({ board, pos: new PositionService() })

		return new StartedGameService({ data, repo: this[repo], timer: 0 })
	}
}

class StartedGameData implements Game {
	readonly board
	mode
	readonly pos

	constructor({ board, mode = ModeKinds.Normal, pos }: OptionalKeys<Game, 'mode'>) {
		this.board = board
		this.mode = mode
		this.pos = pos
	}
}

/** Represent a Started Sudoku Game Service. */
class StartedGameService extends GameService {
	readonly isStarted = true
	#data
	#state: IGameState
	#timer: ITimer

	/**
	 * Creates an instance of the StartedGameService class.
	 * @param opts Options for th[StartedGam]eService (game data and repository).
	 */
	constructor(opts: StartedGameOpts)
	constructor({ data, repo, timer }: StartedGameOpts) {
		super(repo)
		this.#data = data
		this.#state = GameState.create(data, data.mode)
		this.#timer = new TimerService(timer)
	}

	get board() {
		return this.#data.board.data
	}

	get mode() {
		return this.#data.mode
	}

	get position() {
		return this.#data.pos.data
	}

	get timer() {
		return this.#timer.toString()
	}

	changeMode(mode: ModeKinds) {
		this.#state = this.#state.changeMode(mode)
		return this
	}

	changePos(position: Position) {
		this.#state.changePos(position)
		return this
	}

	clear() {
		this.#state.clear()
		return this
	}

	async end() {
		await this[repo].delete()
		return new NonStartedGameService(this[repo])
	}

	moveDown(times: number) {
		this.#state.moveDown(times)
		return this
	}

	moveLeft(times: number) {
		this.#state.moveLeft(times)
		return this
	}

	moveRight(times: number) {
		this.#state.moveRight(times)
		return this
	}

	moveUp(times: number) {
		this.#state.moveUp(times)
		return this
	}

	async save(): Promise<void> {
		await this[repo].save({ board: this.#data.board.toJSON(), timer: this.#timer.data })
	}

	timerDec() {
		this.#timer.dec()
		return this
	}

	timerInc() {
		this.#timer.inc()
		return this
	}

	write(num: ValidNumbers) {
		this.#state.write(num)
		return this
	}
}

/** Simulated key for protected field. */
const data = Symbol('game-data')

abstract class GameState implements IGameState {
	protected [data]: StartedGameData

	constructor(data: StartedGameData)
	constructor(gData: StartedGameData) {
		this[data] = gData
	}

	/**
	 * Create an instance of GameState with options.
	 * @param data The game data with create instance.
	 * @param mode The value to set.
	 */
	static create(data: StartedGameData, mode: ModeKinds): GameState {
		data.mode = mode
		switch (mode) {
			case ModeKinds.Annotation:
				return new AnnotationGameState(data)
			case ModeKinds.Command:
				return new CommandGameState(data)
			case ModeKinds.Insert:
				return new InsertGameState(data)
			case ModeKinds.Normal:
				return new NormalGameState(data)
		}
	}

	changeMode(mode: ModeKinds) {
		return GameState.create(this[data], mode)
	}

	changePos(position: Position) {
		this[data].pos.change(position)
		return this
	}

	clear() {
		return this
	}

	moveDown(times: number) {
		this[data].pos.moveDown(times)
		return this
	}

	moveLeft(times: number) {
		this[data].pos.moveLeft(times)
		return this
	}

	moveRight(times: number) {
		this[data].pos.moveRight(times)
		return this
	}

	moveUp(times: number) {
		this[data].pos.moveUp(times)
		return this
	}

	verify() {
		return this
	}

	write(num: ValidNumbers) {
		return this
	}
}

abstract class EditedGameState extends GameState {
	clear() {
		this[data].board.clear(this[data].pos.data)
		return this
	}
}

class AnnotationGameState extends EditedGameState {
	write(num: ValidNumbers) {
		this[data].board.toggleNotes(this[data].pos.data, num)
		return this
	}
}

class CommandGameState extends GameState {}

class InsertGameState extends EditedGameState {
	write(num: ValidNumbers) {
		this[data].board.write(this[data].pos.data, num)
		return this
	}
}

class NormalGameState extends GameState {}
