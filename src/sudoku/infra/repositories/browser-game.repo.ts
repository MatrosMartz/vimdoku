import { createBrowserStorage } from '~/share/infra/repositories'
import { createMatrix } from '~/share/utils'
import type { BoardJSON, CellJSON, GameInfo, GameOptsJSON } from '$sudoku/domain/models'
import type { GameRepo } from '$sudoku/domain/repositories'
import { GridSvc } from '$sudoku/domain/services'

interface StorageNames {
	board?: string
	notes?: string
	opts?: string
	info?: string
}

type CellJSONStore = Omit<CellJSON, 'notes'>

export class BrowserGameRepo implements GameRepo {
	readonly #boardStorage
	readonly #notesStorage
	readonly #optsStorage
	readonly #infoStorage

	constructor({ board = 'board', notes = 'notes', opts = 'opts', info = 'game-info' }: StorageNames = {}) {
		this.#boardStorage = createBrowserStorage(board)
		this.#notesStorage = createBrowserStorage(notes)
		this.#optsStorage = createBrowserStorage(opts)
		this.#infoStorage = createBrowserStorage(info)
	}

	async create(opts: GameOptsJSON, board: BoardJSON): Promise<void>
	async create({ difficulty, solution }: GameOptsJSON, board: BoardJSON) {
		const { boardJSON, notes } = new GridSvc(board).groupSubgrids(({ notes, ...boardJSON }) => ({
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
		this.#infoStorage.del()
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

	async getInfo() {
		const timer: GameInfo | null = JSON.parse(this.#infoStorage.get()!)

		return timer
	}

	async hasData() {
		return (
			this.#boardStorage.get() != null &&
			this.#notesStorage.get() != null &&
			this.#infoStorage.get() != null &&
			this.#optsStorage.get() != null
		)
	}

	async save(data: { board: BoardJSON; info: GameInfo }) {}
}
