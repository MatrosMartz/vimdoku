import type { FormGroup, FormSchema } from '~/share/domain/models'
import type { KeysByType } from '~/share/types'

import { type SudokuEntries, sudokuFields, type SudokuPrefs } from './sudoku.model'
import { type UserEntries, userFields, type UserPrefs } from './user.model'
import { type VimEntries, vimFields, type VimPrefs } from './vim.model'

export interface Prefs {
	sudoku: SudokuPrefs
	user: UserPrefs
	vim: VimPrefs
}

export type AllPreferences = SudokuPrefs & UserPrefs & VimPrefs

export type PrefsEntries = [['sudoku', SudokuEntries], ['user', UserEntries], ['vim', VimEntries]]

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
	/** Load from the repo. */
	load(): Promise<void>
	/** Reset to default values all preferences. */
	resetAll(): this
	/**
	 * Reset to default value specific preference.
	 * @param key: The key preference to the reset.
	 */
	resetByKey<K extends keyof AllPreferences>(key: K): this
	/** Save the current  */
	save(): Promise<void>
	/** Set new Preferences Object.
	 * @param preferences The new value for all preferences.
	 * @throws {InvalidPreferencesError} If preferences is invalid.
	 */
	setAll(preferences: Prefs): this
	/**
	 * Set specific preference.
	 * @param key The key preference to the establish.
	 * @param value New value for the specific preference.
	 * @throws {InvalidPreferencesError} If value or key is invalid.
	 */
	setByKey<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]): this
	/** Converts the Preferences instance in JSON. */
	toJSON(): Prefs
	/** Converts the Preferences instance to a JSON string. */
	toString(): string
}

const ALL_FIELDS = { ...sudokuFields, ...userFields, ...vimFields }

export const PREFS_NAMES = Object.keys(ALL_FIELDS)

type AllNames = (typeof PREFS_NAMES)[0]
type ToggleNames = KeysByType<AllPreferences, boolean>
type NonToggleNames = Exclude<AllNames, ToggleNames>

interface Names {
	TOGGLE_NAMES: ToggleNames[]
	NON_TOGGLE_NAMES: NonToggleNames[]
}

function isTogglePref<FG extends FormGroup>(schema: FG, name: keyof FG): name is ToggleNames {
	return schema[name].type === 'toggle'
}

export const { TOGGLE_NAMES, NON_TOGGLE_NAMES } = PREFS_NAMES.reduce<Names>(
	(acc, name) => {
		if (isTogglePref(ALL_FIELDS, name)) acc.TOGGLE_NAMES.push(name)
		else acc.NON_TOGGLE_NAMES.push(name)
		return acc
	},
	{ TOGGLE_NAMES: [], NON_TOGGLE_NAMES: [] }
)
