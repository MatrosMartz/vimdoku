import { notifyObservers, ObservableService } from '~/share/domain/services'

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

	async load() {
		const value = await this.#repo.load()

		if (value == null) return

		this.#sudoku = value.sudoku
		this.#user = value.user
		this.#vim = value.vim
	}

	async save() {
		await this.#repo.save(this.value)
	}

	set<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]) {
		if (key in PreferencesService.DEFAULT_SUDOKU) this.#sudoku = { ...this.#sudoku, [key]: value }
		if (key in PreferencesService.DEFAULT_USER) this.#user = { ...this.#user, [key]: value }
		if (key in PreferencesService.DEFAULT_VIM) this.#vim = { ...this.#vim, [key]: value }

		this[notifyObservers](this.value)

		return this
	}

	toJSON() {
		return this.value
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}
}
