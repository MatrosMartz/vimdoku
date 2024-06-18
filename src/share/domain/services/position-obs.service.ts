import { Prtcl, singleton } from '~/share/utils'

import { Observable, Pos } from '../entities'

@singleton
export class PosObs extends Observable<Pos.Pos> {
	constructor() {
		super(Pos.IDLE)
	}
}
