import type { Field } from '~/share/domain/models'
import { InvalidPreferencesError, sameStructure } from '~/share/utils'

import { type AllPreferences, type IPrefs, type Prefs, type PrefsEntries } from '../models'
import { sudokuFields, type SudokuPrefs } from '../models/sudoku.model'
import { Accessibility, Langs, Schema, userFields, type UserPrefs } from '../models/user.model'
import { vimFields, type VimPrefs } from '../models/vim.model'
import type { PrefsRepo } from '../repositories'

const { freeze: _f } = Object

function createKeyError(key: string, value: unknown) {
	return new InvalidPreferencesError(`the key "${key}" in sudoku can not have the value "${JSON.stringify(value)}"`)
}

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

function validateField(value: unknown, field: Field) {
	if (field.type === 'toggle') return typeof value === 'boolean'
	if (field.type === 'text') return !(typeof value !== 'string' || (field.regex != null && !field.regex?.test(value)))

	if (field.type === 'number')
		return !(
			typeof value !== 'number' ||
			(field.max != null && value > field.max) ||
			(field.min != null && value < field.min)
		)

	if (field.type === 'options') return typeof value === 'string' && field.opts.includes(value)
	return false
}

const validatePref = {
	sudoku<K extends keyof SudokuPrefs>(key: K, value: unknown): value is SudokuPrefs[K] {
		return validateField(value, sudokuFields[key])
	},
	user<K extends keyof UserPrefs>(key: K, value: unknown): value is UserPrefs[K] {
		return validateField(value, userFields[key])
	},
	vim<K extends keyof VimPrefs>(key: K, value: unknown): value is VimPrefs[K] {
		return validateField(value, vimFields[key])
	},
}

/** Represent a Preferences Service for game. */
export class PrefsSvc implements IPrefs {
	/** Default Sudoku Preferences. */
	static readonly DEFAULT_SUDOKU = _f<SudokuPrefs>({
		autoNoteDeletion: true,
		autoValidation: true,
		markRelatedNumbers: true,
		remainingNumbers: true,
	})

	/** Default User Preferences. */
	static readonly DEFAULT_USER = _f<UserPrefs>({
		motionReduce: Accessibility.SYSTEM,
		colorSchema: Schema.SYSTEM,
		language: Langs.EN,
		colorTheme: 'default',
		timer: true,
	})

	/** Default VIM preferences. */
	static readonly DEFAULT_VIM = _f<VimPrefs>({
		history: 100,
		numbers: true,
		relativeNumbers: false,
	})

	/** Default all Preferences. */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	static readonly DEFAULT_DATA: Readonly<Prefs> = _f({
		sudoku: this.DEFAULT_SUDOKU,
		user: this.DEFAULT_USER,
		vim: this.DEFAULT_VIM,
	})

	readonly #repo
	#sudoku: SudokuPrefs = { ...PrefsSvc.DEFAULT_SUDOKU }
	#user: UserPrefs = { ...PrefsSvc.DEFAULT_USER }
	#vim: VimPrefs = { ...PrefsSvc.DEFAULT_VIM }

	/**
	 * Create an instance of the PreferencesSvc class.
	 * @param repo Initial Sudoku board.
	 */
	constructor(repo: PrefsRepo) {
		this.#repo = repo
	}

	get data(): Prefs {
		return { sudoku: this.sudoku, user: this.user, vim: this.vim }
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
	 * Checks if the object has the structure of the preferences
	 * @param preferences The object to checked.
	 * @readonly True if it complies with the structure, False if it doesn't.
	 */
	static check(preferences: Prefs) {
		return sameStructure(preferences, PrefsSvc.DEFAULT_DATA)
	}

	/**
	 * Get the entries of the preferences provided.
	 * @param preferences The preferences provided.
	 * @returns Preferences Entries
	 */
	static entries(preferences: Prefs) {
		const entries = Object.entries(preferences) as Array<[string, unknown]>
		return entries.map(([key, value]) => [key, Object.entries(value)]) as unknown as PrefsEntries
	}

	/**
	 * Get the default value some preference.
	 * @param key The key of the preference.
	 * @returns Default value of the specified preference.
	 */
	static getDefaultValue<K extends keyof AllPreferences>(key: K) {
		if (keyIn.sudoku(key)) return PrefsSvc.DEFAULT_SUDOKU[key]
		if (keyIn.user(key)) return PrefsSvc.DEFAULT_USER[key]
		if (keyIn.vim(key)) return PrefsSvc.DEFAULT_VIM[key]
	}

	async load() {
		if (!(await this.#repo.has())) return

		const value = await this.#repo.load()

		this.#sudoku = value.sudoku
		this.#user = value.user
		this.#vim = value.vim
	}

	resetAll() {
		this.#sudoku = { ...PrefsSvc.DEFAULT_SUDOKU }
		this.#user = { ...PrefsSvc.DEFAULT_USER }
		this.#vim = { ...PrefsSvc.DEFAULT_VIM }
		return this
	}

	resetByKey<K extends keyof AllPreferences>(key: K) {
		if (keyIn.sudoku(key)) this.#sudoku = { ...this.#sudoku, [key]: PrefsSvc.DEFAULT_SUDOKU[key] }
		if (keyIn.user(key)) this.#user = { ...this.#user, [key]: PrefsSvc.DEFAULT_USER[key] }
		if (keyIn.vim(key)) this.#vim = { ...this.#vim, [key]: PrefsSvc.DEFAULT_VIM[key] }
		return this
	}

	async save() {
		await this.#repo.save(this.data)
	}

	setAll(preferences: Prefs) {
		if (!PrefsSvc.check(preferences)) throw new InvalidPreferencesError(preferences)

		this.#sudoku = preferences.sudoku
		this.#user = preferences.user
		this.#vim = preferences.vim
		return this
	}

	setByKey<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]) {
		if (keyIn.sudoku(key)) {
			if (!validatePref.sudoku(key, value)) throw createKeyError(key, value)
			this.#sudoku = { ...this.#sudoku, [key]: value }
		} else if (keyIn.user(key)) {
			if (!validatePref.user(key, value)) throw createKeyError(key, value)
			this.#user = { ...this.#user, [key]: value }
		} else if (keyIn.vim(key)) {
			if (!validatePref.vim(key, value)) throw createKeyError(key, value)
			this.#vim = { ...this.#vim, [key]: value }
		} else throw new InvalidPreferencesError(`the key "${key}" not exist in Preferences`)

		return this
	}

	toJSON() {
		return this.data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
