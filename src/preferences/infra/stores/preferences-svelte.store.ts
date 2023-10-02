import type { RemoveObserver, Update } from '~/share/domain/models'
import type { Preferences } from '$preferences/domain/models'
import { PreferencesService } from '$preferences/domain/services'

import { BrowserPreferencesRepo } from '../repositories'

interface PreferencesStore {
	preferences: PreferencesService
	subscribe(update: Update<Preferences>): RemoveObserver
}

export function preferencesSvelte(): PreferencesStore {
	const preferences = new PreferencesService(new BrowserPreferencesRepo())

	return {
		preferences,
		subscribe: update => preferences.addObserver({ update }),
	}
}
