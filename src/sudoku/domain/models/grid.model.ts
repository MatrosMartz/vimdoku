import type { Position } from '~/share/domain/models'

export type CompareCBFn<T, U> = (compareCell: T, currCell: T, position: Position) => U
export type CBFn<T, U> = (value: T, position: Position) => U
export type CreateCBFn<T> = (pos: Position) => T

export interface IGrid<T> {
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
	/** Return copy of grid. */
	copy(): IGrid<T>
	/**
	 * Edit selected Cell.
	 * @param {Position} cellPos Position of the cell to be edited.
	 * @param {CDBFn<T,U>} fn The function to edit cell.
	 */
	editCell<U>(cellPos: Position, fn: CBFn<T, U>): IGrid<T | U>
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
	mapBox<U>(box: number, fn: CBFn<T, U>): IGrid<T | U>
	/**
	 * Map the values of cells in a specific column using a provided mapping function.
	 * @param {number} col The column number (0-8).
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapCol<U>(col: number, fn: CBFn<T, U>): IGrid<T | U>
	/**
	 * Separate cells based on a filter function and apply a transformation to them.
	 * @param {(cell: T, pos: Position) => cell is S} filter The filter function to separate cells.
	 * @param {CBFn<S, U>} map The transformation function to apply to separated cells.
	 */
	mapFiltered<U, S extends T>(filter: (cell: T, pos: Position) => cell is S, map: CBFn<S, U>): IGrid<T | U>
	/**
	 * Map the values of cells in the entire grid using a provided mapping function.
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapGrid<U>(fn: CBFn<T, U>): IGrid<U>
	/**
	 * Map the values of cells related to a specified cell position using a provided mapping function.
	 * @param {Position} cellPos The position of the cell to map from.
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapRelated<U>(cellPos: Position, fn: CBFn<T, U>): IGrid<T | U>
	/**
	 * Map the values of cells in a specific col using a provided mapping function.
	 * @param {number} row The col number (0-8).
	 * @param {CBFn<T, U>} fn The mapping function.
	 */
	mapRow<U>(row: number, fn: CBFn<T, U>): IGrid<T | U>
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
	/** Get the value as a two-dimensional array representing the Sudoku grid. */
	get value(): T[][]
}
