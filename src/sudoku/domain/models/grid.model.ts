import type { Pos } from '~/share/domain/models'
import type { Tuple } from '~/share/types'

export type SubGrids<U> = {
	[K in keyof U]: IGrid<U[K]>
}

export type Grid<T> = Tuple<Tuple<T, 9>, 9>

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GridMapper {
	export type Type = 'cell' | 'reg' | 'col' | 'row' | 'related'

	export interface Move<T> {
		type: Type
		/** Whether it should also apply to the origin.  */
		withOrigin: boolean
		/**
		 * Mapping function.
		 * @param cell The previous cell.
		 * @param pos Cell position.
		 * @returns The new cell.
		 */
		fn(cell: T, pos: Pos): T
	}

	export interface Prop<T> {
		/**
		 * Add a move.
		 * @param fn The mapping function that the move will have.
		 * @returns New `GridMapper` with the move.
		 */
		<U>(fn: (cell: T, pos: Pos) => T | U): GridMethods.IMapper<T | U>
		/**
		 * Add a move if the condition is true.
		 * @param condition The condition
		 * @param fn The mapping function that the move will have.
		 * @returns New `GridMapper` with the move if condition is true.
		 */
		onlyIf<U>(condition: boolean, fn: (cell: T, pos: Pos) => T | U): GridMethods.IMapper<T | U>
	}

	export interface PropWithoutOrigin<T> extends Prop<T> {
		/** Add a move not applicable to the origin. */
		withoutOrigin: Prop<T>
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GridMethods {
	export interface IEvery<T> {
		/**
		 * Check if a given function returns true for all cells in a specific column.
		 * @param col The column number (0-8).
		 * @param fn The function to check against each cell in the col.
		 * @returns True if the function returns true for all cells in the specified column, false otherwise.
		 */
		col(col: number, fn: (cell: T, pos: Pos) => boolean): boolean
		/**
		 * Check if a given function returns true for all cells in the entire grid.
		 * @param fn The function to check against each cell in the grid.
		 * @returns True if the function returns true for all cells in the grid, false otherwise.
		 */
		grid(fn: (cell: T, pos: Pos) => boolean): boolean
		/**
		 * Check if a given function returns true for all cells in a specific box.
		 * @param reg The box number (0-8).
		 * @param fn The function to check against each cell in the box.
		 * @returns True if the function returns true for all cells in the specified box, false otherwise.
		 */
		reg(reg: number, fn: (cell: T, pos: Pos) => boolean): boolean
		/**
		 * Check if a given function returns true for all cells in a specific row.
		 * @param row The row number (0-8).
		 * @param fn The function to check against each cell in the row.
		 * @returns True if the function returns true for all cells in the specified row, false otherwise.
		 */
		row(row: number, fn: (cell: T, pos: Pos) => boolean): boolean
	}

	export interface IComparer<T> {
		/**
		 * Compare a function with cells in the same column of the specified cell.
		 * @param fn The comparison function.
		 * @returns True if the comparison function returns true for all cells in the same column, false otherwise.
		 */
		withCol(fn: (origin: T, curr: T, currPos: Pos) => boolean): boolean
		/**
		 * Compare a function with cells in the same column of the specified cell.
		 * @param fn The comparison function.
		 * @returns True if the comparison function returns true for all cells in the same column, false otherwise.
		 */
		withOther(otherPos: Pos, fn: (origin: T, other: T) => boolean): boolean
		/**
		 * Compare a function with cells in the same box of the specified cell.
		 * @param fn The comparison function.
		 * @returns True if the comparison function returns true for all cells in the same box, false otherwise.
		 */
		withReg(fn: (origin: T, curr: T, currPos: Pos) => boolean): boolean
		/**
		 * Compare a function with related cells in the same row, column, and box of the specified cell.
		 * @param fn The comparison function.
		 * @returns True if the comparison function returns true for all related cells, false otherwise.
		 */
		withRelated(fn: (origin: T, curr: T, currPos: Pos) => boolean): boolean
		/**
		 * Compare a function with cells in the same row of the specified cell.
		 * @param fn The comparison function.
		 * @returns True if the comparison function returns true for all cells in the same row, false otherwise.
		 */
		withRow(fn: (origin: T, curr: T, currPos: Pos) => boolean): boolean
	}

	export interface IMapper<T> {
		/** Add a move to be applied only the origin. */
		cell: GridMapper.Prop<T>
		/** Add a move to be applied to the origin column. */
		col: GridMapper.PropWithoutOrigin<T>
		/** Add a move to be applied to the origin region. */
		reg: GridMapper.PropWithoutOrigin<T>
		/** Add a move to be applied to the cells that are in the same column, region or row. */
		related: GridMapper.PropWithoutOrigin<T>
		/** Add a move to be applied to the origin row. */
		row: GridMapper.PropWithoutOrigin<T>
		/**
		 * Applies the all moves.
		 * @param effect Function to be executed for each move.
		 */
		apply(effect?: (cell: { next: T; prev: T }, pos: Pos) => void): IGrid<T>
	}

	export interface IJoiner {
		/**
		 * Join the values of cells in the entire grid into a string using specified separators.
		 * @param separators Separators for columns and rows in the grid.
		 * @returns A string representation of the entire grid with the specified separators.
		 */
		all(separators: { col?: string; row?: string }): string
		/**
		 * Join the values of cells in a specific column into a string using a specified row separator.
		 * @param col The column number (0-8).
		 * @param separator The separator for rows in the column.
		 * @returns A string representation of the column with the specified row separator.
		 */
		col(col: number, separator: string): string
		/**
		 * Join the values of cells in a specific box into a string using specified separators.
		 * @param reg The box number (0-8).
		 * @param separators Separators for columns and rows in the box.
		 * @returns A string representation of the box with the specified separators.
		 */
		reg(reg: number, separators: { col?: string; row?: string }): string
		/**
		 * Join the values of cells in a specific row into a string using a specified column separator.
		 * @param row The row number (0-8).
		 * @param separator The separator for columns in the row.
		 * @returns A string representation of the row with the specified column separator.
		 */
		row(row: number, separator: string): string
	}

	export interface ISome<T> {
		/**
		 * Check if a given function returns true for at least one cell in a specific column.
		 * @param col The column number (0-8).
		 * @param fn The function to check against each cell in the column.
		 * @returns True if the function returns true for at least one cell in the specified column, false otherwise.
		 */
		col(col: number, fn: (cell: T, pos: Pos) => boolean): boolean
		/**
		 * Check if a given function returns true for at least one cell in the entire grid.
		 * @param fn The function to check against each cell in the grid.
		 * @returns True if the function returns true for at least one cell in the entire grid, false otherwise.
		 */
		grid(fn: (cell: T, pos: Pos) => boolean): boolean
		/**
		 * Check if a given function returns true for at least one cell in a specific box.
		 * @param reg The box number (0-8).
		 * @param fn The function to check against each cell in the box.
		 * @returns True if the function returns true for at least one cell in the specified box, false otherwise.
		 */
		reg(reg: number, fn: (cell: T, pos: Pos) => boolean): boolean
		/**
		 * Check if a given function returns true for at least one cell in a specific row.
		 * @param row The row number (0-8).
		 * @param fn The function to check against each cell in the row.
		 * @returns True if the function returns true for at least one cell in the specified row, false otherwise.
		 */
		row(row: number, fn: (cell: T, pos: Pos) => boolean): boolean
	}
}

export interface IGrid<T> {
	/** Get the data as a two-dimensional array representing the Sudoku grid. */
	readonly data: Grid<T>
	/** Get the `GridEvery` */
	readonly every: GridMethods.IEvery<T>
	/** Get the `GridJoiner`. */
	readonly join: GridMethods.IJoiner
	/** Get the `GridSome` */
	readonly some: GridMethods.ISome<T>
	/**
	 * Get the value of a cell at the specified position.
	 * @param position The position of the cell to retrieve.
	 * @returns The value of the cell.
	 */
	cellBy(pos: Pos): T
	/**
	 * creates a `GridComparer` with the position set as origin.
	 * @param origin The position of origin.
	 * @returns The `GridComparer` created.
	 */
	compare(origin: Pos): GridMethods.IComparer<T>
	/**
	 * Return a copy of grid.
	 * @returns A new grid with the same data.
	 */
	copy(): IGrid<T>
	/**
	 * Counts the cells that meet the condition.
	 * @param fnCond The function that holds the condition.
	 * @returns The number of cells that meet the condition.
	 */
	count(fn: (cell: T, pos: Pos) => boolean): number
	/**
	 * Group and transform subgrids using the provided function.
	 * @param fn The transformation function to apply to subgrids.
	 * @returns An object containing subgrids with the transformed values.
	 */
	createSubgrids<U>(fn: (cell: T, pos: Pos) => U): SubGrids<U>
	/**
	 * Map the values of cells in the entire grid using a provided mapping function.
	 * @param fn The mapping function.
	 * @returns A new grid with the mapped values in the entire grid.
	 */
	mapAll<U>(fn: (cell: T, pos: Pos) => U): IGrid<U>
	/**
	 * creates a `GridMapper` with the position set as origin.
	 * @param origin The position of origin.
	 * @returns The `GridMapper` created.
	 */
	mapBy(origin: Pos): GridMethods.IMapper<T>
}
