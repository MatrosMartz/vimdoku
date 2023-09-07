import { sudokuFields, type SudokuPreferences } from './sudoku.model'
import { userField, type UserPreferences } from './user.model'
import { vimFields, type VimPreferences } from './vim.model'

export interface Preferences {
	readonly sudoku: SudokuPreferences
	readonly user: UserPreferences
	readonly vim: VimPreferences
}

export const preferencesFields = { sudoku: sudokuFields, user: userField, vim: vimFields } as const
