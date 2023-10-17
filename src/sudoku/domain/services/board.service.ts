import type { Position } from '~/share/domain/models'
import { InvalidBoardError } from '~/share/utils'

import { CellKinds, type GameOpts, type ICell, type IGrid, type SolutionJSON, type ValidNumbers } from '../models'
import { type Board, type BoardJSON, type IBoard } from '../models/board.model'
import { CellService } from './cell.service'
import { GridService } from './grid.service'

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

	get data(): Board {
		return this.#grid.data
	}

	/**
	 * Create an instance of BoardService with options.
	 * @param opts Options for create board (optional).
	 */
	static create(opts: GameOpts): BoardService
	static create({ difficulty, solution }: GameOpts) {
		let initials = 0
		const grid = GridService.create<ICell>(pos => {
			const isInitial = Boolean(Math.random() * 2) && initials < difficulty
			if (isInitial) initials++
			return CellService.create({ isInitial, solution: solution.grid.getCell(pos) })
		})

		return new BoardService(grid)
	}

	/**
	 * Create an instance of BoardService from a JSON string
	 * @param boardLike JSON representation of board.
	 * @param solution JSON representation of solutions.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON.
	 */
	static fromJSON(boardLike: BoardJSON, solution: SolutionJSON) {
		try {
			if (Array.isArray(boardLike)) {
				const data = new GridService(boardLike).mapGrid<ICell>((json, { row, col }) =>
					CellService.fromJSON(json, solution[row][col])
				)
				return new BoardService(data)
			} else throw new InvalidBoardError(boardLike)
		} catch (err) {
			throw err instanceof InvalidBoardError ? err : new InvalidBoardError(boardLike, err)
		}
	}

	/**
	 * Create an instance of BoardService from a JSON string
	 * @param boardLike JSON representation of board.
	 * @param solution JSON representation of solutions.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON string.
	 */
	static fromString(boardLike: string, solution: SolutionJSON) {
		try {
			const cellJSONs: BoardJSON = JSON.parse(boardLike)

			return this.fromJSON(cellJSONs, solution)
		} catch (err) {
			throw err instanceof InvalidBoardError ? err : new InvalidBoardError(boardLike, err)
		}
	}

	clear(cellPos: Position) {
		this.#grid = this.#grid.editCell(cellPos, cell => (cell.kind === CellKinds.Initial ? cell : cell.clear()))

		return this
	}

	toJSON(): BoardJSON {
		return this.#grid.mapGrid(cell => cell.toJSON()).data
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
				.editCell(cellPos, cell => cell.writeValue(num))
				.mapRelated(cellPos, cell => cell.removeNote(num))

		return this
	}
}
