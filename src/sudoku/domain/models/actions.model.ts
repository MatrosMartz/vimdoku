import type { Position } from '~/share/domain/models'

import type { GameOpts } from './game-options.model'
import type { ModeKinds } from './modes.model'
import type { ValidNumbers } from './notes.model'

export enum SudokuActions {
	ChangeMode = 'change-mode',
	Erase = 'erase',
	Move = 'move',
	End = 'end-game',
	Save = 'save-game',
	Start = 'start-game',
	Write = 'write',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SudokuData {
	export interface ChangeMode {
		mode: ModeKinds
	}

	interface DirectionMove {
		times: number
		type: 'down' | 'left' | 'right' | 'up'
	}

	interface SetMove {
		position: Position
		type: 'set'
	}

	export type Move = DirectionMove | SetMove

	export type Start = Partial<GameOpts>

	export interface Write {
		value: ValidNumbers | 0
	}
}

export type SudokuDispatchUnData = SudokuActions.End | SudokuActions.Erase | SudokuActions.Save

export interface SudokuDispatch {
	[SudokuActions.ChangeMode]: SudokuData.ChangeMode
	[SudokuActions.Move]: SudokuData.Move
	[SudokuActions.Start]: SudokuData.Start
	[SudokuActions.Write]: SudokuData.Write
}