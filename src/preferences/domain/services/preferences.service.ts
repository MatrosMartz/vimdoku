import type { IAsyncObs } from '~/share/domain/models'
import { FormFields } from '~/share/domain/services'
import { InvalidPreferencesError, sameStructure } from '~/share/utils'

import { type IPrefs, PrefFields, type Prefs } from '../models'
import { sudokuFields, type SudokuPrefs } from '../models/sudoku.model'
import { userFields, type UserPrefs } from '../models/user.model'
import { vimFields, type VimPrefs } from '../models/vim.model'
import type { PrefsRepo } from '../repositories'

const { freeze: _f } = Object

const keyIn = {
	sudoku(key: string): key is keyof SudokuPrefs {
		return key in PrefsSvc.DEFAULT_SUDOKU
	},
	user(key: string): key is keyof UserPrefs {
		return key in PrefsSvc.DEFAULT_USER
	},
	vim(key: string): key is keyof VimPrefs {
		return key in PrefsSvc.DEFAULT_VIM
	},
}

/** Represent a Preferences Service for game. */
export class PrefsSvc implements IPrefs {
	/** Default all Preferences. */
	static readonly DEFAULT = _f(FormFields.getDefaultValues(PrefFields))
	/** Default Sudoku Preferences. */
	static readonly DEFAULT_SUDOKU = _f(FormFields.getDefaultValues(sudokuFields))
	/** Default User Preferences. */
	static readonly DEFAULT_USER = _f(FormFields.getDefaultValues(userFields))
	/** Default VIM preferences. */
	static readonly DEFAULT_VIM = _f(FormFields.getDefaultValues(vimFields))
	// eslint-disable-next-line @typescript-eslint/member-ordering
	static readonly DEFAULT_GROUPS = { sudoku: this.DEFAULT_SUDOKU, user: this.DEFAULT_USER, vim: this.DEFAULT_VIM }

	#data: Prefs = { ...PrefsSvc.DEFAULT }
	readonly #repo
	readonly #obs

	/**
	 * Create an instance of the PreferencesSvc class.
	 * @param repo Initial Sudoku board.
	 */
	constructor(repo: PrefsRepo, obs: IAsyncObs<Prefs>) {
		this.#repo = repo
		this.#obs = obs
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
		return sameStructure(preferences, PrefsSvc.DEFAULT)
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
		if (keyIn.sudoku(key)) return PrefsSvc.DEFAULT_SUDOKU[key]
		if (keyIn.user(key)) return PrefsSvc.DEFAULT_USER[key]
		if (keyIn.vim(key)) return PrefsSvc.DEFAULT_VIM[key]
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
		this.#obs.update(this.#data)
	}

	resetAll() {
		this.#data = { ...PrefsSvc.DEFAULT }
		this.#obs.update(this.#data)
		return this
	}

	resetByKey<K extends keyof Prefs>(key: K) {
		this.#data = { ...this.#data, [key]: PrefsSvc.DEFAULT[key] }
		this.#obs.update(this.#data)
		return this
	}

	async save() {
		await this.#repo.save(this.data)
	}

	setAll(preferences: Prefs) {
		if (!PrefsSvc.check(preferences)) throw new InvalidPreferencesError(preferences)

		this.#data = { ...preferences }
		this.#obs.update(this.#data)
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
