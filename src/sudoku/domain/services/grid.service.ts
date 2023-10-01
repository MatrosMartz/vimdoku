import type { Position } from '~/share/domain/models'
import { PositionService } from '~/share/domain/services'
import { createMatrix, iterateArray, iterateMatrix } from '~/share/utils'

import type { CBFn, CompareCBFn, CreateCBFn, IGrid } from '../models'

/** Class representing a Sudoku grid. */
export class GridService<T> implements IGrid<T> {
	#value

	/**
	 * Create an instance of the GridService class with the provided data.
	 * @param {T[][]} value A two-dimensional array representing the Sudoku grid.
	 * @throws {Error} If the data is invalid (not a 9x9 grid).
	 */
	constructor(value: T[][]) {
		this.#value = value
	}

	get value() {
		return this.#value.map(row => row.map(cell => cell))
	}

	/**
	 * Create an instance of the GridService class with map function.
	 * @param {CreateCBFn<T>} mapFn A mapping function to call on every element of the array.
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
				!fn(this.#value[cellPos.row][cellPos.col], this.getCell(currPos), currPos)
			)
				return false
		}

		return true
	}

	compareWithCol(CellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	compareWithCol({ row: compareRow, col }: Position, fn: CompareCBFn<T, boolean>) {
		for (const row of iterateArray(9))
			if (row !== compareRow && !fn(this.#value[compareRow][col], this.#value[row][col], { row, col })) return false
		return true
	}

	compareWithRow(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	compareWithRow({ row, col: compareCol }: Position, fn: CompareCBFn<T, boolean>) {
		for (const col of iterateArray(9))
			if (col !== compareCol && !fn(this.#value[row][compareCol], this.#value[row][col], { row, col })) return false
		return true
	}

	copy() {
		return new GridService(this.value)
	}

	editCell<U>(cellPos: Position, fn: CBFn<T, U>) {
		const newGrid = this.value as Array<Array<T | U>>

		newGrid[cellPos.row][cellPos.col] = fn(this.getCell(cellPos), cellPos)

		return new GridService(newGrid)
	}

	everyBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = PositionService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = PositionService.sumPos(boxPos, pos)
			if (!fn(this.#value[row][col], { row, col })) return false
		}

		return true
	}

	everyCol(colIndex: number, fn: CBFn<T, boolean>) {
		for (const row of iterateArray(9)) if (!fn(this.#value[row][colIndex], { row, col: colIndex })) return false
		return true
	}

	everyGrid(fn: CBFn<T, boolean>) {
		return this.#value.every((Row, row) => Row.every((cell, col) => fn(cell, { row, col })))
	}

	everyRow(row: number, fn: CBFn<T, boolean>) {
		return this.#value[row].every((cell, col) => fn(cell, { row, col }))
	}

	getCell(pos: Position): T
	getCell({ row, col }: Position) {
		return this.#value[row][col]
	}

	joinBox(box: number, separators: { col?: string; row?: string }): string
	joinBox(box: number, { row: rowSep = '', col: colSep = '' }: { col?: string; row?: string }) {
		let str = ''
		const boxPos = PositionService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = PositionService.sumPos(pos, boxPos)
			if (pos.row === 0 && pos.col === 0) str += this.#value[row][col]
			else if (pos.col === 0) str += colSep + this.#value[row][col]
			else str += rowSep + this.#value[row][col]
		}

		return str
	}

	joinCol(col: number, rowSeparator: string) {
		let str = ''

		for (const row of iterateArray(9))
			if (row === 0) str += this.#value[row][col]
			else str += rowSeparator + this.#value[row][col]

		return str
	}

	joinGrid(separators: { col?: string; row?: string }): string
	joinGrid({ col = '', row = '' }: { col?: string; row?: string }) {
		return this.#value.map(Row => Row.join(row)).join(col)
	}

	joinRow(rowIndex: number, colSeparator: string) {
		return this.#value[rowIndex].join(colSeparator)
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
		const newData = this.#value.map((Row, row) => Row.map((cell, col) => fn(cell, { row, col })))
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
			if (fn(this.#value[row][col], { row, col })) return true
		}

		return false
	}

	someCol(col: number, fn: CBFn<T, boolean>) {
		for (const row of iterateArray(9)) if (fn(this.getCell({ row, col }), { row, col })) return true
		return false
	}

	someGrid(fn: CBFn<T, boolean>): boolean {
		return this.#value.some((Row, row) => Row.some((cell, col) => fn(cell, { row, col })))
	}

	someRow(row: number, fn: CBFn<T, boolean>): boolean {
		return this.#value[row].some((cell, col) => fn(cell, { row, col }))
	}
}
