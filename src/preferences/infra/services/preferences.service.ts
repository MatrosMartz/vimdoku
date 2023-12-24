import { PrefsSvc } from '$pref/domain/services'

import { BrowserPrefsRepo } from '../repositories'

export const prefs = new PrefsSvc(new BrowserPrefsRepo())
