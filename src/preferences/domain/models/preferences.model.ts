import type { FormGroup, FormSchema } from '~/share/domain/models'
import type { KeysByType } from '~/share/types'

import { sudokuFields, type SudokuPrefs } from './sudoku.model'
import { userFields, type UserPrefs } from './user.model'
import { vimFields, type VimPrefs } from './vim.model'

export type Prefs = SudokuPrefs & UserPrefs & VimPrefs

export const prefsEntries = [
	['sudoku', Object.entries(sudokuFields)],
	['user', Object.entries(userFields)],
	['vim', Object.entries(vimFields)],
] as const

export const PrefFields = { ...sudokuFields, ...userFields, ...vimFields }

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
	resetByKey<K extends keyof Prefs>(key: K): this
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
	setByKey<K extends keyof Prefs>(key: K, value: Prefs[K]): this
	/** Converts the Preferences instance in JSON. */
	toJSON(): Prefs
	/** Converts the Preferences instance to a JSON string. */
	toString(): string
}

const ALL_FIELDS = { ...sudokuFields, ...userFields, ...vimFields }

export const PREFS_NAMES = Object.keys(ALL_FIELDS)

type AllNames = (typeof PREFS_NAMES)[0]
type ToggleNames = KeysByType<Prefs, boolean>
type NonToggleNames = Exclude<AllNames, ToggleNames>

interface Names {
	NON_TOGGLE_NAMES: NonToggleNames[]
	TOGGLE_NAMES: ToggleNames[]
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
