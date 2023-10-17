import type { Position } from '~/share/domain/models'
import { PositionService } from '~/share/domain/services'
import type { Tuple } from '~/share/types'
import { createArray, createMatrix, iterateArray, iterateMatrix } from '~/share/utils'

import type { CBFn, CompareCBFn, CreateCBFn, GridData, IGrid } from '../models'

/** Represent a Sudoku Grid Service. */
export class GridService<T> implements IGrid<T> {
	/** The position of the first cell. */
	static readonly FIRST_POSITION: Position = { row: 0, col: 0 }
	/** The position of the last cell. */
	static readonly LAST_POSITION: Position = { row: 8, col: 8 }

	#data

	/**
	 * Creates an instance of the GridService class with the provided data.
	 * @param data A two-dimensional array representing the Sudoku grid.
	 * @throws {Error} If the data is invalid (not a 9x9 grid).
	 */
	constructor(data: GridData<T>) {
		this.#data = data
	}

	get data() {
		return this.#data.map(row => row.map(cell => cell)) as GridData<T>
	}

	/**
	 * Creates an instance of the GridService with map function.
	 * @param mapFn A mapping function to call on every element of the array.
	 */
	static create<T>(mapFn: CreateCBFn<T>) {
		return new GridService(createMatrix(9, mapFn))
	}

	compareRelated(cellPos: Position, fn: CompareCBFn<T, boolean>) {
		return this.compareWithBox(cellPos, fn) && this.compareWithCol(cellPos, fn) && this.compareWithRow(cellPos, fn)
	}

	compareWithBox(cellPos: Position, fn: CompareCBFn<T, boolean>) {
		const box = PositionService.getInitsBox(cellPos)
		for (const pos of iterateMatrix(3)) {
			const currPos = PositionService.sumPos(pos, box)
			if (
				(currPos.row !== cellPos.row || currPos.col !== cellPos.col) &&
				!fn(this.#data[cellPos.row][cellPos.col], this.getCell(currPos), currPos)
			)
				return false
		}

		return true
	}

	compareWithCol(CellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	compareWithCol({ row: compareRow, col }: Position, fn: CompareCBFn<T, boolean>) {
		for (const row of iterateArray(9))
			if (row !== compareRow && !fn(this.#data[compareRow][col], this.#data[row][col], { row, col })) return false
		return true
	}

	compareWithRow(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	compareWithRow({ row, col: compareCol }: Position, fn: CompareCBFn<T, boolean>) {
		for (const col of iterateArray(9))
			if (col !== compareCol && !fn(this.#data[row][compareCol], this.#data[row][col], { row, col })) return false
		return true
	}

	copy() {
		return new GridService(this.data)
	}

	editCell<U>(cellPos: Position, fn: CBFn<T, U>) {
		const newGrid: GridData<T | U> = this.data

		newGrid[cellPos.row][cellPos.col] = fn(this.getCell(cellPos), cellPos)

		return new GridService(newGrid)
	}

	everyBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = PositionService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = PositionService.sumPos(boxPos, pos)
			if (!fn(this.#data[row][col], { row, col })) return false
		}

		return true
	}

	everyCol(colIndex: number, fn: CBFn<T, boolean>) {
		for (const row of iterateArray(9)) if (!fn(this.#data[row][colIndex], { row, col: colIndex })) return false
		return true
	}

	everyGrid(fn: CBFn<T, boolean>) {
		return this.#data.every((Row, row) => Row.every((cell, col) => fn(cell, { row, col })))
	}

	everyRow(row: number, fn: CBFn<T, boolean>) {
		return this.#data[row].every((cell, col) => fn(cell, { row, col }))
	}

	getCell(pos: Position): T
	getCell({ row, col }: Position) {
		return this.#data[row][col]
	}

	groupSubgrids<U>(fn: CBFn<T, U>) {
		const newGrid = {} as {
			[K in keyof U]: GridService<U[K]>
		}

		for (const pos of iterateMatrix(9)) {
			const result = fn(this.getCell(pos), pos)

			for (const key of Object.keys(result)) {
				if (!(key in newGrid)) newGrid[key] = new GridService(createArray(9, () => Array(9) as Tuple<U[keyof U], 9>))
				newGrid[key].#mutateCell(pos, result[key])
			}
		}

		return newGrid
	}

	joinBox(box: number, separators: { col?: string; row?: string }): string
	joinBox(box: number, { row: rowSep = '', col: colSep = '' }: { col?: string; row?: string }) {
		let str = ''
		const boxPos = PositionService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = PositionService.sumPos(pos, boxPos)
			if (pos.row === 0 && pos.col === 0) str += this.#data[row][col]
			else if (pos.col === 0) str += colSep + this.#data[row][col]
			else str += rowSep + this.#data[row][col]
		}

		return str
	}

	joinCol(col: number, rowSeparator: string) {
		let str = ''

		for (const row of iterateArray(9))
			if (row === 0) str += this.#data[row][col]
			else str += rowSeparator + this.#data[row][col]

		return str
	}

	joinGrid(separators: { col?: string; row?: string }): string
	joinGrid({ col = '', row = '' }: { col?: string; row?: string }) {
		return this.#data.map(Row => Row.join(row)).join(col)
	}

	joinRow(rowIndex: number, colSeparator: string) {
		return this.#data[rowIndex].join(colSeparator)
	}

	mapBox<U>(box: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return PositionService.getBoxFromPos(currPos) === box ? fn(cell, currPos) : cell
		})

		return new GridService(newData)
	}

	mapCol<U>(col: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return currPos.col === col ? fn(cell, currPos) : cell
		})
		return new GridService(newData)
	}

	mapFiltered<U, S extends T>(filter: (cell: T, pos: Position) => cell is S, map: CBFn<S, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return filter(cell, currPos) ? map(cell, currPos) : cell
		})

		return new GridService(newData)
	}

	mapGrid<U>(fn: CBFn<T, U>) {
		const newData = this.#data.map((Row, row) => Row.map((cell, col) => fn(cell, { row, col }))) as GridData<U>
		return new GridService(newData)
	}

	mapRelated<U>(cellPos: Position, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			if (PositionService.equalsPos(cellPos, currPos)) return cell
			if (PositionService.equalsRow(cellPos, currPos)) return fn(cell, currPos)
			if (PositionService.equalsCol(cellPos, currPos)) return fn(cell, currPos)
			if (PositionService.equalsBox(cellPos, currPos)) return fn(cell, currPos)
			return cell
		})

		return new GridService(newData)
	}

	mapRow<U>(row: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return currPos.row === row ? fn(cell, currPos) : cell
		})

		return new GridService(newData)
	}

	someBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = PositionService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = PositionService.sumPos(boxPos, pos)
			if (fn(this.#data[row][col], { row, col })) return true
		}

		return false
	}

	someCol(col: number, fn: CBFn<T, boolean>) {
		for (const row of iterateArray(9)) if (fn(this.getCell({ row, col }), { row, col })) return true
		return false
	}

	someGrid(fn: CBFn<T, boolean>): boolean {
		return this.#data.some((Row, row) => Row.some((cell, col) => fn(cell, { row, col })))
	}

	someRow(row: number, fn: CBFn<T, boolean>): boolean {
		return this.#data[row].some((cell, col) => fn(cell, { row, col }))
	}

	/**
	 * Change the content of the specific cell.
	 * @param pos Position of cell to be mutate.
	 * @param newCell The new Cell content.
	 */
	#mutateCell(pos: Position, newCell: T): void
	#mutateCell({ row, col }: Position, newCell: T) {
		this.#data[row][col] = newCell
	}
}
