import { Pos } from '~/share/domain/entities'
import { PosSvc } from '~/share/domain/services'
import { inject } from '~/share/utils'
import { Modes } from '$cmd/domain/const'

import { type ValidNumbers } from '../entities'
import type { BoardJSON, IGame, ISudoku, SudokuInfo, SudokuSetts, SudokuSettsJSON } from '../models'
import type { SudokuRepos } from '../repositories'
import { BoardSvc } from './board.service'
import { GameSvc } from './game.service'
import { ModeObs, SavedObs } from './sudoku-obs.service'
import { TimerSvc } from './timer.service'

export class SudokuSvc implements ISudoku {
	#game?: IGame | null = null
	readonly #clear
	#data: { board?: BoardJSON; info?: SudokuInfo; setts?: SudokuSettsJSON } = {}
	readonly #modeObs = inject(ModeObs)
	readonly #pos
	readonly #save
	readonly #savedObs = inject(SavedObs)
	readonly #timer

	constructor(save: (data: SudokuRepos.Data) => Promise<void>, clear: () => Promise<void>) {
		this.#pos = new PosSvc()
		this.#save = save
		this.#clear = clear
		this.#timer = new TimerSvc()
	}

	get hasWin() {
		return this.#game?.hasWin ?? false
	}

	get isASaved() {
		return this.#savedObs.data
	}

	get setts() {
		return this.#data.setts
	}

	static create(repo: SudokuRepos.All) {
		return new SudokuSvc(repo.save, repo.clear)
	}

	changeMode(mode: Modes.Kind) {
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
		this.#data = {}
		await this.#clear()
		this.#game = null
		this.#timer.pause().reset()
		this.#pos.set(Pos.IDLE)
		this.#savedObs.set(false)
	}

	move(dir: 'Down' | 'Left' | 'Right' | 'Up', times: number) {
		this.#game?.move(dir, times)
		return this
	}

	moveTo(position: Pos.Pos) {
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

	resume(withTimer: boolean) {
		const { board, info, setts } = this.#data

		if (this.#game != null || board == null || info == null || setts == null) return this

		this.#data.setts = setts

		this.#game = GameSvc.create(
			{ board: BoardSvc.fromJSON(board, setts.solution, info.errors), pos: this.#pos },
			Modes.Kind.X
		)
		if (withTimer) this.#timer.set(info.timer).start()
		this.#modeObs.set(Modes.Kind.X)
		this.#pos.set(Pos.IDLE)
		return this
	}

	async save() {
		if (this.#game == null) return

		await this.#save({
			board: this.#game.toJSON(),
			info: { errors: this.#game.errors, timer: this.#timer.data },
		})

		this.#savedObs.set(true)
	}

	setData(data: { board?: BoardJSON; info?: SudokuInfo; setts?: SudokuSettsJSON }) {
		this.#data = { ...data }
		this.#savedObs.set(data.board != null && data.info != null && data.setts != null)
		return this
	}

	start(setts: SudokuSetts, withTimer: boolean) {
		const board = BoardSvc.create(setts, 0)

		this.#data.setts = {
			difficulty: setts.difficulty,
			solution: setts.solution.toJSON(),
		}

		if (withTimer) this.#timer.reset().start()
		this.#game = GameSvc.create({ board, pos: this.#pos }, Modes.Kind.X)
		this.#modeObs.set(Modes.Kind.X)
		this.#pos.set(Pos.IDLE)
		return this
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
