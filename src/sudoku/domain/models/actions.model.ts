import type { Observer, Position } from '~/share/domain/models'

import type { Board } from './board.model'
import type { GameOpts } from './game-options.model'
import type { ModeKinds } from './modes.model'
import type { ValidNumbers } from './notes.model'

export enum GameActions {
	ChangeMode = 'change-mode',
	Erase = 'erase',
	Move = 'move',
	RemoveGame = 'remove-game',
	SaveGame = 'save-game',
	StartGame = 'start-game',
	Write = 'write',
}

export interface ChangeModeData {
	mode: ModeKinds
}

interface DirectionMoveData {
	times: number
	type: 'down' | 'left' | 'right' | 'up'
}

interface SetMoveData {
	position: Position
	type: 'set'
}

export type MoveData = DirectionMoveData | SetMoveData

export type StartData = Partial<GameOpts>

export interface WriteData {
	value: ValidNumbers | 0
}

export type GameData = ChangeModeData | MoveData

export type GameDispatchArgs =
	| { data?: null; action: GameActions.Erase }
	| { data?: null; action: GameActions.RemoveGame }
	| { data?: null; action: GameActions.SaveGame }
	| { action: GameActions.ChangeMode; data: ChangeModeData }
	| { action: GameActions.Move; data: MoveData }
	| { action: GameActions.StartGame; data: StartData }
	| { action: GameActions.Write; data: WriteData }

export interface BoardSubscriberArgs {
	observer: Observer<Board | null | undefined>
	on: 'board'
}

export interface ModesSubscriberArgs {
	observer: Observer<ModeKinds | null | undefined>
	on: 'modes'
}
