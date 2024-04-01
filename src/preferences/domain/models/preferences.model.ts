import { Group } from '~/share/domain/entities'
import type { FormSchema } from '~/share/domain/models'
import type { GetEntries, KeysByType } from '~/share/types'
import { entriesBy } from '~/share/utils'

import { SUDOKU_IDLE_PREFS, sudokuFields, type SudokuPrefs } from './sudoku.model'
import { USER_IDLE_PREFS, userFields, type UserPrefs } from './user.model'
import { VIM_IDLE_PREFS, vimFields, type VimPrefs } from './vim.model'

export type Prefs = SudokuPrefs & UserPrefs & VimPrefs

export const prefsGroupEntries = [
	['sudoku', entriesBy(sudokuFields)],
	['user', entriesBy(userFields)],
	['vim', entriesBy(vimFields)],
] as const

export type PrefsNamesEntries = (
	| GetEntries<typeof sudokuFields>
	| GetEntries<typeof userFields>
	| GetEntries<typeof vimFields>
)[0]

export const IDLE_PREFS = { ...SUDOKU_IDLE_PREFS, ...USER_IDLE_PREFS, ...VIM_IDLE_PREFS } as const

export const prefsFormSchema = {
	sudoku: sudokuFields,
	user: userFields,
	vim: vimFields,
} as const satisfies FormSchema

export interface IPrefs {
	/** Get the current data of preferences. */
	readonly data: Prefs
	/** Get the current value of the Sudoku preferences. */
	readonly sudoku: SudokuPrefs
	/** Get the current value of the User preferences. */
	readonly user: UserPrefs
	/** Get the current value of the VIM preferences. */
	readonly vim: VimPrefs
	get<P extends keyof Prefs>(preference: P): Prefs[P]
	/** Load from the repo. */
	load(): Promise<void>
	/** Reset to default values all preferences. */
	resetAll(): this
	/**
	 * Reset to default value specific preference.
	 * @param key The key preference to the reset.
	 * @returns The updated Service.
	 */
	resetByKey<K extends keyof Prefs>(key: K): this
	/** Save the current  */
	save(): Promise<void>
	/**
	 * Set new Preferences Object.
	 * @param preferences The new value for all preferences.
	 * @throws {InvalidPreferencesError} If preferences is invalid.
	 * @returns The updated Service.
	 */
	setAll(preferences: Prefs): this
	/**
	 * Set specific preference.
	 * @param key The key preference to the establish.
	 * @param value New value for the specific preference.
	 * @throws {InvalidPreferencesError} If value or key is invalid.
	 * @returns The updated Service.
	 */
	setByKey<K extends keyof Prefs>(key: K, value: Prefs[K]): this
	toJSON(): Prefs
	toString(): string
}

export const ALL_PREFERENCES = { ...sudokuFields, ...userFields, ...vimFields }

/** All preferences names. */
export const PREFS_NAMES = Group.fromKeys(ALL_PREFERENCES)

type AllNames = keyof typeof ALL_PREFERENCES

export type ToggleNames = KeysByType<Prefs, boolean>
export type NonToggleNames = Exclude<AllNames, ToggleNames>

export const { NON_TOGGLE_NAMES, TOGGLE_NAMES } = PREFS_NAMES.groupBy<{
	NON_TOGGLE_NAMES: NonToggleNames
	TOGGLE_NAMES: ToggleNames
}>(name => (ALL_PREFERENCES[name].type === 'toggle' ? 'NON_TOGGLE_NAMES' : 'TOGGLE_NAMES'))
