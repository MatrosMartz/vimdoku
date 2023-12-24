import { ObsSvc } from '~/share/domain/services'
import { singleton } from '~/share/utils'

import type { Sugg } from '../models'

@singleton
export class SuggsObs extends ObsSvc<Sugg[]> {
	constructor() {
		super([])
	}
}
