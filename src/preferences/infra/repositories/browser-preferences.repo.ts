import { createBrowserStorage } from '~/share/infra/repositories'
import { _throw, RepoItemNotFoundError } from '~/share/utils'
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

		return data != null ? (JSON.parse(data) as Prefs) : _throw(new RepoItemNotFoundError('preferences'))
	}

	async save(preferences: Prefs) {
		this.#storage.set(JSON.stringify(preferences))
	}
}
