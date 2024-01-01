import { HistoryObsSvc, ObsSvc } from '~/share/domain/services'
import { singleton } from '~/share/utils'

import { type Board, IDLE_MODE, IDLE_TIMER, type ModeKind, type MoveMap } from '../models'

@singleton
export class ModeObs extends ObsSvc<ModeKind> {
	constructor() {
		super(IDLE_MODE)
	}
}

@singleton
export class ErrorsObs extends ObsSvc<number> {
	constructor() {
		super(0)
	}
}

@singleton
export class TimerObs extends ObsSvc<string> {
	constructor() {
		super(IDLE_TIMER)
	}
}

@singleton
export class SavedObs extends ObsSvc<boolean> {
	constructor() {
		super(false)
	}
}

@singleton
export class BoardObs extends ObsSvc<Board | null> {
	constructor() {
		super(null)
	}
}

@singleton
export class MovesObs extends HistoryObsSvc<MoveMap> {
	constructor() {
		super(new Map())
		super.length = 50
	}
}
