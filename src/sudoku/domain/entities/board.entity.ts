import { createMatrix, InvalidLikeError } from '~/utils'

import { type BoardValue, type Cell, CellKinds, DifficultyKinds, type NoteValue, type Position } from '../models'
import { Notes } from './notes.entity'
import { Solution } from './solution.entity'

export interface BoardOpts {
	difficulty?: DifficultyKinds
	solution?: Solution
}

interface CellJSON {
	kind: CellKinds
	notes: NoteValue
	value: number
}

export class Board {
	#value

	constructor({ initBoard }: { initBoard?: BoardValue }) {
		this.#value = initBoard ?? Board.#fill()
	}

	get value() {
		return structuredClone(this.#value)
	}

	static create(opts: BoardOpts = {}) {
		return new Board({ initBoard: Board.#fill(opts) })
	}

	static from(boardLike: unknown) {
		if (typeof boardLike === 'string') {
			const initBoard = JSON.parse(boardLike, (key, value) =>
				key !== 'notes' ? value : new Notes({ initNotes: value })
			)
			return new Board({ initBoard })
		}
		if (Array.isArray(boardLike) && boardLike.every(rows => Array.isArray(rows))) {
			const initBoard = (boardLike as CellJSON[][]).map(rows =>
				rows.map<Cell>(cell => ({ ...cell, notes: new Notes({ initNotes: cell.notes }) }))
			)
			return new Board({ initBoard })
		}
		throw new InvalidLikeError('board', boardLike)
	}

	static #fill({ difficulty = DifficultyKinds.Beginner, solution = new Solution() }: BoardOpts = {}) {
		let initials = 0
		const createBox = ({ row, col }: Position): Cell => {
			const isInitial = Boolean(Math.random() * 2) && initials < difficulty
			if (!isInitial)
				return {
					kind: CellKinds.Empty,
					value: 0,
					notes: new Notes(),
				}
			initials++
			return {
				kind: CellKinds.Initial,
				value: solution.value[row][col],
				notes: new Notes(),
			}
		}
		return createMatrix<Cell>(9, { fn: createBox })
	}

	toJSON() {
		return this.#map<CellJSON>(cell => ({
			...cell,
			notes: cell.notes.value,
		}))
	}

	toString() {
		return JSON.stringify(this.toJSON())
	}

	#map<T>(fn: (cell: Cell, pos: Position) => T) {
		return this.#value.map((cols, row) => cols.map((box, col) => fn(box, { row, col })))
	}
}
