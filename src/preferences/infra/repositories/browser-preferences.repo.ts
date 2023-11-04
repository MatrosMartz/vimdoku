import { createBrowserStorage } from '~/share/infra/repositories'
import type { Preferences } from '$pref/domain/models'
import type { PreferencesRepo } from '$pref/domain/repositories'

export class BrowserPreferencesRepo implements PreferencesRepo {
	#storage

	constructor(name = 'preferences') {
		this.#storage = createBrowserStorage(name)
	}

	async delete() {
		this.#storage.del()
	}

	async has() {
		return this.#storage.get() != null
	}

	async load() {
		const data = this.#storage.get()

		return data == null ? null : (JSON.parse(data) as Preferences)
	}

	async save(preferences: Preferences) {
		this.#storage.set(JSON.stringify(preferences))
	}
}
