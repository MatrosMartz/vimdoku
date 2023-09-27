import { _throw, createMatrix, iterateArray, iterateMatrix } from '~/utils'

import type { Position } from './position.model'

export type CompareCBFn<T, U> = (compareCell: T, currCell: T, position: Position) => U
export type CBFn<T, U> = (value: T, position: Position) => U
type CreateCBFn<T> = (pos: Position, retry: () => never) => T

export interface ISudokuGrid<T> {
	/**
	 * Compare a function with related cells in the same row, column, and box of the specified cell.
	 * @param {Position} cellPos The position of the cell to compare with.
	 * @param {CompareCBFn<T, boolean>} fn The comparison function.
	 */
	compareRelated(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	/**
	 * Compare a function with cells in the same box of the specified cell.
	 * @param {Position} cellPos The position of the cell to compare with.
	 * @param {CompareCBFn<T, boolean>} fn The comparison function.
	 */
	compareWithBox(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	/**
	 * Compare a function with cells in the same column of the specified cell.
	 * @param {Position} cellPos The position of the cell to compare with.
	 * @param {CompareCBFn<T, boolean>} fn The comparison function.
	 */
	compareWithCol(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	/**
	 * Compare a function with cells in the same row of the specified cell.
	 * @param {Position} cellPos The position of the cell to compare with.
	 * @param {CompareCBFn<T, boolean>} fn The comparison function.
	 */
	compareWithRow(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	/** Get the data as a two-dimensional array representing the Sudoku grid. */
	get data(): T[][]
	/**
	 * Check if a given function returns true for all cells in a specific box.
	 * @param {number} box The box number (0-8).
	 * @param {CBFn<T, boolean>} fn The function to check against each cell in the box.
	 */
	everyBox(box: number, fn: CBFn<T, boolean>): boolean

	/**
	 * Check if a given function returns true for all cells in a specific column.
	 * @param {number} col The column number (0-8).
	 * @param {CBFn<T, boolean>} fn The function to check against each cell in the col.
	 */
	everyCol(col: number, fn: CBFn<T, boolean>): boolean

	/**
	 * Check if a given function returns true for all cells in the entire grid.
	 * @param {CBFn<T, boolean>} fn The function to check against each cell in the grid.
	 */
	everyGrid(fn: CBFn<T, boolean>): boolean

	/**
	 * Check if a given function returns true for all cells in a specific row.
	 * @param {number} row The row number (0-8).
	 * @param {CBFn<T, boolean>} fn The function to check against each cell in the row.
	 */
	everyRow(row: number, fn: CBFn<T, boolean>): boolean
	/**
	 * Get the value of a cell at the specified position.
	 * @param {Position} position The position of the cell to retrieve.
	 */
	getCell(position: Position): T
	/**
	 * Join the values of cells in a specific box into a string using specified separators.
	 * @param {number} box The box number (0-8).
	 * @param {{ col?: string; row?: string }} separators Separators for columns and rows in the box.
	 */
	joinBox(box: number, separators: { col?: string; row?: string }): string
	/**
	 * Join the values of cells in a specific column into a string using a specified row separator.
	 * @param {number} col The column number (0-8).
	 * @param {string} rowSeparator The separator for rows in the column.
	 */
	joinCol(col: number, rowSeparator: string): string
	/**
	 * Join the values of cells in the entire grid into a string using specified separators.
	 * @param {{ col?: string; row?: string }} separators Separators for columns and rows in the grid.
	 */
	joinGrid(separators: { col?: string; row?: string }): string
	/**
	 * Join the values of cells in a specific row into a string using a specified column separator.
	 * @param {number} row The row number (0-8).
	 * @param {string} colSeparator The separator for columns in the row.
	 */
	joinRow(row: number, colSeparator: string): string
	/**
	 * Map the values of cells in a specific box using a provided mapping function.
	 * @param {number} box The box number (0-8).
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapBox<U>(box: number, fn: CBFn<T, U>): ISudokuGrid<T | U>
	/**
	 * Map the values of cells in a specific column using a provided mapping function.
	 * @param {number} col The column number (0-8).
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapCol<U>(col: number, fn: CBFn<T, U>): ISudokuGrid<T | U>
	/**
	 * Separate cells based on a filter function and apply a transformation to them.
	 * @param {(cell: T, pos: Position) => cell is S} filter The filter function to separate cells.
	 * @param {CBFn<S, U>} map The transformation function to apply to separated cells.
	 */
	mapFiltered<U, S extends T>(filter: (cell: T, pos: Position) => cell is S, map: CBFn<S, U>): ISudokuGrid<T | U>
	/**
	 * Map the values of cells in the entire grid using a provided mapping function.
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapGrid<U>(fn: CBFn<T, U>): ISudokuGrid<U>
	/**
	 * Map the values of cells related to a specified cell position using a provided mapping function.
	 * @param {Position} cellPos The position of the cell to map from.
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapRelated<U>(cellPos: Position, fn: CBFn<T, U>): ISudokuGrid<T | U>
	/**
	 * Map the values of cells in a specific col using a provided mapping function.
	 * @param {number} row The col number (0-8).
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapRow<U>(row: number, fn: CBFn<T, U>): ISudokuGrid<T | U>
	/**
	 * Check if a given function returns true for at least one cell in a specific box.
	 * @param {number} box The box number (0-8).
	 * @param {CBFn<T, boolean>} fn The function to check against each cell in the box.
	 */
	someBox(box: number, fn: CBFn<T, boolean>): boolean
	/**
	 * Check if a given function returns true for at least one cell in a specific column.
	 * @param {number} col The column number (0-8).
	 * @param {CBFn<T, boolean>} fn The function to check against each cell in the column.
	 */
	someCol(col: number, fn: CBFn<T, boolean>): boolean
	/**
	 * Check if a given function returns true for at least one cell in the entire grid.
	 * @param {CBFn<T, boolean>} fn The function to check against each cell in the grid.
	 */
	someGrid(fn: CBFn<T, boolean>): boolean
	/**
	 * Check if a given function returns true for at least one cell in a specific row.
	 * @param {number} row The row number (0-8).
	 * @param {CBFn<T, boolean>} fn The function to check against each cell in the row.
	 */
	someRow(row: number, fn: CBFn<T, boolean>): boolean
}

/** Class representing a Sudoku grid. */
export class SudokuGrid<T> implements ISudokuGrid<T> {
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
		return new SudokuGrid(createMatrix(9, pos => mapFn(pos, _throw(new Error()))))
	}

	/**
	 * Get the box number (0-8) for a given cell position.
	 * @static
	 * @param {Position} pos The position of the cell.
	 * @returns The box number for the cell.
	 */
	static getBoxFromPos(pos: Position) {
		const { row, col } = SudokuGrid.getInitsBox(pos)
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
		return SudokuGrid.getBoxFromPos(pos1) === SudokuGrid.getBoxFromPos(pos2)
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
		const box = SudokuGrid.getInitsBox(cellPos)
		for (const pos of iterateMatrix(3)) {
			const currPos = SudokuGrid.sumPos(pos, box)
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

	everyBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = SudokuGrid.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = SudokuGrid.sumPos(boxPos, pos)
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
		const boxPos = SudokuGrid.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = SudokuGrid.sumPos(pos, boxPos)
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
			return SudokuGrid.getBoxFromPos(currPos) === box ? fn(cell, currPos) : cell
		})

		return new SudokuGrid(newData)
	}

	mapCol<U>(col: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return currPos.col === col ? fn(cell, currPos) : cell
		})
		return new SudokuGrid(newData)
	}

	mapFiltered<U, S extends T>(filter: (cell: T, pos: Position) => cell is S, map: CBFn<S, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return filter(cell, currPos) ? map(cell, currPos) : cell
		})

		return new SudokuGrid(newData)
	}

	mapGrid<U>(fn: CBFn<T, U>) {
		const newData = this.#data.map((Row, row) => Row.map((cell, col) => fn(cell, { row, col })))
		return new SudokuGrid(newData)
	}

	mapRelated<U>(cellPos: Position, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			if (SudokuGrid.samePos(cellPos, currPos)) return cell
			if (SudokuGrid.sameRow(cellPos, currPos)) return fn(cell, currPos)
			if (SudokuGrid.sameCol(cellPos, currPos)) return fn(cell, currPos)
			if (SudokuGrid.sameBox(cellPos, currPos)) return fn(cell, currPos)
			return cell
		})

		return new SudokuGrid(newData)
	}

	mapRow<U>(row: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return currPos.row === row ? fn(cell, currPos) : cell
		})

		return new SudokuGrid(newData)
	}

	someBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = SudokuGrid.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { row, col } = SudokuGrid.sumPos(boxPos, pos)
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
