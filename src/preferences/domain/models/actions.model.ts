import type { Observer } from '~/share/domain/models'

import type { AllPreferences, Preferences } from './preferences.model'

export enum PreferencesActions {
	ResetPref = 'reset-preferences',
	SavePref = 'save-preferences',
}

export type ResetPrefData = { type: 'all' } | { key: keyof AllPreferences; type: 'by-key' }

interface SaveAllPrefData {
	replace: Preferences
	type: 'all'
}

interface SaveByKeyPrefData<K extends keyof AllPreferences = keyof AllPreferences> {
	key: K
	replace: AllPreferences[K]
	type: 'by-key'
}

export type SavePrefData = SaveAllPrefData | SaveByKeyPrefData

export type PrefData = ResetPrefData | SavePrefData

export type PrefDispatchArgs =
	| { action: PreferencesActions.ResetPref; data: ResetPrefData }
	| { action: PreferencesActions.SavePref; data: SavePrefData }

export interface PrefSubscriberArgs {
	observer: Observer<Preferences>
	on: 'preferences'
}
