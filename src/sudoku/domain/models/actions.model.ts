import type { Pos } from '~/share/domain/models'
import type { OptionalKeys } from '~/share/types'

import type { GameOpts } from './game-options.model'
import type { ModeKind } from './modes.model'
import type { ValidNumbers } from './notes.model'

export enum SudokuAction {
	ChangeMode = 'change-mode',
	Check = 'check-game',
	End = 'end-game',
	Erase = 'erase',
	Move = 'move',
	Resume = 'resume-game',
	Save = 'save-game',
	Start = 'start-game',
	Write = 'write',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SudokuData {
	export interface ChangeMode {
		mode: ModeKind
	}

	interface DirectionMove {
		times: number
		type: 'down' | 'left' | 'right' | 'up'
	}

	interface SetMove {
		position: Pos
		type: 'set'
	}

	export type Move = DirectionMove | SetMove

	export type Start = OptionalKeys<GameOpts, 'solution'>

	export interface Write {
		value: ValidNumbers | 0
	}
}

export type SudokuDispatchUnData =
	| SudokuAction.Check
	| SudokuAction.End
	| SudokuAction.Erase
	| SudokuAction.Resume
	| SudokuAction.Save

export interface SudokuDispatch {
	[SudokuAction.ChangeMode]: SudokuData.ChangeMode
	[SudokuAction.Move]: SudokuData.Move
	[SudokuAction.Start]: SudokuData.Start
	[SudokuAction.Write]: SudokuData.Write
}
