import { entriesBy, inject, InvalidPreferencesError, sameStructure } from '~/share/utils'

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
		return { ...this.#obs.data }
	}

	get sudoku() {
		return PrefsSvc.getSudoku(this.#obs.data)
	}

	get user() {
		return PrefsSvc.getUser(this.#obs.data)
	}

	get vim() {
		return PrefsSvc.getVim(this.#obs.data)
	}

	/**
	 * Checks if the object has the structure of the preferences
	 * @param preferences The object to checked.
	 * @returns True if it complies with the structure, False if it doesn't.
	 */
	static check(preferences: Prefs) {
		return sameStructure(preferences, IDLE_PREFS)
	}

	/**
	 * Get the entries of the preferences provided.
	 * @param preferences The preferences provided.
	 * @returns Preferences Entries
	 */
	static entriesGroup(preferences: Prefs) {
		return [
			['sudoku', entriesBy(this.getSudoku(preferences))],
			['user', entriesBy(this.getUser(preferences))],
			['vim', entriesBy(this.getVim(preferences))],
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

	get<P extends keyof Prefs>(preference: P): Prefs[P] {
		return this.#obs.data[preference]
	}

	async load() {
		if (!(await this.#repo.has())) return

		this.#obs.set(await this.#repo.load())
	}

	resetAll() {
		this.#obs.set({ ...IDLE_PREFS })
		return this
	}

	resetByKey<K extends keyof Prefs>(key: K) {
		this.#obs.update(prefs => ({ ...prefs, [key]: IDLE_PREFS[key] }))
		return this
	}

	async save() {
		await this.#repo.save(this.data)
	}

	setAll(preferences: Prefs) {
		if (!PrefsSvc.check(preferences)) throw new InvalidPreferencesError(preferences)

		this.#obs.set({ ...preferences })
		return this
	}

	setByKey<K extends keyof Prefs>(key: K, value: Prefs[K]) {
		this.#obs.update(prefs => ({ ...prefs, [key]: value }))
		return this
	}

	toJSON() {
		return this.data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
