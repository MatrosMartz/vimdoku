import type { Field } from '~/share/domain/models'
import { InvalidPreferencesError, sameStructure } from '~/share/utils'

import {
	type AllPreferences,
	type IPreferences,
	Langs,
	type Preferences,
	sudokuFields,
	type SudokuPreferences,
	userFields,
	type UserPreferences,
	vimFields,
	type VimPreferences,
} from '../models'
import type { PreferencesRepo } from '../repositories'

const { freeze: _f } = Object

const sudoku: SudokuPreferences = {
	automaticNoteDeletion: true,
	automaticValidation: true,
	highlightNumber: true,
	remainingNumbers: true,
}

const user: UserPreferences = { animations: true, language: Langs.EN, theme: 'default', timer: true }

const vim: VimPreferences = { fontSize: 16, history: 100, numbers: true, relativeNumbers: false }

function createKeyError(key: string, value: unknown) {
	return new InvalidPreferencesError(`the key "${key}" in sudoku can not have the value "${JSON.stringify(value)}"`)
}

const keyIn = {
	sudoku(key: keyof AllPreferences): key is keyof SudokuPreferences {
		return key in PreferencesService.DEFAULT_SUDOKU
	},
	user(key: keyof AllPreferences): key is keyof UserPreferences {
		return key in PreferencesService.DEFAULT_USER
	},
	vim(key: keyof AllPreferences): key is keyof VimPreferences {
		return key in PreferencesService.DEFAULT_VIM
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
	sudoku<K extends keyof SudokuPreferences>(key: K, value: unknown): value is SudokuPreferences[K] {
		return validateField(value, sudokuFields[key])
	},
	user<K extends keyof UserPreferences>(key: K, value: unknown): value is UserPreferences[K] {
		return validateField(value, userFields[key])
	},
	vim<K extends keyof VimPreferences>(key: K, value: unknown): value is VimPreferences[K] {
		return validateField(value, vimFields[key])
	},
}

/** Represent a Preferences Service for game. */
export class PreferencesService implements IPreferences {
	/** Default all Preferences. */
	static readonly DEFAULT_DATA = _f<Preferences>({ sudoku, user, vim })
	/** Default Sudoku Preferences. */
	static readonly DEFAULT_SUDOKU = _f(sudoku)
	/** Default User Preferences. */
	static readonly DEFAULT_USER = _f(user)
	/** Default VIM preferences. */
	static readonly DEFAULT_VIM = _f(vim)

	#repo
	#sudoku: SudokuPreferences = { ...PreferencesService.DEFAULT_SUDOKU }
	#user: UserPreferences = { ...PreferencesService.DEFAULT_USER }
	#vim: VimPreferences = { ...PreferencesService.DEFAULT_VIM }

	/**
	 * Create an instance of the PreferencesService class.
	 * @param repo Initial Sudoku board.
	 */
	constructor(repo: PreferencesRepo) {
		this.#repo = repo
	}

	get data(): Preferences {
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

	static check(preferences: Preferences) {
		return sameStructure(preferences, PreferencesService.DEFAULT_DATA)
	}

	async load() {
		const value = await this.#repo.load()

		if (value == null) return

		this.#sudoku = value.sudoku
		this.#user = value.user
		this.#vim = value.vim
	}

	resetAll() {
		this.#sudoku = { ...PreferencesService.DEFAULT_SUDOKU }
		this.#user = { ...PreferencesService.DEFAULT_USER }
		this.#vim = { ...PreferencesService.DEFAULT_VIM }
		return this
	}

	resetByKey<K extends keyof AllPreferences>(key: K) {
		if (keyIn.sudoku(key)) this.#sudoku = { ...this.#sudoku, [key]: PreferencesService.DEFAULT_SUDOKU[key] }
		if (keyIn.user(key)) this.#user = { ...this.#user, [key]: PreferencesService.DEFAULT_USER[key] }
		if (keyIn.vim(key)) this.#vim = { ...this.#vim, [key]: PreferencesService.DEFAULT_VIM[key] }
		return this
	}

	async save() {
		await this.#repo.save(this.data)
	}

	setAll(preferences: Preferences) {
		if (!PreferencesService.check(preferences)) throw new InvalidPreferencesError(preferences)

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
