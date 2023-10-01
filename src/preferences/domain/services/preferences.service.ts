import { InvalidPreferencesError, sameStructure } from '~/share/utils'

import {
	type AllPreferences,
	type IPreferences,
	Langs,
	type PreferencesOpts,
	type PreferencesValue,
	type SudokuPreferences,
	type UserPreferences,
	type VimPreferences,
} from '../models'

const { freeze: _f } = Object

const sudoku: SudokuPreferences = {
	automaticNoteDeletion: true,
	automaticValidation: true,
	highlightNumber: true,
	remainingNumbers: true,
}

const user: UserPreferences = { animations: true, language: Langs.EN, theme: 'default', timer: true }

const vim: VimPreferences = { fontSize: 16, history: 100, numbers: true, relativeNumbers: false }

/** Represent a Preferences for game. */
export class PreferencesService implements IPreferences {
	/** Default Sudoku Preferences. */
	static readonly DEFAULT_SUDOKU = _f(sudoku)

	/** Default User Preferences. */
	static readonly DEFAULT_USER = _f(user)

	/** Default all Preferences. */
	static readonly DEFAULT_VALUE = _f<PreferencesValue>({ sudoku, user, vim })

	/** Default VIM preferences. */
	static readonly DEFAULT_VIM = _f(vim)

	#sudoku
	#user
	#vim

	/**
	 * Create an instance of the PreferencesService class.
	 * @param {PreferencesValue} value Initial Sudoku board.
	 */
	constructor(value: PreferencesValue) {
		this.#sudoku = value.sudoku
		this.#user = value.user
		this.#vim = value.vim
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

	/**
	 * Create an instance of the PreferencesService Class
	 * @param {PreferencesOpts} [opts] Custom, initial Preferences.
	 */
	static create(opts?: PreferencesOpts): PreferencesService
	static create({ initSudoku = {}, initUser = {}, initVim = {} }: PreferencesOpts = {}) {
		return new PreferencesService({
			sudoku: { ...PreferencesService.DEFAULT_SUDOKU, ...initSudoku },
			user: { ...PreferencesService.DEFAULT_USER, ...initUser },
			vim: { ...PreferencesService.DEFAULT_VIM, ...initVim },
		})
	}

	/**
	 * Create an  instance of PreferencesService class from a JSON string.
	 * @param preferencesLike JSON representation of preferences.
	 * @throws {InvalidPreferencesError} If `preferencesLike` is not a valid JSON.
	 */
	static fromString(preferencesLike: string) {
		try {
			const value: PreferencesValue = JSON.parse(preferencesLike)
			if (sameStructure(value, PreferencesService.DEFAULT_VALUE)) throw new InvalidPreferencesError(value)
			return new PreferencesService(value)
		} catch (err) {
			throw new InvalidPreferencesError(preferencesLike, err)
		}
	}

	set<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]) {
		if (key in PreferencesService.DEFAULT_SUDOKU) this.#sudoku = { ...this.#sudoku, [key]: value }
		if (key in PreferencesService.DEFAULT_USER) this.#user = { ...this.#user, [key]: value }
		if (key in PreferencesService.DEFAULT_VIM) this.#vim = { ...this.#vim, [key]: value }

		return this
	}

	toJSON(): PreferencesValue {
		return { sudoku: this.sudoku, user: this.user, vim: this.vim }
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
