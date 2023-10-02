import type { RemoveObserver, Update } from '~/share/domain/models'
import type { AllPreferences, Preferences } from '$preferences/domain/models'
import { PreferencesService } from '$preferences/domain/services'

import { BrowserPreferencesRepo } from '../repositories'

interface PreferencesStore {
	setByKey<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]): void
	subscribe(update: Update<Preferences>): RemoveObserver
}
const preferences = new PreferencesService(new BrowserPreferencesRepo())

function createPreferencesSvelte(): PreferencesStore {
	return {
		setByKey(key, value) {
			preferences.set(key, value)
		},
		subscribe: update => preferences.addObserver({ update }),
	}
}

void preferences.load()

export const prefSvelte = createPreferencesSvelte()
