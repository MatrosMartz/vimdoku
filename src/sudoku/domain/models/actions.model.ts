import type { Pos } from '~/share/domain/entities'
import type { OptionalKeys } from '~/share/types'

import type { ValidNumbers } from '../entities'
import type { GameOpts } from './game-options.model'
import type { ModeKind } from './modes.model'

export enum SudokuAction {
	ChangeMode = 'change-mode',
	Check = 'check-game',
	End = 'end-game',
	Erase = 'erase',
	Move = 'move',
	Redo = 'redo-game',
	Resume = 'resume-game',
	Save = 'save-game',
	Start = 'start-game',
	Undo = 'undo-game',
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
	| SudokuAction.Redo
	| SudokuAction.Resume
	| SudokuAction.Save
	| SudokuAction.Undo

export interface SudokuDispatch {
	[SudokuAction.ChangeMode]: SudokuData.ChangeMode
	[SudokuAction.Move]: SudokuData.Move
	[SudokuAction.Start]: SudokuData.Start
	[SudokuAction.Write]: SudokuData.Write
}
