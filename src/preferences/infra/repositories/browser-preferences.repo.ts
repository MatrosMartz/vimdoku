import { BrowserStorage } from '~/share/infra/repositories'
import type { Prefs } from '$pref/domain/models'
import type { PrefsRepo } from '$pref/domain/repositories'

const prefsStorage = BrowserStorage.basic<Prefs>('preferences')

export const browserPrefsRepo: PrefsRepo = {
	clear: async () => prefsStorage.del(),
	get: async () => prefsStorage.get(),
	has: async () => prefsStorage.get() != null,
	save: async (preferences: Prefs) => prefsStorage.set(preferences),
}
