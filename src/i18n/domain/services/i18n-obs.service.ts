import { ObsSvc } from '~/share/domain/services'
import { singleton } from '~/share/utils'

import { type I18n, IDLE_I18N } from '../models'

@singleton
export class I18nObs extends ObsSvc<I18n> {
	constructor() {
		super({ ...IDLE_I18N })
	}
}
