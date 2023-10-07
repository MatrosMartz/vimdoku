import type { RemoveObserver, Update } from '~/share/domain/models'
import type { Preferences } from '$preferences/domain/models'

import { preferencesService } from './preferences'

interface PreferencesStore {
	load(): Promise<void>
	set(preferences: Preferences): Promise<void>
	subscribe(update: Update<Preferences>): RemoveObserver
}

function createPreferencesSvelte(): PreferencesStore {
	return {
		async load() {
			await preferencesService.load()
		},
		async set(preferences) {
			await preferencesService.setAll(preferences).save()
		},
		subscribe: update => preferencesService.addObserver({ update }),
	}
}

void preferencesService.load()

export const prefSvelte = createPreferencesSvelte()
