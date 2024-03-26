import type { FormGroup, FormSchema } from '~/share/domain/models'
import type { GetEntries, KeysByType } from '~/share/types'
import { entriesBy, keysBy } from '~/share/utils'

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
export const PREFS_NAMES = keysBy(ALL_PREFERENCES)

type AllNames = keyof typeof ALL_PREFERENCES
export type ToggleNames = KeysByType<Prefs, boolean>
export type NonToggleNames = Exclude<AllNames, ToggleNames>

interface Names {
	/** The names of preferences type text, number or option. */
	NON_TOGGLE_NAMES: NonToggleNames[]
	/** The names of preferences type toggle. */
	TOGGLE_NAMES: ToggleNames[]
}

/**
 * Checks if the preferences is of type 'toggle'.
 * @param schema The preference schema.
 * @param name The preference.
 * @returns The result of the check.
 */
function isTogglePref<FG extends FormGroup>(schema: FG, name: keyof FG): name is ToggleNames {
	return schema[name].type === 'toggle'
}

export const { TOGGLE_NAMES, NON_TOGGLE_NAMES } = PREFS_NAMES.reduce<Names>(
	(acc, name) => {
		if (isTogglePref(ALL_PREFERENCES, name)) acc.TOGGLE_NAMES.push(name)
		else acc.NON_TOGGLE_NAMES.push(name)
		return acc
	},
	{ TOGGLE_NAMES: [], NON_TOGGLE_NAMES: [] }
)
