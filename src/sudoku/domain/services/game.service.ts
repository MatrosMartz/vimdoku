import type { IPosition, Position } from '~/share/domain/models'
import { PositionService } from '~/share/domain/services'

import { type BoardJSON, DifficultyKinds, type GameOpts, type IBoard, ModeKinds, type ValidNumbers } from '../models'
import {
	GameState,
	type IAnnotationGame,
	type ICommandGame,
	type IInsertGame,
	type INonStartedGame,
	type INormalGame,
	type IStartedGameRoot,
	type IWritableGame,
	type StartedGameOpts,
} from '../models/game.model'
import type { GameRepo } from '../repositories'
import { BoardService } from './board.service'
import { SolutionService } from './solution.service'

/** Represent a Non-started Sudoku Game. */
export class NonStartedGameService implements INonStartedGame {
	readonly #repo

	/**
	 * Creates an instance of the Non-started Game class.
	 * @param repo The repository for game data.
	 */
	constructor(repo: GameRepo) {
		this.#repo = repo
	}

	get state() {
		return GameState.NonStarted as const
	}

	async resume() {
		const boardData = await this.#repo.getBoard()

		if (boardData == null) return null

		const opts: StartedGameOpts = {
			board: BoardService.fromJSON(boardData),
			pos: new PositionService(),
			repo: this.#repo,
		}

		return new NormalGameService(opts)
	}

	async start(opts?: GameOpts): Promise<InsertGameService>
	async start({ difficulty = DifficultyKinds.Beginner, solution = SolutionService.create() }: Partial<GameOpts> = {}) {
		const board = BoardService.create({ difficulty, solution })

		await this.#repo.create({ difficulty, solution: solution.toJSON() }, board.toJSON())

		return new InsertGameService({ board, pos: new PositionService(), repo: this.#repo })
	}
}

const board = Symbol('board')
const pos = Symbol('position')
const repo = Symbol('repo')

/** Represents a started Sudoku Game. */
abstract class StartedGameService implements IStartedGameRoot {
	[board]: IBoard;
	[pos]: IPosition;
	[repo]: GameRepo

	/**
	 * Creates an instance of the Started Game class.
	 * @param opts Options for the started game service.
	 */
	constructor(opts: StartedGameOpts) {
		this[board] = opts.board
		this[pos] = opts.pos
		this[repo] = opts.repo
	}

	get state() {
		return GameState.Started as const
	}

	changePos(position: Position) {
		this[pos].change(position)

		return this
	}

	async delete() {
		await this[repo].delete()

		return new NonStartedGameService(this[repo])
	}

	async getBoard(): Promise<BoardJSON> {
		return (await this[repo].getBoard())!
	}

	moveDown(times: number) {
		this[pos].moveDown(times)
		return this
	}

	moveLeft(times: number) {
		this[pos].moveLeft(times)
		return this
	}

	moveRight(times: number) {
		this[pos].moveRight(times)
		return this
	}

	moveUp(times: number) {
		this[pos].moveUp(times)
		return this
	}

	async save() {
		await this[repo].setBoard(this[board].toJSON())
	}
}

abstract class WritableGameService extends StartedGameService implements IWritableGame {
	clear() {
		this[board].clear(this[pos].value)
		return this
	}
}

class AnnotationGameService extends WritableGameService implements IAnnotationGame {
	get mode() {
		return ModeKinds.Annotation as const
	}

	changeToCommand() {
		return new CommandGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	changeToInsert() {
		return new InsertGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	changeToNormal() {
		return new NormalGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	toggleNote(num: ValidNumbers) {
		this[board].toggleNotes(this[pos].value, num)
		return this
	}
}

class CommandGameService extends StartedGameService implements ICommandGame {
	get mode() {
		return ModeKinds.Command as const
	}

	changeToAnnotation() {
		return new AnnotationGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	changeToInsert() {
		return new InsertGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	changeToNormal() {
		return new NormalGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}
}

class InsertGameService extends WritableGameService implements IInsertGame {
	get mode() {
		return ModeKinds.Insert as const
	}

	changeToAnnotation() {
		return new AnnotationGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	changeToCommand() {
		return new CommandGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	changeToNormal() {
		return new NormalGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	write(num: ValidNumbers): this {
		this[board].write(this[pos].value, num)
		return this
	}
}

class NormalGameService extends StartedGameService implements INormalGame {
	get mode() {
		return ModeKinds.Normal as const
	}

	changeToAnnotation() {
		return new AnnotationGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	changeToCommand() {
		return new CommandGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}

	changeToInsert() {
		return new InsertGameService({ board: this[board], pos: this[pos], repo: this[repo] })
	}
}
