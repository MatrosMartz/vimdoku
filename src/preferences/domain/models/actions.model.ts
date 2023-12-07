import type { Prefs } from './preferences.model'

export enum PrefActions {
	Reset = 'reset-preferences',
	Save = 'save-preferences',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PrefData {
	export type Reset = { type: 'all' } | { key: keyof Prefs; type: 'by-key' }

	interface SaveAll {
		replace: Prefs
		type: 'all'
	}

	interface SaveByKey<K extends keyof Prefs = keyof Prefs> {
		key: K
		replace: Prefs[K]
		type: 'by-key'
	}

	export type Save = SaveAll | SaveByKey
}

export interface PrefDispatch {
	[PrefActions.Reset]: PrefData.Reset
	[PrefActions.Save]: PrefData.Save
}
