import type { Prefs } from '../models'

export interface PrefsRepo {
	clear(): Promise<void>
	get(): Promise<Prefs | null>
	has(): Promise<boolean>
	save(preferences: Prefs): Promise<void>
}
