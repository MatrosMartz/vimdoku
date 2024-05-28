import { Collection } from '~/share/domain/entities'
import type { FormSchema } from '~/share/domain/models'
import { A } from '~/share/utils'

import { SUDOKU_IDLE_PREFS, sudokuFields, type SudokuPrefs } from './sudoku.model'
import { USER_IDLE_PREFS, userFields, type UserPrefs } from './user.model'
import { VIM_IDLE_PREFS, vimFields, type VimPrefs } from './vim.model'

export type Prefs = SudokuPrefs & UserPrefs & VimPrefs

export const IDLE_PREFS = { ...SUDOKU_IDLE_PREFS, ...USER_IDLE_PREFS, ...VIM_IDLE_PREFS } as const

export const prefsFormSchema = {
	sudoku: sudokuFields,
	user: userFields,
	vim: vimFields,
} as const satisfies FormSchema

export interface IPrefs {
	/** Get the current Data of preferences. */
	readonly data: Prefs
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
	setAll(data: Prefs): this
	/**
	 * Set specific preference.
	 * @param key The key preference to the establish.
	 * @param value New value for the specific preference.
	 * @returns The updated Service.
	 */
	setByKey<K extends keyof Prefs>(key: K, value: Prefs[K]): this
}

export const toggleFieldCase = new A.Assert<A.FnData<{ type: 'toggle' }>>(field => {
	if (!(typeof field === 'object') || field == null) return false
	return Reflect.get(field, 'type') === 'toggle'
})

/* eslint-disable @typescript-eslint/no-redeclare, import/export */
export const PREFS_FIELDS = new Collection.Builder()
	.addSubCollection('SUDOKU', Collection.entriesByObj(sudokuFields))
	.addSubCollection('USER', Collection.entriesByObj(userFields))
	.addSubCollection('VIM', Collection.entriesByObj(vimFields))
	.createConditionalSubCollections(
		'TOGGLE',
		'NON_TOGGLE',
		A.is.Array.with(1, A.is.Object.with('type', A.equalTo('toggle')))
	)
	.done()

export declare module PREFS_FIELDS {
	type Entry = typeof PREFS_FIELDS extends Collection.Composite<infer Entry, any> ? Entry : never
	type Key = Entry[0]
	type Value = Entry[1]

	module subs {
		module SUDOKU {
			type Entry = typeof PREFS_FIELDS.subs.SUDOKU extends Collection.Sub<infer Entry> ? Entry : never
			type Key = Entry[0]
			type Value = Entry[1]
		}
		module USER {
			type Entry = typeof PREFS_FIELDS.subs.USER extends Collection.Sub<infer Entry> ? Entry : never
			type Key = Entry[0]
			type Value = Entry[1]
		}
		module VIM {
			type Entry = typeof PREFS_FIELDS.subs.VIM extends Collection.Sub<infer Entry> ? Entry : never
			type Key = Entry[0]
			type Value = Entry[1]
		}
		module TOGGLE {
			type Entry = typeof PREFS_FIELDS.subs.TOGGLE extends Collection.Sub<infer Entry> ? Entry : never
			type Key = Entry[0]
			type Value = Entry[1]
		}
		module NON_TOGGLE {
			type Entry = typeof PREFS_FIELDS.subs.NON_TOGGLE extends Collection.Sub<infer Entry> ? Entry : never
			type Key = Entry[0]
			type Value = Entry[1]
		}
	}
}
