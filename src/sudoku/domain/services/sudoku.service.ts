import { IDLE_POS, type Pos, type PosData } from '~/share/domain/entities'
import { PosSvc } from '~/share/domain/services'
import { inject } from '~/share/utils'

import { type ValidNumbers } from '../entities'
import type { DifficultyKind, IGame, ISudoku, SudokuSetts } from '../models'
import { ModeKind } from '../models'
import type { SudokuRepo } from '../repositories'
import { BoardSvc } from './board.service'
import { GameSvc } from './game.service'
import { ModeObs, SavedObs } from './sudoku-obs.service'
import { TimerSvc } from './timer.service'

interface SudokuOpts {
	repo: SudokuRepo
}

export class SudokuSvc implements ISudoku {
	#difficulty?: DifficultyKind
	#game?: IGame | null = null
	readonly #modeObs = inject(ModeObs)
	readonly #pos
	readonly #repo
	readonly #savedObs = inject(SavedObs)
	readonly #timer

	constructor({ repo }: SudokuOpts) {
		this.#pos = new PosSvc()
		this.#repo = repo
		this.#timer = new TimerSvc()
	}

	get difficulty() {
		return this.#difficulty
	}

	get hasWin() {
		return this.#game?.hasWin ?? false
	}

	get isASaved() {
		return this.#savedObs.data
	}

	changeMode(mode: ModeKind) {
		this.#game = this.#game?.changeMode(mode)
		this.#modeObs.set(mode)
		return this
	}

	clear() {
		this.#game?.clear()
		this.#savedObs.set(false)
		return this
	}

	continue() {
		if (this.#game != null) this.#timer.start()
		return this
	}

	async end() {
		await this.#repo.delete()
		this.#game = null
		this.#timer.pause().reset()
		this.#savedObs.set(false)
	}

	async load() {
		this.#savedObs.set(await this.#repo.hasData())
		this.#game = null
		this.#timer.pause().reset()
		this.#modeObs.set(ModeKind.X)
		this.#pos.set(IDLE_POS)
	}

	move(dir: 'Down' | 'Left' | 'Right' | 'Up', times: number) {
		this.#game?.move(dir, times)
		return this
	}

	moveTo(position: Pos<PosData>) {
		this.#game?.moveTo(position)
		return this
	}

	pause() {
		if (this.#game != null) this.#timer.pause()

		return this
	}

	redo() {
		this.#game?.redo()
		return this
	}

	async resume(withTimer: boolean) {
		if (this.#game != null || !(await this.#repo.hasData())) return

		const boardData = await this.#repo.getBoard()
		const settsData = await this.#repo.getSetts()
		const infoData = await this.#repo.getInfo()

		this.#difficulty = settsData.difficulty

		this.#game = GameSvc.create(
			{ board: BoardSvc.fromJSON(boardData, settsData.solution, infoData.errors), pos: this.#pos },
			ModeKind.X
		)
		if (withTimer) this.#timer.set(infoData.timer).start()
	}

	async save() {
		if (this.#game == null) return

		await this.#repo.save({
			board: this.#game.toJSON(),
			info: { errors: this.#game.errors, timer: this.#timer.data },
		})

		this.#savedObs.set(true)
	}

	async start(setts: SudokuSetts, withTimer: boolean) {
		const board = BoardSvc.create(setts, 0)

		this.#difficulty = setts.difficulty

		await this.#repo.create({
			board: board.toJSON(),
			info: { errors: 0, timer: 0 },
			setts: { difficulty: setts.difficulty, solution: setts.solution.toJSON() },
		})

		if (withTimer) this.#timer.reset().start()
		this.#game = GameSvc.create({ board, pos: this.#pos }, ModeKind.X)
	}

	undo() {
		this.#game?.undo()
		return this
	}

	verify() {
		this.#game?.verify()
		this.#savedObs.set(false)
		return this
	}

	write(num: ValidNumbers, opts: { removeNotes: boolean; validate: boolean }) {
		this.#game?.write(num, opts)
		this.#savedObs.set(false)
		return this
	}
}
