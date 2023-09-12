import { InvalidLikeError, InvalidPreferencesError, sameStructure } from '~/utils'

import {
	type AllPreferences,
	Langs,
	type PreferencesValue,
	type SudokuPreferences,
	type UserPreferences,
	type VimPreferences,
} from '../models'

export interface PrefOts {
	initSudoku?: Partial<SudokuPreferences>
	initUser?: Partial<UserPreferences>
	initVim?: Partial<VimPreferences>
}

const { freeze: _f } = Object

export class Preferences {
	static DEFAULT_SUDOKU = _f({
		automaticNoteDeletion: true,
		automaticValidation: true,
		highlightNumber: true,
		remainingNumbers: true,
	}) satisfies SudokuPreferences

	static DEFAULT_USER = _f({
		animations: true,
		language: Langs.EN,
		theme: 'default',
		timer: true,
	}) satisfies UserPreferences

	static DEFAULT_VIM = _f({
		fontSize: 16,
		history: 100,
		numbers: true,
		relativeNumbers: false,
	}) satisfies VimPreferences

	#sudoku: SudokuPreferences
	#user: UserPreferences
	#vim: VimPreferences

	constructor({ initPref }: { initPref?: PreferencesValue } = {}) {
		if (initPref == null) {
			this.#sudoku = Preferences.DEFAULT_SUDOKU
			this.#user = Preferences.DEFAULT_USER
			this.#vim = Preferences.DEFAULT_VIM
		} else {
			if (sameStructure(initPref.sudoku, Preferences.DEFAULT_SUDOKU)) throw new InvalidPreferencesError('sudoku')
			if (sameStructure(initPref.user, Preferences.DEFAULT_USER)) throw new InvalidPreferencesError('user')
			if (sameStructure(initPref.vim, Preferences.DEFAULT_VIM)) throw new InvalidPreferencesError('vim')
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
		throw new InvalidLikeError('preferences', preferencesLike)
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
