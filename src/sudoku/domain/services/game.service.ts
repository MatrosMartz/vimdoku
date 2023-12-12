import type { Pos } from '~/share/domain/models'
import { PosSvc } from '~/share/domain/services'
import type { OptionalKeys } from '~/share/types'
import { match } from '~/share/utils'

import { type Board, DifficultyKinds, ModeKinds, type ValidNumbers } from '../models'
import {
	type Game,
	type GameObs,
	type IGame,
	type IGameState,
	type NonStartedGameOpts,
	type StartedGameOpts,
} from '../models/game.model'
import { type GameOpts } from '../models/game-options.model'
import type { GameRepo } from '../repositories'
import { BoardSvc } from './board.service'
import { SolutionSvc } from './solution.service'
import { TimerSvc } from './timer.service'

/** Simulated key for protected field. */
const obs = Symbol('board-obs')
/** Simulated key for protected field. */
const repo = Symbol('board-repo')

abstract class GameSvc implements IGame {
	protected readonly [obs]: GameObs
	protected readonly [repo]: GameRepo
	abstract readonly board: Board | null
	abstract readonly errors: number
	abstract readonly hasWin: boolean
	abstract readonly isASaved: boolean
	abstract readonly isStarted: boolean
	abstract readonly mode: ModeKinds
	abstract readonly pos: Pos
	abstract readonly timer: string

	/**
	 * Creates an instance of the NonStartedGameSvc class.
	 * @param repo The repository for game data.
	 */
	constructor(opts: NonStartedGameOpts) {
		this[obs] = opts.obs
		this[repo] = opts.repo
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

	timerPause() {
		return this
	}

	timerReset() {
		return this
	}

	timerStart() {
		return this
	}

	verify() {
		return this
	}

	write(num: ValidNumbers, removeNotes?: boolean, validate?: boolean) {
		return this
	}
}

/** Represent a Non-started Sudoku Game Service. */
export class NonStartedGameSvc extends GameSvc {
	readonly board = null
	readonly errors = 0
	readonly hasWin = false
	readonly isStarted = false
	readonly mode = ModeKinds.X
	readonly pos = { ...PosSvc.IDLE_POS }
	readonly timer = TimerSvc.IDLE_STR

	#isASaved = false

	/**
	 * Creates an instance of the NonStartedGameSvc class.
	 * @param repo The repository for game data.
	 */
	constructor(opts: NonStartedGameOpts) {
		super(opts)
		this[obs].saved.update(false)
	}

	get isASaved() {
		return this.#isASaved
	}

	async load() {
		this.#isASaved = await this[repo].hasData()
		this[obs].saved.update(this.#isASaved)
	}

	async resume() {
		if (!(await this[repo].hasData())) return null

		const boardData = await this[repo].getBoard()
		const optsData = await this[repo].getOpts()
		const infoData = await this[repo].getInfo()

		const data = new StartedGameData({
			board: BoardSvc.fromJSON(boardData, optsData.solution),
			errors: infoData.errors,
			pos: new PosSvc(),
			timer: new TimerSvc(infoData.timer),
		})

		return new StartedGameSvc({ data, obs: this[obs], repo: this[repo] })
	}

	async start(opts?: Partial<GameOpts>): Promise<StartedGameSvc>
	async start({ difficulty = DifficultyKinds.Beginner, solution = SolutionSvc.create() }: Partial<GameOpts> = {}) {
		const board = BoardSvc.create({ difficulty, solution })

		await this[repo].create({ board: board.toJSON(), opts: { difficulty, solution: solution.toJSON() } })

		const data = new StartedGameData({ board, pos: new PosSvc() })

		return new StartedGameSvc({ data, obs: this[obs], repo: this[repo] })
	}
}

class StartedGameData implements Game {
	readonly board
	errors
	mode
	readonly pos
	timer

	constructor({
		board,
		errors = 0,
		mode = ModeKinds.X,
		pos,
		timer = new TimerSvc(0),
	}: OptionalKeys<Game, 'mode' | 'errors' | 'timer'>) {
		this.board = board
		this.errors = errors
		this.mode = mode
		this.pos = pos
		this.timer = timer
	}
}

/** Represent a Started Sudoku Game Service. */
class StartedGameSvc extends GameSvc {
	readonly isStarted = true
	readonly #data
	#isASaved = true
	#state: IGameState

