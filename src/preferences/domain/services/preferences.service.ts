import { notifyObservers, ObservableService } from '~/share/domain/services'
import { InvalidPreferencesError, sameStructure } from '~/share/utils'

import {
	type AllPreferences,
	type IPreferences,
	Langs,
	type Preferences,
	type SudokuPreferences,
	type UserPreferences,
	type VimPreferences,
} from '../models'
import type * as repositories from '../repositories'

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

function keyInPreferences(key: keyof AllPreferences, preferences: SudokuPreferences): key is keyof SudokuPreferences
function keyInPreferences(key: keyof AllPreferences, preferences: UserPreferences): key is keyof UserPreferences
function keyInPreferences(key: keyof AllPreferences, preferences: VimPreferences): key is keyof VimPreferences
function keyInPreferences(
	key: keyof AllPreferences,
	preferences: SudokuPreferences | UserPreferences | VimPreferences
) {
	return key in preferences
}

/** Represent a Preferences Service for game. */
export class PreferencesService extends ObservableService<Preferences> implements IPreferences {
	/** Default Sudoku Preferences. */
	static readonly DEFAULT_SUDOKU = _f(sudoku)
	/** Default User Preferences. */
	static readonly DEFAULT_USER = _f(user)
	/** Default all Preferences. */
	static readonly DEFAULT_VALUE = _f<Preferences>({ sudoku, user, vim })
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
	constructor(repo: repositories.PreferencesRepo) {
		super()
		this.#repo = repo
	}

	get sudoku() {
		return structuredClone(this.#sudoku)
	}

	get user() {
		return structuredClone(this.#user)
	}

	get value(): Preferences {
		return { sudoku: this.sudoku, user: this.user, vim: this.vim }
	}

	get vim() {
		return structuredClone(this.#vim)
	}

	static check(preferences: Preferences) {
		return sameStructure(preferences, PreferencesService.DEFAULT_VALUE)
	}

	async load() {
		const value = await this.#repo.load()

		if (value == null) return

		this.#sudoku = value.sudoku
		this.#user = value.user
		this.#vim = value.vim
		
		this[notifyObservers](this.value)
	}

	async save() {
		await this.#repo.save(this.value)
		this[notifyObservers](this.value)
	}

	setAll(preferences: Preferences) {
		if (!PreferencesService.check(preferences)) throw new InvalidPreferencesError(preferences)

		this.#sudoku = preferences.sudoku
		this.#user = preferences.user
		this.#vim = preferences.vim
		return this
	}

	setByKey<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]) {
		if (keyInPreferences(key, PreferencesService.DEFAULT_SUDOKU)) {
			if (!sameStructure(value, PreferencesService.DEFAULT_SUDOKU[key])) throw createKeyError(key, value)
			this.#sudoku = { ...this.#sudoku, [key]: value }
		} else if (keyInPreferences(key, PreferencesService.DEFAULT_USER)) {
			if (!sameStructure(value, PreferencesService.DEFAULT_USER[key])) throw createKeyError(key, value)
			this.#user = { ...this.#user, [key]: value }
		} else if (keyInPreferences(key, PreferencesService.DEFAULT_VIM)) {
			if (!sameStructure(value, PreferencesService.DEFAULT_VIM[key])) throw createKeyError(key, value)
			this.#vim = { ...this.#vim, [key]: value }
		} else throw new InvalidPreferencesError(`the key "${key}" not exist in Preferences`)

		return this
	}

	toJSON() {
		return this.value
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
