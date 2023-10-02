import type { BrowserStorage } from '~/share/utils'
import type { Preferences } from '$preferences/domain/models'
import type { PreferencesRepo } from '$preferences/domain/repositories'

export class BrowserPreferencesRepo implements PreferencesRepo {
	#storage: BrowserStorage

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
	}

	async delete() {
		this.#storage.del()
	}

	async load() {
		const data = this.#storage.get()

		return data == null ? null : (JSON.parse(data) as Preferences)
	}

	async has() {
		return this.#storage.get() != null
	}

	async save(preferences: Preferences) {
		this.#storage.set(JSON.stringify(preferences))
	}
}
