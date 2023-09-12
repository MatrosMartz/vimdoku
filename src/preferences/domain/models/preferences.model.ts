import { sudokuFields, type SudokuPreferences } from './sudoku.model'
import { userField, type UserPreferences } from './user.model'
import { vimFields, type VimPreferences } from './vim.model'

export interface PreferencesValue {
	sudoku: SudokuPreferences
	user: UserPreferences
	vim: VimPreferences
}

export type AllPreferences = SudokuPreferences & UserPreferences & VimPreferences

export const preferencesFields = { sudoku: sudokuFields, user: userField, vim: vimFields } as const