	/**
	 * Creates an instance of the StartedGameSvc class.
	 * @param opts Options for th[StartedGam]eSvc (game data and repository).
	 */
	constructor(opts: StartedGameOpts)
	constructor({ data, ...opts }: StartedGameOpts) {
		super(opts)
		this.#data = data
		this.#state = GameState.create(data, data.mode)
		this[obs].board.update(data.board.data)
		this[obs].saved.update(true)
	}

	get board() {
		return this.#data.board.data
	}

	get errors() {
		return this.#data.errors
	}

	get hasWin() {
		return this.#data.board.hasWin
	}

	get isASaved() {
		return this.#isASaved
	}

	get mode() {
		return this.#data.mode
	}

	get pos() {
		return this.#data.pos.data
	}

	get timer() {
		return this.#data.timer.toString()
	}

	changeMode(mode: ModeKinds) {
		this.#state = this.#state.changeMode(mode)
		this[obs].mode.update(this.mode)
		return this
	}

	changePos(position: Pos) {
		this.#state.changePos(position)
		this[obs].pos.update(this.pos)
		return this
	}

	clear() {
		this.#state.clear()
		this[obs].board.update(this.board)
		this.#isASaved = false
		this[obs].saved.update(false)
		return this
	}

	async end() {
		await this[repo].delete()

		return new NonStartedGameSvc({ obs: this[obs], repo: this[repo] })
	}

	moveDown(times: number) {
		this.#state.moveDown(times)
		this[obs].pos.update(this.pos)
		return this
	}

	moveLeft(times: number) {
		this.#state.moveLeft(times)
		this[obs].pos.update(this.pos)
		return this
	}

	moveRight(times: number) {
		this.#state.moveRight(times)
		this[obs].pos.update(this.pos)
		return this
	}

	moveUp(times: number) {
		this.#state.moveUp(times)
		this[obs].pos.update(this.pos)
		return this
	}

	async save(): Promise<void> {
		await this[repo].save({
			board: this.#data.board.toJSON(),
			info: { errors: this.#data.errors, timer: this.#data.timer.data },
		})
		this.#isASaved = true
		this[obs].saved.update(true)
	}

	timerPause() {
		this.#data.timer.pause()
		return this
	}

	timerReset() {
		this.#data.timer.reset()
		this[obs].timer.update(this.timer)
		return this
	}

	timerStart() {
		this.#data.timer.start(() => this[obs].timer.update(this.timer))
		return this
	}

	verify() {
		this.#state = this.#state.verify()
		this[obs].board.update(this.board)
		this.#isASaved = false
		this[obs].saved.update(false)
		this[obs].errors.update(this.#data.errors)
		return this
	}

	write(num: ValidNumbers, removeNotes = false, validate = false) {
		this.#state = this.#state.write(num, removeNotes)
		if (validate) {
			this.#state.validateWrite()
			this[obs].errors.update(this.#data.errors)
		}
		this[obs].board.update(this.board)
		this.#isASaved = false
		this[obs].saved.update(false)
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
		return match(mode, {
			[ModeKinds.N]: () => new AnnotationGameState(data),
			[ModeKinds.I]: () => new InsertGameState(data),
			[ModeKinds.V]: () => new VisualGameState(data),
			[ModeKinds.X]: () => new NormalGameState(data),
		})
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

	validateWrite() {
		return this
	}

	verify() {
		this[data].board.validateAllBoard(result => {
			if (result) this[data].errors++
		})
		return this
	}

	write(num: ValidNumbers, removeNotes?: boolean) {
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
	validateWrite() {
		this[data].board.validate(this[data].pos.data, result => {
			if (result) this[data].errors += 1
		})

		return this
	}

	write(num: ValidNumbers, removeNotes = false) {
		this[data].board.write(this[data].pos.data, num)
		if (removeNotes) this[data].board.noteDeletion(this[data].pos.data, num)
		return this
	}
}

class VisualGameState extends GameState {}

class NormalGameState extends GameState {}
