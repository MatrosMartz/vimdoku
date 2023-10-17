import type { Position } from '~/share/domain/models'
import type { Tuple } from '~/share/types'

export type CompareCBFn<T, U> = (compareCell: T, currCell: T, position: Position) => U
export type CBFn<T, U> = (value: T, position: Position) => U
export type CreateCBFn<T> = (pos: Position) => T
export type SubGrids<U> = {
	[K in keyof U]: IGrid<U[K]>
}

export type GridData<T> = Tuple<Tuple<T, 9>, 9>

export interface IGrid<T> {
	/** Get the data as a two-dimensional array representing the Sudoku grid. */
	readonly data: GridData<T>
	/**
	 * Compare a function with related cells in the same row, column, and box of the specified cell.
	 * @param cellPos The position of the cell to compare with.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all related cells, false otherwise.
	 */
	compareRelated(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	/**
	 * Compare a function with cells in the same box of the specified cell.
	 * @param cellPos The position of the cell to compare with.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all cells in the same box, false otherwise.
	 */
	compareWithBox(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	/**
	 * Compare a function with cells in the same column of the specified cell.
	 * @param cellPos The position of the cell to compare with.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all cells in the same column, false otherwise.
	 */
	compareWithCol(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	/**
	 * Compare a function with cells in the same row of the specified cell.
	 * @param cellPos The position of the cell to compare with.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all cells in the same row, false otherwise.
	 */
	compareWithRow(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	/**
	 * Return a copy of grid.
	 * @returns A new grid with the same data.
	 */
	copy(): IGrid<T>
	/**
	 * Edit selected Cell.
	 * @param cellPos Position of the cell to be edited.
	 * @param fn The function to edit cell.
	 * @returns A new grid with the edited cell.
	 */
	editCell<U>(cellPos: Position, fn: CBFn<T, U>): IGrid<T | U>
	/**
	 * Check if a given function returns true for all cells in a specific box.
	 * @param box The box number (0-8).
	 * @param fn The function to check against each cell in the box.
	 * @returns True if the function returns true for all cells in the specified box, false otherwise.
	 */
	everyBox(box: number, fn: CBFn<T, boolean>): boolean

	/**
	 * Check if a given function returns true for all cells in a specific column.
	 * @param col The column number (0-8).
	 * @param fn The function to check against each cell in the col.
	 * @returns True if the function returns true for all cells in the specified column, false otherwise.
	 */
	everyCol(col: number, fn: CBFn<T, boolean>): boolean

	/**
	 * Check if a given function returns true for all cells in the entire grid.
	 * @param fn The function to check against each cell in the grid.
	 * @returns True if the function returns true for all cells in the grid, false otherwise.
	 */
	everyGrid(fn: CBFn<T, boolean>): boolean

	/**
	 * Check if a given function returns true for all cells in a specific row.
	 * @param row The row number (0-8).
	 * @param fn The function to check against each cell in the row.
	 * @returns True if the function returns true for all cells in the specified row, false otherwise.
	 */
	everyRow(row: number, fn: CBFn<T, boolean>): boolean
	/**
	 * Get the value of a cell at the specified position.
	 * @param position The position of the cell to retrieve.
	 * @returns The value of the cell.
	 */
	getCell(position: Position): T

	/**
	 * Group and transform subgrids using the provided function.
	 * @param fn The transformation function to apply to subgrids.
	 * @returns An object containing subgrids with the transformed values.
	 */
	groupSubgrids<U>(fn: CBFn<T, U>): SubGrids<U>
	/**
	 * Join the values of cells in a specific box into a string using specified separators.
	 * @param box The box number (0-8).
	 * @param separators Separators for columns and rows in the box.
	 * @returns A string representation of the box with the specified separators.
	 */
	joinBox(box: number, separators: { col?: string; row?: string }): string
	/**
	 * Join the values of cells in a specific column into a string using a specified row separator.
	 * @param col The column number (0-8).
	 * @param rowSeparator The separator for rows in the column.
	 * @returns A string representation of the column with the specified row separator.
	 */
	joinCol(col: number, rowSeparator: string): string
	/**
	 * Join the values of cells in the entire grid into a string using specified separators.
	 * @param separators Separators for columns and rows in the grid.
	 * @returns A string representation of the entire grid with the specified separators.
	 */
	joinGrid(separators: { col?: string; row?: string }): string
	/**
	 * Join the values of cells in a specific row into a string using a specified column separator.
	 * @param row The row number (0-8).
	 * @param colSeparator The separator for columns in the row.
	 * @returns A string representation of the row with the specified column separator.
	 */
	joinRow(row: number, colSeparator: string): string
	/**
	 * Map the values of cells in a specific box using a provided mapping function.
	 * @param box The box number (0-8).
	 * @param fn The mapping function.
	 * @returns A new grid with the mapped values in the specified box.
	 */
	mapBox<U>(box: number, fn: CBFn<T, U>): IGrid<T | U>
	/**
	 * Map the values of cells in a specific column using a provided mapping function.
	 * @param col The column number (0-8).
	 * @param fn The mapping function.
	 * @returns A new grid with the mapped values in the specified column.
	 */
	mapCol<U>(col: number, fn: CBFn<T, U>): IGrid<T | U>
	/**
	 * Separate cells based on a filter function and apply a transformation to them.
	 * @param filter The filter function to separate cells.
	 * @param map The transformation function to apply to separated cells.
	 * @returns A new grid with the transformed values based on the filter.
	 */
	mapFiltered<U, S extends T>(filter: (cell: T, pos: Position) => cell is S, map: CBFn<S, U>): IGrid<T | U>
	/**
	 * Map the values of cells in the entire grid using a provided mapping function.
	 * @param fn The mapping function.
	 * @returns A new grid with the mapped values in the entire grid.
	 */
	mapGrid<U>(fn: CBFn<T, U>): IGrid<U>
	/**
	 * Map the values of cells related to a specified cell position using a provided mapping function.
	 * @param cellPos The position of the cell to map from.
	 * @param fn The mapping function.
	 * @returns A new grid with the mapped values related to the specified cell.
	 */
	mapRelated<U>(cellPos: Position, fn: CBFn<T, U>): IGrid<T | U>
	/**
	 * Map the values of cells in a specific col using a provided mapping function.
	 * @param row The col number (0-8).
	 * @param fn The mapping function.
	 * @returns A new grid with the mapped values in the specified row.
	 */
	mapRow<U>(row: number, fn: CBFn<T, U>): IGrid<T | U>
	/**
	 * Check if a given function returns true for at least one cell in a specific box.
	 * @param box The box number (0-8).
	 * @param fn The function to check against each cell in the box.
	 * @returns True if the function returns true for at least one cell in the specified box, false otherwise.
	 */
	someBox(box: number, fn: CBFn<T, boolean>): boolean
	/**
	 * Check if a given function returns true for at least one cell in a specific column.
	 * @param col The column number (0-8).
	 * @param fn The function to check against each cell in the column.
	 * @returns True if the function returns true for at least one cell in the specified column, false otherwise.
	 */
	someCol(col: number, fn: CBFn<T, boolean>): boolean
	/**
	 * Check if a given function returns true for at least one cell in the entire grid.
	 * @param fn The function to check against each cell in the grid.
	 * @returns True if the function returns true for at least one cell in the entire grid, false otherwise.
	 */
	someGrid(fn: CBFn<T, boolean>): boolean
	/**
	 * Check if a given function returns true for at least one cell in a specific row.
	 * @param row The row number (0-8).
	 * @param fn The function to check against each cell in the row.
	 * @returns True if the function returns true for at least one cell in the specified row, false otherwise.
	 */
	someRow(row: number, fn: CBFn<T, boolean>): boolean
}
