import { sudokuFields, type SudokuPreferences } from './sudoku.model'
import { userField, type UserPreferences } from './user.model'
import { vimFields, type VimPreferences } from './vim.model'

export interface Preferences {
	sudoku: SudokuPreferences
	user: UserPreferences
	vim: VimPreferences
}

export type AllPreferences = SudokuPreferences & UserPreferences & VimPreferences

export const preferencesFields = { sudoku: sudokuFields, user: userField, vim: vimFields } as const

export interface IPreferences {
	/** save the current  */
	save(): Promise<void>
	/**
	 * Set specific preference.
	 * @param key The key preference to the establish.
	 * @param value New value for the preference.
	 */
	set<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]): this
	/** Get the current value of the Sudoku preferences. */
	get sudoku(): SudokuPreferences
	/** Converts the Preferences instance in JSON. */
	toJSON(): Preferences
	/** Converts the Preferences instance to a JSON string. */
	toString(): string
	/** Get the current value of the User preferences. */
	get user(): UserPreferences
	/** Get the current all preferences. */
	get value(): Preferences
	/** Get the current value of the VIM preferences. */
	get vim(): VimPreferences
}
