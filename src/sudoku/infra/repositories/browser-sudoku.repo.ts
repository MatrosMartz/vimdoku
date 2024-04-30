import { Pos } from '~/share/domain/entities'
import { BrowserStorage } from '~/share/infra/repositories'
import { option } from '~/share/utils'
import { type Cell, Grid, type GridData } from '$sudoku/domain/entities'
import type { BoardJSON, SudokuInfo, SudokuSettsJSON } from '$sudoku/domain/models'
import type { SudokuRepos } from '$sudoku/domain/repositories'

type CellJSONStore = Omit<Cell.JSON, 'notes'>
const [boardStorage, notesStorage, infoStorage, settsStorage] = [
	BrowserStorage.basic<GridData<CellJSONStore>>('board'),
	BrowserStorage.basic<GridData<number>>('notes'),
	BrowserStorage.basic<SudokuInfo>('sudoku-info'),
	BrowserStorage.basic<SudokuSettsJSON>('sudoku-setts'),
]

export const browserSudokuBoardRepo: SudokuRepos.Board = {
	async clear() {
		await Promise.all([boardStorage.del(), notesStorage.del()])
	},
	async get() {
		const board = boardStorage.get()
		const notes = notesStorage.get()

		if (board == null || notes == null) return null

		return Pos.createMatrix(9, ({ y, x }): Cell.JSON => ({ ...board[y][x], notes: notes[y][x] }))
	},
	has: async () => (boardStorage.get() ?? notesStorage.get()) != null,
	async save(board: BoardJSON) {
		const { boardJSON, notes } = new Grid(board).subgrids.unwrapped(({ notes, ...boardJSON }) => ({ boardJSON, notes }))
		await Promise.all([boardStorage.set(boardJSON), notesStorage.set(notes)])
	},
}

export const browserSudokuInfoRepo: SudokuRepos.Info = {
	clear: async () => infoStorage.del(),
	get: async () => infoStorage.get(),
	has: async () => infoStorage.get() != null,
	save: async (info: SudokuInfo) => infoStorage.set(info),
}

export const browserSudokuSettsRepo: SudokuRepos.Setts = {
	clear: async () => settsStorage.del(),
	get: async () => settsStorage.get(),
	has: async () => settsStorage.get() != null,
	save: async (setts: SudokuSettsJSON) => settsStorage.set(setts),
}

export const browserSudokuRepo: SudokuRepos.All = {
	async clear() {
		await Promise.all([browserSudokuBoardRepo.clear(), browserSudokuInfoRepo.clear(), browserSudokuSettsRepo.clear()])
	},
	async get() {
		const [board, info, setts] = await Promise.all([
			browserSudokuBoardRepo.get(),
			browserSudokuInfoRepo.get(),
			browserSudokuSettsRepo.get(),
		])
		return { board, info, setts }
	},
	async has() {
		const [board, info, setts] = await Promise.all([
			browserSudokuBoardRepo.has(),
			browserSudokuInfoRepo.has(),
			browserSudokuSettsRepo.has(),
		])

		return board && info && setts
	},
	async save({ board, info, setts }) {
		await Promise.all([
			option(board, browserSudokuBoardRepo.save),
			option(info, browserSudokuInfoRepo.save),
			option(setts, browserSudokuSettsRepo.save),
		])
	},
}
