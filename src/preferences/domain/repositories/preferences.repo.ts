import type { Preferences } from '../entities'
import type { AllPreferences } from '../models'

export interface PreferencesRepo {
	create(): Promise<void>
	delete(): Promise<void>
	getPreferences(): Promise<Preferences | null>
	has(): Promise<boolean>
	setPreference<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]): Promise<void>
}
