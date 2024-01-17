import { IDLE_POS, type Pos } from '~/share/domain/entities'
import { PosSvc } from '~/share/domain/services'
import { inject, match } from '~/share/utils'

import { type ValidNumbers } from '../entities'
import { type Board, IDLE_MODE, IDLE_TIMER, ModeKind } from '../models'
import { type Game, type IGame, type IGameState, type StartedGameOpts } from '../models/game.model'
import { type GameOpts } from '../models/game-options.model'
import type { GameRepo } from '../repositories'
import { BoardSvc } from './board.service'
import { ModeObs, SavedObs } from './sudoku-obs.service'
import { TimerSvc } from './timer.service'

/** Simulated key for protected field. */
const savedObs = Symbol('board-obs')
/** Simulated key for protected field. */
const repo = Symbol('board-repo')

abstract class GameSvc implements IGame {
	protected readonly [repo]: GameRepo
	protected readonly [savedObs] = inject(SavedObs)
	abstract readonly board: Board | null
	abstract readonly errors: number
	abstract readonly hasWin: boolean
	abstract readonly isASaved: boolean
	abstract readonly isStarted: boolean
	abstract readonly mode: ModeKind
	abstract readonly pos: Pos
	abstract readonly timer: string

	/**
	 * Creates an instance of the NonStartedGameSvc class.
	 * @param repo The repository for game data.
	 */
	constructor(repo: GameRepo)
	constructor(gRepo: GameRepo) {
		this[repo] = gRepo
	}

	changeMode(mode: ModeKind) {
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

	redo() {
		return this
	}

	async resume(): Promise<IGame | null> {
		return this
	}

	async save(): Promise<void> {}

	async start(opts: GameOpts): Promise<IGame> {
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

	undo() {
		return this
	}

	verify() {
		return this
	}

	write(num: ValidNumbers, opts: { removeNotes: boolean; validate: boolean }) {
		return this
	}
}

/** Represent a Non-started Sudoku Game Service. */
export class NonStartedGameSvc extends GameSvc {
	readonly board = null
	readonly errors = 0
	readonly hasWin = false
	readonly isStarted = false
	readonly mode = ModeKind.X
	readonly pos = IDLE_POS
	readonly timer = IDLE_TIMER

	#isASaved = false

	/**
	 * Creates an instance of the NonStartedGameSvc class.
	 * @param repo The repository for game data.
	 */
	constructor(repo: GameRepo) {
		super(repo)
		this[savedObs].set(false)
	}

	get isASaved() {
		return this.#isASaved
	}

	async load() {
		this.#isASaved = await this[repo].hasData()
		this[savedObs].set(this.#isASaved)
	}

	async resume() {
		if (!(await this[repo].hasData())) return null

		const boardData = await this[repo].getBoard()
		const optsData = await this[repo].getOpts()
		const infoData = await this[repo].getInfo()

		const board = BoardSvc.fromJSON(boardData, optsData.solution, infoData.errors)
		const timer = new TimerSvc().set(infoData.timer)

		const data = new StartedGameData({ board, errors: infoData.errors, mode: IDLE_MODE, pos: new PosSvc(), timer })

		return new StartedGameSvc({ data, repo: this[repo] })
	}

	async start(opts: GameOpts): Promise<StartedGameSvc>
	async start({ difficulty, solution }: GameOpts) {
		const board = BoardSvc.create({ difficulty, solution }, 0)

		await this[repo].create({
			board: board.toJSON(),
			info: { errors: 0, timer: 0 },
			opts: { difficulty, solution: solution.toJSON() },
		})

		const data = new StartedGameData({ board, errors: 0, mode: IDLE_MODE, pos: new PosSvc(), timer: new TimerSvc() })

		return new StartedGameSvc({ data, repo: this[repo] })
	}
}

class StartedGameData implements Game {
	readonly board
	errors
	mode
	readonly pos
	timer

	constructor(data: Game) {
		this.board = data.board
		this.errors = data.errors
		this.mode = data.mode
		this.pos = data.pos
		this.timer = data.timer
	}
}

/** Represent a Started Sudoku Game Service. */
class StartedGameSvc extends GameSvc {
	readonly isStarted = true
	readonly #data
	#isASaved = true
	readonly #modeObs = inject(ModeObs)
	#state: IGameState

	/**
	 * Creates an instance of the StartedGameSvc class.
	 * @param opts Options for th[StartedGam]eSvc (game data and repository).
	 */
	constructor(opts: StartedGameOpts) {
		super(opts.repo)
		this.#data = opts.data
		this.#state = GameState.create(opts.data, opts.data.mode)
		this[savedObs].set(true)
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

	changeMode(mode: ModeKind) {
		this.#state = this.#state.changeMode(mode)
		this.#modeObs.set(this.mode)
		return this
	}

	changePos(position: Pos) {
		this.#state.changePos(position)
		return this
	}

	clear() {
		this.#state.clear()
		this.#isASaved = false
		this[savedObs].set(false)
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

	redo() {
		this.#state.redo()
		return this
	}

	async save(): Promise<void> {
		await this[repo].save({
			board: this.#data.board.toJSON(),
			info: { errors: this.#data.errors, timer: this.#data.timer.data },
		})
		this.#isASaved = true
		this[savedObs].set(true)
	}

	timerPause() {
		this.#data.timer.pause()
		return this
	}

	timerReset() {
		this.#data.timer.reset()
		return this
	}

	timerStart() {
		this.#data.timer.start()
		return this
	}

	undo() {
		this.#state.undo()

		return this
	}

	verify() {
		this.#state = this.#state.verify()
		this.#isASaved = false
		this[savedObs].set(false)
		return this
	}

	write(num: ValidNumbers, opts: { removeNotes: boolean; validate: boolean }) {
		this.#state = this.#state.write(num, opts)
		if (opts.validate) this.#state.validateWrite()

		this.#isASaved = false
		this[savedObs].set(false)
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
	 * @returns A new state.
	 */
	static create(data: StartedGameData, mode: ModeKind): GameState {
		data.mode = mode
		return match(mode, {
			[ModeKind.N]: () => new AnnotationGameState(data),
			[ModeKind.I]: () => new InsertGameState(data),
			[ModeKind.V]: () => new VisualGameState(data),
			[ModeKind.X]: () => new NormalGameState(data),
		})
	}

	changeMode(mode: ModeKind) {
		return GameState.create(this[data], mode)
	}

	changePos(position: Pos) {
		this[data].pos.set(position)
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

	redo() {
		return this
	}

	undo() {
		return this
	}

	validateWrite() {
		return this
	}

	verify() {
		this[data].board.validateAllBoard()
		return this
	}

	write(num: ValidNumbers, opts: { removeNotes: boolean }) {
		return this
	}
}

abstract class EditedGameState extends GameState {
	clear() {
		this[data].board.clear(this[data].pos.data)
		return this
	}

	redo() {
		this[data].board.redo()
		return this
	}

	undo() {
		this[data].board.undo()
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
		this[data].board.validate(this[data].pos.data)

		return this
	}

	write(num: ValidNumbers, { removeNotes }: { removeNotes: boolean }) {
		this[data].board.write(this[data].pos.data, num)
		if (removeNotes) this[data].board.noteDeletion(this[data].pos.data, num)
		return this
	}
}

class VisualGameState extends GameState {}

class NormalGameState extends GameState {}
