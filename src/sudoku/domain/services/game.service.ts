import type { Pos, PosData } from '~/share/domain/entities'
import type { IPos } from '~/share/domain/models'
import { BuildMatcher, Case } from '~/share/utils'

import { ModeKind } from '../const'
import type { ValidNumbers } from '../entities'
import { type IBoard, type IGame } from '../models'

interface GameOpts {
	board: IBoard
	pos: IPos
}

/** Simulated key for protected field. */
const board = Symbol('game-board')
/** Simulated key for protected field. */
const pos = Symbol('game-pos')

export abstract class GameSvc implements IGame {
	static readonly #create = new BuildMatcher<[GameOpts, ModeKind], GameSvc>()
		.addCase(Case.array([Case.Any, Case.equalTo(ModeKind.N)]), data => new AnnotationGameSvc(data))
		.addCase(Case.array([Case.Any, Case.equalTo(ModeKind.I)]), data => new InsertGameSvc(data))
		.addCase(Case.array([Case.Any, Case.equalTo(ModeKind.V)]), data => new VisualGameSvc(data))
		.addCase(Case.array([Case.Any, Case.equalTo(ModeKind.X)]), data => new NormalGameSvc(data))
		.done()

	protected readonly [board]: IBoard
	protected readonly [pos]: IPos

	constructor(opts: GameOpts) {
		this[board] = opts.board
		this[pos] = opts.pos
	}

	get errors() {
		return this[board].errors
	}

	get hasWin() {
		return this[board].hasWin
	}

	/**
	 * Create an instance of GameState with options.
	 * @param data The game data with create instance.
	 * @param mode The value to set.
	 * @returns A new state.
	 */
	static create(data: GameOpts, mode: ModeKind): GameSvc {
		return GameSvc.#create(data, mode)
	}

	changeMode(mode: ModeKind) {
		return GameSvc.create({ board: this[board], pos: this[pos] }, mode)
	}

	clear() {
		return this
	}

	move(dir: 'Down' | 'Left' | 'Right' | 'Up', times: number) {
		this[pos][`move${dir}`](times)
		return this
	}

	moveTo(position: Pos<PosData>) {
		this[pos].set(position)

		return this
	}

	redo() {
		return this
	}

	toJSON() {
		return this[board].toJSON()
	}

	undo() {
		return this
	}

	validateWrite() {
		return this
	}

	verify() {
		this[board].validateAllBoard()
		return this
	}

	write(num: ValidNumbers, opts: { removeNotes: boolean; validate: boolean }) {
		return this
	}
}

abstract class EditedGameSvc extends GameSvc {
	clear() {
		this[board].clear(this[pos].data)
		return this
	}

	redo() {
		this[board].redo()
		return this
	}

	undo() {
		this[board].undo()
		return this
	}
}

class AnnotationGameSvc extends EditedGameSvc {
	write(num: ValidNumbers) {
		this[board].toggleNotes(this[pos].data, num)
		return this
	}
}

class InsertGameSvc extends EditedGameSvc {
	validateWrite() {
		this[board].validate(this[pos].data)
		return this
	}

	write(num: ValidNumbers, { removeNotes, validate }: { removeNotes: boolean; validate: boolean }) {
		this[board].write(this[pos].data, num)
		if (removeNotes) this[board].noteDeletion(this[pos].data, num)
		if (validate) this[board].validate(this[pos].data)
		return this
	}
}

class VisualGameSvc extends GameSvc {}

class NormalGameSvc extends GameSvc {}
