import { Pos } from '~/share/domain/entities'
import { createBrowserStorage } from '~/share/infra/repositories'
import { RepoItemNotFoundError } from '~/share/utils'
import { type CellJSON, Grid } from '$sudoku/domain/entities'
import type { BoardJSON, SudokuInfo, SudokuSettsJSON } from '$sudoku/domain/models'
import type { SudokuRepo } from '$sudoku/domain/repositories'

interface StorageNames {
	board?: string
	info?: string
	notes?: string
	setts?: string
}

type CellJSONStore = Omit<CellJSON, 'notes'>

export class BrowserSudokuRepo implements SudokuRepo {
	readonly #boardStorage
	readonly #infoStorage
	readonly #notesStorage
	readonly #settsStorage

	constructor({ board = 'board', notes = 'notes', setts = 'sudoku-setts', info = 'sudoku-info' }: StorageNames = {}) {
		this.#boardStorage = createBrowserStorage(board)
		this.#notesStorage = createBrowserStorage(notes)
		this.#settsStorage = createBrowserStorage(setts)
		this.#infoStorage = createBrowserStorage(info)
	}

	async create(data: { board: BoardJSON; info: SudokuInfo; setts: SudokuSettsJSON }): Promise<void>
	async create({ board, info, setts }: { board: BoardJSON; info: SudokuInfo; setts: SudokuSettsJSON }) {
		const { boardJSON, notes } = new Grid(board).createSubgrids(({ notes, ...boardJSON }) => ({
			boardJSON,
			notes,
		}))
		this.#boardStorage.set(JSON.stringify(boardJSON.data))
		this.#notesStorage.set(JSON.stringify(notes.data))
		this.#settsStorage.set(JSON.stringify(setts))
		this.#infoStorage.set(JSON.stringify(info))
	}

	async delete() {
		this.#boardStorage.del()
		this.#notesStorage.del()
		this.#settsStorage.del()
		this.#infoStorage.del()
	}

	async getBoard() {
		const [boardRaw, notesRaw] = [this.#boardStorage.get(), this.#notesStorage.get()]

		const board =
			boardRaw != null
				? (JSON.parse(boardRaw) as CellJSONStore[][])
				: (() => {
						throw new RepoItemNotFoundError('board')
					})()
		const notes =
			notesRaw != null
				? (JSON.parse(notesRaw) as number[][])
				: (() => {
						throw new RepoItemNotFoundError('notes')
					})()

		return Pos.createMatrix(9, ({ y, x }): CellJSON => ({ ...board[y][x], notes: notes[y][x] }))
	}

	async getInfo() {
		const infoRaw = this.#infoStorage.get()

		return infoRaw != null
			? (JSON.parse(infoRaw) as SudokuInfo)
			: (() => {
					throw new RepoItemNotFoundError('info')
				})()
	}

	async getSetts() {
		const optsRaw = this.#settsStorage.get()

		return optsRaw != null
			? (JSON.parse(optsRaw) as SudokuSettsJSON)
			: (() => {
					throw new RepoItemNotFoundError('sudoku settings')
				})()
	}

	async hasData() {
		return (
			this.#boardStorage.get() != null &&
			this.#notesStorage.get() != null &&
			this.#infoStorage.get() != null &&
			this.#settsStorage.get() != null
		)
	}

	async save(data: { board: BoardJSON; info: SudokuInfo }) {
		this.#boardStorage.set(JSON.stringify(data.board))
		this.#infoStorage.set(JSON.stringify(data.info))
	}
}
