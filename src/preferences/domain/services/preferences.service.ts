import { inject, InvalidPreferencesError, sameStructure } from '~/share/utils'

import { IDLE_PREFS, type IPrefs, type Prefs } from '../models'
import { SUDOKU_IDLE_PREFS, type SudokuPrefs } from '../models/sudoku.model'
import { USER_IDLE_PREFS, type UserPrefs } from '../models/user.model'
import { VIM_IDLE_PREFS, type VimPrefs } from '../models/vim.model'
import type { PrefsRepo } from '../repositories'
import { PrefsObs } from './preferences-obs.service'

const keyIn = {
	sudoku(key: string): key is keyof SudokuPrefs {
		return key in SUDOKU_IDLE_PREFS
	},
	user(key: string): key is keyof UserPrefs {
		return key in USER_IDLE_PREFS
	},
	vim(key: string): key is keyof VimPrefs {
		return key in VIM_IDLE_PREFS
	},
}

/** Represent a Preferences Service for game. */
export class PrefsSvc implements IPrefs {
	#data: Prefs = { ...IDLE_PREFS }
	readonly #obs = inject(PrefsObs)
	readonly #repo

	/**
	 * Create an instance of the PreferencesSvc class.
	 * @param repo Initial Sudoku board.
	 */
	constructor(repo: PrefsRepo) {
		this.#repo = repo
	}

	get data(): Prefs {
		return { ...this.#data }
	}

	get sudoku() {
		return PrefsSvc.getSudoku(this.#data)
	}

	get user() {
		return PrefsSvc.getUser(this.#data)
	}

	get vim() {
		return PrefsSvc.getVim(this.#data)
	}

	/**
	 * Checks if the object has the structure of the preferences
	 * @param preferences The object to checked.
	 * @readonly True if it complies with the structure, False if it doesn't.
	 */
	static check(preferences: Prefs) {
		return sameStructure(preferences, IDLE_PREFS)
	}

	/**
	 * Get the entries of the preferences provided.
	 * @param preferences The preferences provided.
	 * @returns Preferences Entries
	 */
	static entriesGroup(prefs: Prefs) {
		return [
			['sudoku', Object.entries(this.getSudoku(prefs))],
			['user', Object.entries(this.getUser(prefs))],
			['vim', Object.entries(this.getVim(prefs))],
		] as const
	}

	/**
	 * Get the default value some preference.
	 * @param key The key of the preference.
	 * @returns Default value of the specified preference.
	 */
	static getDefaultValue<K extends keyof Prefs>(key: K) {
		if (keyIn.sudoku(key)) return SUDOKU_IDLE_PREFS[key]
		if (keyIn.user(key)) return USER_IDLE_PREFS[key]
		if (keyIn.vim(key)) return VIM_IDLE_PREFS[key]
	}

	static getGroups(prefs: Prefs) {
		return {
			sudoku: this.getSudoku(prefs),
			user: this.getUser(prefs),
			vim: this.getVim(prefs),
		}
	}

	static getSudoku(prefs: Prefs): SudokuPrefs {
		return {
			autoNoteDeletion: prefs.autoNoteDeletion,
			autoSave: prefs.autoSave,
			autoValidation: prefs.autoValidation,
			markRelatedNumbers: prefs.markRelatedNumbers,
			remainingNumbers: prefs.remainingNumbers,
			timer: prefs.timer,
		}
	}

	static getUser(prefs: Prefs): UserPrefs {
		return {
			colorSchema: prefs.colorSchema,
			colorTheme: prefs.colorTheme,
			contrast: prefs.contrast,
			iconTheme: prefs.iconTheme,
			language: prefs.language,
			motionReduce: prefs.motionReduce,
		}
	}

	static getVim(prefs: Prefs): VimPrefs {
		return {
			cursorBox: prefs.cursorBox,
			cursorCol: prefs.cursorCol,
			cursorRow: prefs.cursorRow,
			history: prefs.history,
			numbers: prefs.numbers,
			relativeNumbers: prefs.relativeNumbers,
		}
	}

	async load() {
		if (!(await this.#repo.has())) return

		this.#data = await this.#repo.load()
		this.#obs.set(this.#data)
	}

	resetAll() {
		this.#data = { ...IDLE_PREFS }
		this.#obs.set(this.#data)
		return this
	}

	resetByKey<K extends keyof Prefs>(key: K) {
		this.#data = { ...this.#data, [key]: IDLE_PREFS[key] }
		this.#obs.set(this.#data)
		return this
	}

	async save() {
		await this.#repo.save(this.data)
	}

	setAll(preferences: Prefs) {
		if (!PrefsSvc.check(preferences)) throw new InvalidPreferencesError(preferences)

		this.#data = { ...preferences }
		this.#obs.set(this.#data)
		return this
	}

	setByKey<K extends keyof Prefs>(key: K, value: Prefs[K]) {
		this.#data = { ...this.#data, [key]: value }

		return this
	}

	toJSON() {
		return this.data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
