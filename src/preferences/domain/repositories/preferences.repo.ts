import type { AllPreferences, PreferencesService } from '../models'

export interface PreferencesRepo {
	create(): Promise<void>
	delete(): Promise<void>
	getPreferences(): Promise<PreferencesService | null>
	has(): Promise<boolean>
	setPreference<K extends keyof AllPreferences>(key: K, value: AllPreferences[K]): Promise<void>
}
