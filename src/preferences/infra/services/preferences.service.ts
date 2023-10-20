import { PreferencesService } from '$preferences/domain/services'

import { BrowserPreferencesRepo } from '../repositories'

export const preferences = new PreferencesService(new BrowserPreferencesRepo())
