import { Group } from '~/share/domain/entities'

export enum Lang {
	EN = 'en',
	ES = 'es',
}

export const LANGS = Group.fromValues(Lang)
export const IDLE_LANG = Lang.EN
