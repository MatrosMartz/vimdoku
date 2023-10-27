import { createBrowserStorage } from '~/share/infra/repositories'
import { createMatrix } from '~/share/utils'
import type { BoardJSON, CellJSON, GameOptsJSON } from '$sudoku/domain/models'
import type { GameRepo } from '$sudoku/domain/repositories'
import { GridService } from '$sudoku/domain/services'

interface StorageNames {
	board?: string
	notes?: string
	opts?: string
	timer?: string
}

type CellJSONStore = Omit<CellJSON, 'notes'>

export class BrowserGameRepo implements GameRepo {
	#boardStorage
	#notesStorage
	#optsStorage
	#timerStorage

	constructor({ board = 'board', notes = 'notes', opts = 'opts', timer = 'game-timer' }: StorageNames = {}) {
		this.#boardStorage = createBrowserStorage(board)
		this.#notesStorage = createBrowserStorage(notes)
		this.#optsStorage = createBrowserStorage(opts)
		this.#timerStorage = createBrowserStorage(timer)
	}

	async create(opts: GameOptsJSON, board: BoardJSON): Promise<void>
	async create({ difficulty, solution }: GameOptsJSON, board: BoardJSON) {
		const { boardJSON, notes } = new GridService(board).groupSubgrids(({ notes, ...boardJSON }) => ({
			boardJSON,
			notes,
		}))
		this.#boardStorage.set(JSON.stringify(boardJSON.data))
		this.#notesStorage.set(JSON.stringify(notes.data))
		this.#optsStorage.set(JSON.stringify({ difficulty, solution }))
	}

	async delete() {
		this.#boardStorage.del()
		this.#notesStorage.del()
		this.#optsStorage.del()
		this.#timerStorage.del()
	}

	async getBoard() {
		const board: CellJSONStore[][] = JSON.parse(this.#boardStorage.get()!)
		const notes: number[][] = JSON.parse(this.#notesStorage.get()!)

		if (board == null || notes == null) return null

		return createMatrix<CellJSON, 9>(9, ({ y, x }) => ({ ...board[y][x], notes: notes[y][x] }))
	}

	async getOpts() {
		const opts: GameOptsJSON | null = JSON.parse(this.#optsStorage.get()!)

		return opts
	}

	async getTimer() {
		const timer: number | null = JSON.parse(this.#timerStorage.get()!)

		return timer
	}

	async hasBoard() {
		return this.#boardStorage.get() != null && this.#notesStorage.get() != null
	}

	async hasOpts() {
		return this.#optsStorage.get() != null
	}

	async hasTimer() {
		return this.#timerStorage.get() != null
	}

	async save(data: { board: BoardJSON; timer: number }) {}
}
