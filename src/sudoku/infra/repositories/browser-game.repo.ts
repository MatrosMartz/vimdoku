import { createBrowserStorage } from '~/share/infra/repositories'
import { _throw, createMatrix, RepoItemNotFoundError } from '~/share/utils'
import type { BoardJSON, CellJSON, GameInfo, GameOptsJSON } from '$sudoku/domain/models'
import type { GameRepo } from '$sudoku/domain/repositories'
import { GridSvc } from '$sudoku/domain/services'

interface StorageNames {
	board?: string
	info?: string
	notes?: string
	opts?: string
}

type CellJSONStore = Omit<CellJSON, 'notes'>

export class BrowserGameRepo implements GameRepo {
	readonly #boardStorage
	readonly #infoStorage
	readonly #notesStorage
	readonly #optsStorage

	constructor({ board = 'board', notes = 'notes', opts = 'opts', info = 'game-info' }: StorageNames = {}) {
		this.#boardStorage = createBrowserStorage(board)
		this.#notesStorage = createBrowserStorage(notes)
		this.#optsStorage = createBrowserStorage(opts)
		this.#infoStorage = createBrowserStorage(info)
	}

	async create(data: { board: BoardJSON; info: GameInfo; opts: GameOptsJSON }): Promise<void>
	async create({ board, info, opts }: { board: BoardJSON; info: GameInfo; opts: GameOptsJSON }) {
		const { boardJSON, notes } = new GridSvc(board).createSubgrids(({ notes, ...boardJSON }) => ({
			boardJSON,
			notes,
		}))
		this.#boardStorage.set(JSON.stringify(boardJSON.data))
		this.#notesStorage.set(JSON.stringify(notes.data))
		this.#optsStorage.set(JSON.stringify(opts))
		this.#infoStorage.set(JSON.stringify(info))
	}

	async delete() {
		this.#boardStorage.del()
		this.#notesStorage.del()
		this.#optsStorage.del()
		this.#infoStorage.del()
	}

	async getBoard() {
		const [boardRaw, notesRaw] = [this.#boardStorage.get(), this.#notesStorage.get()]

		const board =
			boardRaw != null ? (JSON.parse(boardRaw) as CellJSONStore[][]) : _throw(new RepoItemNotFoundError('board'))
		const notes = notesRaw != null ? (JSON.parse(notesRaw) as number[][]) : _throw(new RepoItemNotFoundError('notes'))

		return createMatrix(9, ({ y, x }): CellJSON => ({ ...board[y][x], notes: notes[y][x] }))
	}

	async getInfo() {
		const infoRaw = this.#infoStorage.get()

		return infoRaw != null ? (JSON.parse(infoRaw) as GameInfo) : _throw(new RepoItemNotFoundError('info'))
	}

	async getOpts() {
		const optsRaw = this.#optsStorage.get()

		return optsRaw != null ? (JSON.parse(optsRaw) as GameOptsJSON) : _throw(new RepoItemNotFoundError('boardOpts'))
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
