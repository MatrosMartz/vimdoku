import { PrefsSvc } from '$pref/domain/services'

import { BrowserPrefsRepo } from '../repositories'
import { prefsObs } from '../stores'

export const prefs = new PrefsSvc(new BrowserPrefsRepo(), prefsObs)
