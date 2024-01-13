import { HistoryObservable, Observable } from '~/share/domain/entities'
import { singleton } from '~/share/utils'

import type { Cell, Grid, MoveMap } from '../entities'
import { IDLE_MODE, IDLE_TIMER, type ModeKind } from '../models'

@singleton
export class ModeObs extends Observable<ModeKind> {
	constructor() {
		super(IDLE_MODE)
	}
}

@singleton
export class ErrorsObs extends Observable<number> {
	constructor() {
		super(0)
	}
}

@singleton
export class TimerObs extends Observable<string> {
	constructor() {
		super(IDLE_TIMER)
	}
}

@singleton
export class SavedObs extends Observable<boolean> {
	constructor() {
		super(false)
	}
}

@singleton
export class BoardObs extends Observable<Grid<Cell> | null> {
	constructor() {
		super(null)
	}
}

@singleton
export class MovesObs extends HistoryObservable<MoveMap> {
	constructor() {
		super(new Map(), 30, [])
	}
}
