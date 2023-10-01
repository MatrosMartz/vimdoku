import type { Preferences } from '../models'

export interface PreferencesRepo {
	delete(): Promise<void>
	getPreferences(): Promise<Preferences | null>
	has(): Promise<boolean>
	save(preferences: Preferences): Promise<void>
}
