import { createBrowserStorage } from '~/share/infra/repositories'
import type { Prefs } from '$pref/domain/models'
import type { PrefsRepo } from '$pref/domain/repositories'

export class BrowserPrefsRepo implements PrefsRepo {
	readonly #storage

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

		return data == null ? null : (JSON.parse(data) as Prefs)
	}

	async save(preferences: Prefs) {
		this.#storage.set(JSON.stringify(preferences))
	}
}
