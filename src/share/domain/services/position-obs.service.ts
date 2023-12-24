import { singleton } from '~/share/utils'

import { IDLE_POS, type Pos } from '../models'
import { ObsSvc } from './observer.service'

@singleton
export class PosObs extends ObsSvc<Pos> {
	constructor() {
		super(IDLE_POS)
	}
}
