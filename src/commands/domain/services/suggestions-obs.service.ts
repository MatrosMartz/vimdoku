import { Observable } from '~/share/domain/entities'
import { singleton } from '~/share/utils'

import type { Sugg } from '../entities'

@singleton
export class SuggsObs<T> extends Observable<Array<Sugg<T>>> {
	constructor() {
		super([])
	}
}
