import type { Pos, PosData } from '~/share/domain/entities'
import type { IPos } from '~/share/domain/models'

import { ModeKind } from '../const'
import type { ValidNumbers } from '../entities'
import { type IBoard, type IGame } from '../models'

interface GameOpts {
	board: IBoard
	pos: IPos
}

export abstract class GameSvc implements IGame {
	protected readonly _board: IBoard
	protected readonly _pos: IPos

	constructor(opts: GameOpts) {
		this._board = opts.board
		this._pos = opts.pos
	}

	get errors() {
		return this._board.errors
	}

	get hasWin() {
		return this._board.hasWin
	}

	/**
	 * Create an instance of GameState with options.
	 * @param opts The game data with create instance.
	 * @param mode The value to set.
	 * @returns A new state.
	 */
	static create(opts: GameOpts, mode: ModeKind): GameSvc {
		if (mode === ModeKind.N) return new AnnotationGameSvc(opts)
		if (mode === ModeKind.X) return new NormalGameSvc(opts)
		if (mode === ModeKind.I) return new InsertGameSvc(opts)
		return new VisualGameSvc(opts)
	}

	changeMode(mode: ModeKind) {
		return GameSvc.create({ board: this._board, pos: this._pos }, mode)
	}

	clear() {
		return this
	}

	move(dir: 'Down' | 'Left' | 'Right' | 'Up', times: number) {
		this._pos[`move${dir}`](times)
		return this
	}

	moveTo(position: Pos<PosData>) {
		this._pos.set(position)

		return this
	}

	redo() {
		return this
	}

	toJSON() {
		return this._board.toJSON()
	}

	undo() {
		return this
	}

	validateWrite() {
		return this
	}

	verify() {
		this._board.validateAllBoard()
		return this
	}

	write(num: ValidNumbers, opts: { removeNotes: boolean; validate: boolean }) {
		return this
	}
}

abstract class EditedGameSvc extends GameSvc {
	clear() {
		this._board.clear(this._pos.data)
		return this
	}

	redo() {
		this._board.redo()
		return this
	}

	undo() {
		this._board.undo()
		return this
	}
}

class AnnotationGameSvc extends EditedGameSvc {
	write(num: ValidNumbers) {
		this._board.toggleNotes(this._pos.data, num)
		return this
	}
}

class InsertGameSvc extends EditedGameSvc {
	validateWrite() {
		this._board.validate(this._pos.data)
		return this
	}

	write(num: ValidNumbers, { removeNotes, validate }: { removeNotes: boolean; validate: boolean }) {
		this._board.write(this._pos.data, num)
		if (removeNotes) this._board.noteDeletion(this._pos.data, num)
		if (validate) this._board.validate(this._pos.data)
		return this
	}
}

class VisualGameSvc extends GameSvc {}

class NormalGameSvc extends GameSvc {}
