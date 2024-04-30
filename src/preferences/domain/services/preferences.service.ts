import { FormFields } from '~/share/domain/services'
import { inject, InvalidPreferencesError } from '~/share/utils'

import { IDLE_PREFS, type IPrefs, type Prefs, PREFS_FIELDS } from '../models'
import type { PrefsRepo } from '../repositories'
import { PrefsObs } from './preferences-obs.service'

export class PrefsSvc implements IPrefs {
	readonly #obs = inject(PrefsObs)
	readonly #save

	constructor(save: (data: Prefs) => Promise<void>) {
		this.#save = save
	}

	get data() {
		return this.#obs.data
	}

	static create(repo: PrefsRepo) {
		return new PrefsSvc(repo.save)
	}

	resetAll() {
		this.#obs.set(IDLE_PREFS)
		return this
	}

	resetByKey<K extends keyof Prefs>(key: K) {
		if (!PREFS_FIELDS.containsKey(key)) throw new InvalidPreferencesError('Invalid preference key')

		this.#obs.update(prefs => ({ ...prefs, [key]: IDLE_PREFS[key] }))
		return this
	}

	async save() {
		await this.#save(this.data)
	}

	setAll(data: Prefs) {
		this.#obs.set({ ...data })
		return this
	}

	setByKey<K extends keyof Prefs>(key: K, value: Prefs[K]) {
		if (!PREFS_FIELDS.containsKey(key)) throw new InvalidPreferencesError('Invalid preference key')
		if (!FormFields.satisfiesField(PREFS_FIELDS.valueByKey(key), value))
			throw new InvalidPreferencesError(`"${key}" preference cannot be ${String(value)}`)
		this.#obs.update(prefs => ({ ...prefs, [key]: value }))
		return this
	}
}
