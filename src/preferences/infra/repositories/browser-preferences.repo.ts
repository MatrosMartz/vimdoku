import { type BrowserStorage, LocalStorageEntryMissingError } from '~/utils'
import { type AllPreferences, Preferences } from '$preferences/domain/models'
import type { PreferencesRepo } from '$preferences/domain/repositories'

export class BrowserPreferencesRepo implements PreferencesRepo {
	#name
	#storage: BrowserStorage
	#value: Preferences | null = null

	constructor(name = 'preferences') {
		this.#storage = {
			del() {
				localStorage.removeItem(name)
			},
			get: () => localStorage.getItem(name),
			set(value) {
				localStorage.setItem(name, value)
			},
		}
		this.#name = name
	}

	async create() {
		const preferences = new Preferences()

		this.#value = preferences
		this.#storage.set(preferences.toString())
	}

	async delete() {
		this.#value = null
		this.#storage.del()
	}

	async getPreferences() {
		if (this.#value != null) return this.#value

		const data = this.#storage.get()

		if (data == null) return null

		this.#value = Preferences.from(data)

		return this.#value
	}

	async has() {
		return this.#value != null || this.#storage.get() != null
	}

	async setPreference<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]) {
		if (this.#value == null) {
			const data = this.#storage.get()

			if (data == null) throw new LocalStorageEntryMissingError(this.#name)

			this.#value = Preferences.from(data)
		}
		this.#value.set(key, value)

		this.#storage.set(this.#value.toString())
	}
}
