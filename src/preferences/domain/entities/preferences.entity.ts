import { InvalidPreferencesError, sameStructure } from '~/utils'

import { sudokuFields, type SudokuPreferences } from './sudoku.entity'
import { Langs, userField, type UserPreferences } from './user.entity'
import { vimFields, type VimPreferences } from './vim.entity'

export interface PreferencesValue {
	sudoku: SudokuPreferences
	user: UserPreferences
	vim: VimPreferences
}

export type AllPreferences = SudokuPreferences & UserPreferences & VimPreferences

export const preferencesFields = { sudoku: sudokuFields, user: userField, vim: vimFields } as const

export interface PrefOts {
	initSudoku?: Partial<SudokuPreferences>
	initUser?: Partial<UserPreferences>
	initVim?: Partial<VimPreferences>
}

const { freeze: _f } = Object

export class Preferences {
	static readonly DEFAULT_SUDOKU = _f<SudokuPreferences>({
		automaticNoteDeletion: true,
		automaticValidation: true,
		highlightNumber: true,
		remainingNumbers: true,
	})

	static readonly DEFAULT_USER = _f<UserPreferences>({
		animations: true,
		language: Langs.EN,
		theme: 'default',
		timer: true,
	})

	static readonly DEFAULT_VIM = _f<VimPreferences>({
		fontSize: 16,
		history: 100,
		numbers: true,
		relativeNumbers: false,
	})

	#sudoku: SudokuPreferences
	#user: UserPreferences
	#vim: VimPreferences

	constructor({ initPref }: { initPref?: PreferencesValue } = {}) {
		if (initPref == null) {
			this.#sudoku = Preferences.DEFAULT_SUDOKU
			this.#user = Preferences.DEFAULT_USER
			this.#vim = Preferences.DEFAULT_VIM
		} else {
			if (sameStructure(initPref.sudoku, Preferences.DEFAULT_SUDOKU)) throw new InvalidPreferencesError(initPref.sudoku)
			if (sameStructure(initPref.user, Preferences.DEFAULT_USER)) throw new InvalidPreferencesError(initPref.user)
			if (sameStructure(initPref.vim, Preferences.DEFAULT_VIM)) throw new InvalidPreferencesError(initPref.vim)
			this.#sudoku = initPref.sudoku
			this.#user = initPref.user
			this.#vim = initPref.vim
		}
	}

	get sudoku() {
		return structuredClone(this.#sudoku)
	}

	get user() {
		return structuredClone(this.#user)
	}

	get vim() {
		return structuredClone(this.#vim)
	}

	static create({ initSudoku = {}, initUser = {}, initVim = {} }: PrefOts = {}) {
		return new Preferences({
			initPref: {
				sudoku: { ...Preferences.DEFAULT_SUDOKU, ...initSudoku },
				user: { ...Preferences.DEFAULT_USER, ...initUser },
				vim: { ...Preferences.DEFAULT_VIM, ...initVim },
			},
		})
	}

	static from(preferencesLike: string) {
		if (typeof preferencesLike === 'string') {
			const initPref = JSON.parse(preferencesLike)
			return new Preferences({ initPref })
		}
		throw new InvalidPreferencesError(preferencesLike)
	}

	set<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]) {
		if (key in Preferences.DEFAULT_SUDOKU) this.#sudoku = { ...this.#sudoku, [key]: value }
		if (key in Preferences.DEFAULT_USER) this.#user = { ...this.#user, [key]: value }
		if (key in Preferences.DEFAULT_VIM) this.#vim = { ...this.#vim, [key]: value }
	}

	toJSON(): PreferencesValue {
		return { sudoku: this.sudoku, user: this.user, vim: this.vim }
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
