import { Collection } from '~/share/domain/entities'

export enum Lang {
	EN = 'en',
	ES = 'es',
}

export const LANGS = new Collection.Builder().addToMain.fromObject(Lang).done()
export const IDLE_LANG = Lang.EN
