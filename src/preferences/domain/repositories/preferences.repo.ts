import type { AllPreferences, IPreferences } from '../models'

export interface PreferencesRepo {
	create(): Promise<void>
	delete(): Promise<void>
	getPreferences(): Promise<IPreferences | null>
	has(): Promise<boolean>
	setPreference<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]): Promise<void>
}
