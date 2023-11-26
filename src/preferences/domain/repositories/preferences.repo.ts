import type { Prefs } from '../models'

export interface PrefsRepo {
	delete(): Promise<void>
	has(): Promise<boolean>
	load(): Promise<Prefs | null>
	save(preferences: Prefs): Promise<void>
}
