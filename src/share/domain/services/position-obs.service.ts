import { singleton } from '~/share/utils'

import { IDLE_POS, Observable, type Pos } from '../entities'

@singleton
export class PosObs extends Observable<Pos> {
	constructor() {
		super(IDLE_POS)
	}
}
