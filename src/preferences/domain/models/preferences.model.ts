import type { FormSchema } from '~/share/domain/models'

import { sudokuFields, type SudokuPreferences } from './sudoku.model'
import { userFields, type UserPreferences } from './user.model'
import { vimFields, type VimPreferences } from './vim.model'

export interface Preferences {
	sudoku: SudokuPreferences
	user: UserPreferences
	vim: VimPreferences
}

export type AllPreferences = SudokuPreferences & UserPreferences & VimPreferences

export const preferencesFormSchema = {
	sudoku: sudokuFields,
	user: userFields,
	vim: vimFields,
} as const satisfies FormSchema

export interface IPreferences {
	/** Get the current data of preferences. */
	readonly data: Preferences
	/** Get the current value of the Sudoku preferences. */
	readonly sudoku: SudokuPreferences
	/** Get the current value of the User preferences. */
	readonly user: UserPreferences
	/** Get the current value of the VIM preferences. */
	readonly vim: VimPreferences
	/** Load from the repo. */
	load(): Promise<void>
	/** Save the current  */
	save(): Promise<void>
	/** Set new Preferences Object.
	 * @param preferences The new value for all preferences.
	 * @throws {InvalidPreferencesError} If preferences is invalid.
	 */
	setAll(preferences: Preferences): this
	/**
	 * Set specific preference.
	 * @param key The key preference to the establish.
	 * @param value New value for the specific preference.
	 * @throws {InvalidPreferencesError} If value or key is invalid.
	 */
	setByKey<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]): this
	/** Converts the Preferences instance in JSON. */
	toJSON(): Preferences
	/** Converts the Preferences instance to a JSON string. */
	toString(): string
}
