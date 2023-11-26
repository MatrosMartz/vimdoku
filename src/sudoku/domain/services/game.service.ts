import type { Pos } from '~/share/domain/models'
import { PosSvc } from '~/share/domain/services'
import type { OptionalKeys } from '~/share/types'

import { type Board, DifficultyKinds, type GameOpts, type ITimer, ModeKinds, type ValidNumbers } from '../models'
import type { Game, IGame, IGameState, StartedGameOpts } from '../models/game.model'
import type { GameRepo } from '../repositories'
import { BoardSvc } from './board.service'
import { SolutionSvc } from './solution.service'
import { TimerSvc } from './timer.service'

/** Simulated key for protected field. */
const repo = Symbol('board-repo')

abstract class GameSvc implements IGame {
	protected readonly [repo]: GameRepo
	abstract readonly board: Board | null
	abstract readonly isASaved: boolean
	abstract readonly isStarted: boolean
	abstract readonly mode: ModeKinds
	abstract readonly position: Pos
	abstract readonly timer: string

	/**
	 * Creates an instance of the NonStartedGameSvc class.
	 * @param repo The repository for game data.
	 */
	constructor(gRepo: GameRepo) {
		this[repo] = gRepo
	}

	changeMode(mode: ModeKinds) {
		return this
	}

	changePos(position: Pos) {
		return this
	}

	clear() {
		return this
	}

	async end(): Promise<IGame> {
		return this
	}

	async load() {}

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
export class NonStartedGameSvc extends GameSvc {
	readonly board = null
	readonly isStarted = false
	readonly mode = ModeKinds.X
	readonly position = { ...PosSvc.IDLE_POS }
	readonly timer = TimerSvc.IDLE_TIMER

	#isASaved = false

	get isASaved() {
		return this.#isASaved
	}

	async load() {
		this.#isASaved = (await this[repo].hasBoard()) || (await this[repo].hasOpts())
	}

	async resume() {
		const boardData = await this[repo].getBoard()
		const optsData = await this[repo].getOpts()
		const timerData = (await this[repo].getTimer()) ?? 0

		if (boardData == null || optsData == null) return null

		const data = new StartedGameData({
			board: BoardSvc.fromJSON(boardData, optsData.solution),
			pos: new PosSvc(),
		})

		return new StartedGameSvc({ data, repo: this[repo], timer: Number(timerData) })
	}

	async start(opts?: Partial<GameOpts>): Promise<StartedGameSvc>
	async start({ difficulty = DifficultyKinds.Beginner, solution = SolutionSvc.create() }: Partial<GameOpts> = {}) {
		const board = BoardSvc.create({ difficulty, solution })

		await this[repo].create({ difficulty, solution: solution.toJSON() }, board.toJSON())

		const data = new StartedGameData({ board, pos: new PosSvc() })

		return new StartedGameSvc({ data, repo: this[repo], timer: 0 })
	}
}

class StartedGameData implements Game {
	readonly board
	mode
	readonly pos

	constructor({ board, mode = ModeKinds.X, pos }: OptionalKeys<Game, 'mode'>) {
		this.board = board
		this.mode = mode
		this.pos = pos
	}
}

/** Represent a Started Sudoku Game Service. */
class StartedGameSvc extends GameSvc {
	readonly isASaved = true
	readonly isStarted = true
	readonly #data
	#state: IGameState
	readonly #timer: ITimer

	/**
	 * Creates an instance of the StartedGameSvc class.
	 * @param opts Options for th[StartedGam]eSvc (game data and repository).
	 */
	constructor(opts: StartedGameOpts)
	constructor({ data, repo, timer }: StartedGameOpts) {
		super(repo)
		this.#data = data
		this.#state = GameState.create(data, data.mode)
		this.#timer = new TimerSvc(timer)
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

	changePos(position: Pos) {
		this.#state.changePos(position)
		return this
	}

	clear() {
		this.#state.clear()
		return this
	}

	async end() {
		await this[repo].delete()
		return new NonStartedGameSvc(this[repo])
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
			case ModeKinds.A:
				return new AnnotationGameState(data)
			case ModeKinds.I:
				return new InsertGameState(data)
			case ModeKinds.X:
				return new NormalGameState(data)
		}
	}

	changeMode(mode: ModeKinds) {
		return GameState.create(this[data], mode)
	}

	changePos(position: Pos) {
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

class InsertGameState extends EditedGameState {
	write(num: ValidNumbers) {
		this[data].board.write(this[data].pos.data, num)
		return this
	}
}

class NormalGameState extends GameState {}
