import { PreferencesService } from '$preferences/domain/services'

import { BrowserPreferencesRepo } from '../repositories'

export const preferencesService = new PreferencesService(new BrowserPreferencesRepo())
