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
		load: async () => await preferencesService.load(),
		set: async preferences => await preferencesService.setAll(preferences).save(),
		subscribe: update => preferencesService.addObserver({ update }),
	}
}

await preferencesService.load()

export const prefSvelte = createPreferencesSvelte()
