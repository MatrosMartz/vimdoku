import type { Pos } from '~/share/domain/models'
import { InvalidBoardError } from '~/share/utils'

import { type GameOpts, type IGrid, type SolutionJSON, type ValidNumbers } from '../models'
import { type Board, type BoardJSON, type IBoard } from '../models/board.model'
import { CellKind, type ICell, INSERT_KINDS } from '../models/cell.model'
import { CellSvc } from './cell.service'
import { GridSvc } from './grid.service'

/** Represent a Sudoku Board Service. */
export class BoardSvc implements IBoard {
	#correctCells = 0
	#grid

	/**
	 * Creates an instance of the BoardSvc class.
	 * @param grid Initial Sudoku board.
	 */
	constructor(grid: IGrid<ICell>) {
		this.#grid = grid
		this.#correctCells = this.#grid.count(({ isCorrect }) => isCorrect)
	}

	get data(): Board {
		return this.#grid.mapGrid(cell => cell.data).data
	}

	get hasWin() {
		return this.#correctCells === 81
	}

	/**
	 * Create an instance of BoardSvc with options.
	 * @param opts Options for create board (optional).
	 */
	static create(opts: GameOpts): BoardSvc
	static create({ difficulty, solution }: GameOpts) {
		const diffNum = Number(difficulty)
		const grid = GridSvc.create<ICell>(pos => {
			const isInitial = Boolean(Math.floor(Math.random() * diffNum))
			return CellSvc.create({ isInitial, solution: solution.grid.getCell(pos), pos })
		})

		return new BoardSvc(grid)
	}

	/**
	 * Create an instance of BoardSvc from a JSON string
	 * @param boardLike JSON representation of board.
	 * @param solution JSON representation of solutions.
	 * @throws {InvalidBoardError} If `boardLike` is not a valid JSON.
	 */
	static fromJSON(boardLike: BoardJSON, solution: SolutionJSON) {
		try {
			if (Array.isArray(boardLike)) {
				const data = new GridSvc(boardLike).mapGrid<ICell>((json, { y, x }) =>
					CellSvc.fromJSON({ cellLike: json, solution: solution[y][x], pos: { y, x } })
				)
				return new BoardSvc(data)
			} else throw new InvalidBoardError(boardLike)
		} catch (err) {
			throw err instanceof InvalidBoardError ? err : new InvalidBoardError(boardLike, err)
		}
	}

	/**
	 * Create an instance of BoardSvc from a JSON string
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

	clear(cellPos: Pos) {
		this.#grid = this.#grid.editCell(cellPos, cell => cell.clear())

		return this
	}

	noteDeletion(cellPos: Pos, num: ValidNumbers) {
		if (this.#grid.getCell(cellPos).kind !== CellKind.Initial)
			this.#grid = this.#grid.mapRelated(cellPos, cell => cell.removeNote(num))

		return this
	}

	toJSON(): BoardJSON {
		return this.#grid.mapGrid(cell => cell.toJSON()).data
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	toggleNotes(cellPos: Pos, num: ValidNumbers) {
		this.#grid = this.#grid.editCell(cellPos, cell => cell.toggleNote(num))

		return this
	}

	validate(cellPos: Pos, effect: (result: boolean) => void) {
		this.#grid = this.#grid.editCell(cellPos, cell => cell.verify(effect))
		return this
	}

	validateAllBoard(effect: (result: boolean) => void) {
		this.#grid = this.#grid.mapGrid(cell => (INSERT_KINDS.includes(cell.kind) ? cell.verify(effect) : cell))
		return this
	}

	write(cellPos: Pos, num: ValidNumbers) {
		if (this.#grid.getCell(cellPos).kind !== CellKind.Initial)
			this.#grid = this.#grid.editCell(cellPos, cell => cell.writeValue(num))

		if (this.#grid.getCell(cellPos).isCorrect) this.#correctCells++

		return this
	}
}
