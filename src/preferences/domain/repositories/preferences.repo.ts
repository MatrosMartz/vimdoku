import type { Preferences } from '../models'

export interface PreferencesRepo {
	delete(): Promise<void>
	has(): Promise<boolean>
	load(): Promise<Preferences | null>
	save(preferences: Preferences): Promise<void>
}
