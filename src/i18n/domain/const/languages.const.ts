import { Collection } from '~/share/domain/entities'

export enum Lang {
	EN = 'en',
	ES = 'es',
}

export const LANGS = Collection.create().addEntries(Collection.entriesByObj(Lang)).done()
export const IDLE_LANG = Lang.EN
