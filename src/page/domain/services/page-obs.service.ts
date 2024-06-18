import { Observable } from '~/share/domain/entities'
import { singleton } from '~/share/utils'

import { Page } from '../entities'

@singleton
export class PageObs extends Observable<Page.Page> {
	constructor() {
		super(Page.IDLE)
	}
}
