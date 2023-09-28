import type { Position } from '~/share/domain/models'
import { createMatrix, iterateArray, iterateMatrix } from '~/share/utils'

import type { CBFn, CompareCBFn, CreateCBFn, IGrid } from '../models'

/** Class representing a Sudoku grid. */
export class GridService<T> implements IGrid<T> {
	#data

	/**
	 * Create a SudokuGrid instance with the provided data.
	 * @param {T[][]} data A two-dimensional array representing the Sudoku grid.
	 * @throws {Error} If the data is invalid (not a 9x9 grid).
	 */
	constructor(data: T[][]) {
		if (data.length !== 9 && data.some(row => row.length !== 9)) throw new Error('data is invalid')
		this.#data = data
	}

	get data() {
		return this.#data
	}

	/**
	 * Create new instance of SudokuGrid.
	 * @param {CreateCBFn<T>} mapFn A mapping function to call on every element of the array.
	 */
	static create<T>(mapFn: CreateCBFn<T>) {
		return new GridService(createMatrix(9, mapFn))
	}

	/**
	 * Get the box number (0-8) for a given cell position.
	 * @static
	 * @param {Position} pos The position of the cell.
	 * @returns The box number for the cell.
	 */
	static getBoxFromPos(pos: Position) {
		const { row, col } = GridService.getInitsBox(pos)
		return row + (col + 3)
	}

	/**
	 * Get the initial position of the box that contains a cell.
	 * @param {Position} position The position of the cell.
	 * @returns The initial position of the box.
	 */
	static getInitsBox(position: Position): Position
	static getInitsBox({ row, col }: Position): Position {
		return { row: Math.ceil(row / 3) * 3, col: Math.ceil(col / 3) * 3 }
	}

	/**
	 * Get the position from a box index.
	 * @param {number} index The box index of the cell.
	 * @returns The initial position of the box.
	 */
	static getPosFromBox(index: number): Position {
		return { row: index % 3, col: Math.ceil(index / 3) }
	}

	/**
	 * Check if two cell positions are in the same box.
	 * @static
	 * @param {Position} pos1 The first cell position.
	 * @param {Position} pos2 The second cell position.
	 * @returns True if the positions are in the same box, otherwise false.
	 */
	static sameBox(pos1: Position, pos2: Position) {
		return GridService.getBoxFromPos(pos1) === GridService.getBoxFromPos(pos2)
	}

	/**
	 * Check if two cell positions are in the same column.
	 * @static
	 * @param {Position} pos1 The first cell position.
	 * @param {Position} pos2 The second cell position.
	 * @returns True if the positions are in the same column, otherwise false.
	 */
	static sameCol(pos1: Position, pos2: Position) {
		return pos1.col === pos2.col
	}

	/**
	 * Check if two cell positions are the same.
	 * @static
	 * @param {Position} pos1 The first cell position.
	 * @param {Position} pos2 The second cell position.
	 * @returns True if the positions are the same, otherwise false.
	 */
	static samePos(pos1: Position, pos2: Position) {
		return pos1.row === pos2.row && pos1.col === pos2.col
	}

	/**
	 * Check if two cell positions are in the same row.
	 * @static
	 * @param {Position} pos1 The first cell position.
	 * @param {Position} pos2 The second cell position.
	 * @returns True if the positions are in the same row, otherwise false.
	 */
	static sameRow(pos1: Position, pos2: Position) {
		return pos1.row === pos2.row
	}

	/**
	 * Sum two cell positions.
	 * @static
	 * @param {Position} pos1 The first cell position.
	 * @param {Position} pos2 The second cell position.
	 */
	static sumPos(pos1: Position, pos2: Position): Position {
		return { row: pos1.row + pos2.row, col: pos1.col + pos2.col }
	}

	compareRelated(cellPos: Position, fn: CompareCBFn<T, boolean>) {
		return this.compareWithBox(cellPos, fn) && this.compareWithCol(cellPos, fn) && this.compareWithRow(cellPos, fn)
	}

	compareWithBox(cellPos: Position, fn: CompareCBFn<T, boolean>) {
		const box = GridService.getInitsBox(cellPos)
		for (const pos of iterateMatrix(3)) {
			const currPos = GridService.sumPos(pos, box)
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

	editCell<U>(cellPos: Position, fn: CBFn<T, U>) {
		const newGrid = this.data as Array<Array<T | U>>

		newGrid[cellPos.row][cellPos.col] = fn(this.getCell(cellPos), cellPos)

		return new GridService(newGrid)
	}

	everyBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = GridService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = GridService.sumPos(boxPos, pos)
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

	joinBox(box: number, separators: { col?: string; row?: string }): string
	joinBox(box: number, { row: rowSep = '', col: colSep = '' }: { col?: string; row?: string }) {
		let str = ''
		const boxPos = GridService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = GridService.sumPos(pos, boxPos)
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
			return GridService.getBoxFromPos(currPos) === box ? fn(cell, currPos) : cell
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
		const newData = this.#data.map((Row, row) => Row.map((cell, col) => fn(cell, { row, col })))
		return new GridService(newData)
	}

	mapRelated<U>(cellPos: Position, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			if (GridService.samePos(cellPos, currPos)) return cell
			if (GridService.sameRow(cellPos, currPos)) return fn(cell, currPos)
			if (GridService.sameCol(cellPos, currPos)) return fn(cell, currPos)
			if (GridService.sameBox(cellPos, currPos)) return fn(cell, currPos)
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
		const boxPos = GridService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = GridService.sumPos(boxPos, pos)
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
}
