import type { Pos } from '~/share/domain/models'

import type { GameOpts } from './game-options.model'
import type { ModeKinds } from './modes.model'
import type { ValidNumbers } from './notes.model'

export enum SudokuActions {
	ChangeMode = 'change-mode',
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
		mode: ModeKinds
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

	export type Start = Partial<GameOpts>

	export interface Write {
		value: ValidNumbers | 0
	}
}

export type SudokuDispatchUnData = SudokuActions.End | SudokuActions.Erase | SudokuActions.Resume | SudokuActions.Save

export interface SudokuDispatch {
	[SudokuActions.ChangeMode]: SudokuData.ChangeMode
	[SudokuActions.Move]: SudokuData.Move
	[SudokuActions.Start]: SudokuData.Start
	[SudokuActions.Write]: SudokuData.Write
}
