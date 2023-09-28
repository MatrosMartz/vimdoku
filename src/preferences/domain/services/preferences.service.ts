import { InvalidPreferencesError, sameStructure } from '~/share/utils'

import {
	type AllPreferences,
	type IPreferences,
	Langs,
	type PreferencesData,
	type PreferencesOpts,
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
	/** Default all Preferences. */
	static readonly DEFAULT_DATA = _f<PreferencesData>({ sudoku, user, vim })

	/** Default Sudoku Preferences. */
	static readonly DEFAULT_SUDOKU = _f(sudoku)

	/** Default User Preferences. */
	static readonly DEFAULT_USER = _f(user)

	/** Default VIM preferences. */
	static readonly DEFAULT_VIM = _f(vim)

	#sudoku
	#user
	#vim

	/**
	 * Creates an instance of the Preferences class.
	 * @param {PreferencesData} data Initial Sudoku board.
	 */
	constructor(data: PreferencesData) {
		this.#sudoku = data.sudoku
		this.#user = data.user
		this.#vim = data.vim
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
	 * Create instance of the Preferences Class
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
	 * Create instance of Preferences class from a JSON string.
	 * @param preferencesLike JSON representation of preferences.
	 */
	static from(preferencesLike: string) {
		if (typeof preferencesLike === 'string') {
			const data: PreferencesData = JSON.parse(preferencesLike)
			if (sameStructure(data, PreferencesService.DEFAULT_DATA)) throw new InvalidPreferencesError(data)
			return new PreferencesService(data)
		}
		throw new InvalidPreferencesError(preferencesLike)
	}

	set<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]) {
		if (key in PreferencesService.DEFAULT_SUDOKU) this.#sudoku = { ...this.#sudoku, [key]: value }
		if (key in PreferencesService.DEFAULT_USER) this.#user = { ...this.#user, [key]: value }
		if (key in PreferencesService.DEFAULT_VIM) this.#vim = { ...this.#vim, [key]: value }

		return this
	}

	toJSON(): PreferencesData {
		return { sudoku: this.sudoku, user: this.user, vim: this.vim }
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
