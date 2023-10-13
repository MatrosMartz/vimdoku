import { type BrowserStorage, createMatrix } from '~/share/utils'
import type { BoardJSON, CellJSON, GameOptsJSON } from '$sudoku/domain/models'
import type { GameRepo } from '$sudoku/domain/repositories'

interface StorageNames {
	board?: string
	notes?: string
	opts?: string
}

type CellJSONStore = Omit<CellJSON, 'notes'>

function createStore(name: string): BrowserStorage {
	return {
		del: () => localStorage.removeItem(name),
		get: () => localStorage.getItem(name),
		set: value => localStorage.setItem(name, value),
	}
}

export class BrowserGameRepo implements GameRepo {
	#boardStorage
	#notesStorage
	#optsStorage

	constructor({ board = 'board', notes = 'notes', opts = 'opts' }: StorageNames = {}) {
		this.#boardStorage = createStore(board)
		this.#notesStorage = createStore(notes)
		this.#optsStorage = createStore(opts)
	}

	async create(opts: GameOptsJSON, board: BoardJSON): Promise<void>
	async create({ difficulty, solution }: GameOptsJSON, board: BoardJSON) {
		const boardJSON = createMatrix(9, ({ row, col }) => {
			const { kind, num } = board[row][col]
			return { kind, num }
		})
		const notes = createMatrix(9, ({ row, col }) => board[row][col].num)
		this.#boardStorage.set(JSON.stringify(boardJSON))
		this.#notesStorage.set(JSON.stringify(notes))
		this.#optsStorage.set(JSON.stringify({ difficulty, solution }))
	}

	async delete() {
		this.#boardStorage.del()
		this.#notesStorage.del()
		this.#optsStorage.del()
	}

	async getBoard() {
		const board: CellJSONStore[][] = JSON.parse(this.#boardStorage.get()!)
		const notes: number[][] = JSON.parse(this.#notesStorage.get()!)

		if (board == null || notes == null) return null

		return createMatrix<CellJSON>(9, ({ row, col }) => ({ ...board[row][col], notes: notes[row][col] }))
	}

	async getOpts() {
		const opts: GameOptsJSON | null = JSON.parse(this.#optsStorage.get()!)

		return opts
	}

	async hasBoard() {
		return this.#boardStorage.get() != null && this.#notesStorage.get() != null
	}

	async hasOpts() {
		return this.#optsStorage.get() != null
	}

	async setBoard(board: BoardJSON) {}
}
