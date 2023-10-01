import type { Position } from '~/share/domain/models'
import { InvalidBoardError } from '~/share/utils'

import {
	type CellJSON,
	CellKinds,
	type GameOpts,
	type ICell,
	type IGrid,
	type IWritableCell,
	type ValidNumbers,
} from '../models'
import { type Board, type BoardJSON, type IBoard } from '../models/board.model'
import { InitialCellService, WritableCellService } from './cell.service'
import { GridService } from './grid.service'
import { NotesService } from './notes.service'

/** Represent a Sudoku Board Service. */
export class BoardService implements IBoard {
	#grid

	/**
	 * Creates an instance of the BoardService class.
	 * @param grid Initial Sudoku board.
	 */
	constructor(grid: IGrid<ICell>) {
		this.#grid = grid
	}

	get value(): Board {
		return this.#grid.value
	}

	/**
	 * Create instance of BoardService with options.
	 * @param opts Options for create board (optional).
	 */
	static create(opts: GameOpts): BoardService
	static create({ difficulty, solution }: GameOpts) {
		let initials = 0
		const grid = GridService.create<ICell>(pos => {
			const isInitial = Boolean(Math.random() * 2) && initials < difficulty
			if (!isInitial) return new WritableCellService()

			initials++
			return new InitialCellService(solution.grid.getCell(pos))
		})

		return new BoardService(grid)
	}

	/**
	 * Create instance of BoardService from a JSON string
	 * @param boardLike JSON representation of board.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON.
	 */
	static fromJSON(boardLike: CellJSON[][]) {
		try {
			if (Array.isArray(boardLike)) {
				const data = new GridService(boardLike).mapGrid<ICell>(({ kind, num: value, notes }) =>
					kind === CellKinds.Initial
						? new InitialCellService(value as ValidNumbers)
						: new WritableCellService({ kind, num: value, notes: NotesService.fromNumber(Number(notes)) })
				)
				return new BoardService(data)
			} else throw new InvalidBoardError(boardLike)
		} catch (err) {
			throw err instanceof InvalidBoardError ? err : new InvalidBoardError(boardLike, err)
		}
	}

	/**
	 * Create instance of BoardService from a JSON string
	 * @param boardLike JSON representation of board.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON string.
	 */
	static fromString(boardLike: string) {
		try {
			const cellJSONs: CellJSON[][] = JSON.parse(boardLike)

			return this.fromJSON(cellJSONs)
		} catch (err) {
			throw err instanceof InvalidBoardError ? err : new InvalidBoardError(boardLike, err)
		}
	}

	clear(cellPos: Position) {
		this.#grid = this.#grid.editCell(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.clear()))

		return this
	}

	toJSON(): BoardJSON {
		return this.#grid.mapGrid(cell => cell.toJSON()).value
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNotes(cellPos: Position, num: ValidNumbers) {
		this.#grid = this.#grid.editCell(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.toggleNote(num)))

		return this
	}

	write(cellPos: Position, num: ValidNumbers) {
		if (this.#grid.getCell(cellPos).kind !== CellKinds.Initial)
			this.#grid = this.#grid
				.editCell(cellPos, cell => (cell as IWritableCell).writeValue(num))
				.mapRelated(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.removeNote(num)))

		return this
	}
}
