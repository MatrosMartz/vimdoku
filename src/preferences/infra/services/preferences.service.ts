import { PreferencesService } from '$pref/domain/services'

import { BrowserPreferencesRepo } from '../repositories'

export const preferences = new PreferencesService(new BrowserPreferencesRepo())
