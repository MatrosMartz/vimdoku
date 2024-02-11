import { IDLE_POS, Pos, type PosData } from '~/share/domain/entities'
import type { Tuple } from '~/share/types'
import { iterateArray, keysBy, noop } from '~/share/utils'

export type GridData<T> = Tuple<Tuple<T, 9>, 9>

export type MapperMoveType = 'cell' | 'reg' | 'col' | 'row' | 'related'

export interface MapperMove<T> {
	type: MapperMoveType
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

class GridEvery<T> {
	readonly #data

	constructor(data: GridData<T>) {
		this.#data = data
	}

	/**
	 * Check if a given function returns true for all cells in a specific column.
	 * @param col The column number (0-8).
	 * @param fn The function to check against each cell in the col.
	 * @returns True if the function returns true for all cells in the specified column, false otherwise.
	 */
	col(col: number, fn: (cell: T, pos: Pos) => boolean) {
		for (const y of iterateArray(9)) if (!fn(this.#data[y][col], new Pos({ y, x: col }))) return false
		return true
	}

	/**
	 * Check if a given function returns true for all cells in the entire grid.
	 * @param fn The function to check against each cell in the grid.
	 * @returns True if the function returns true for all cells in the grid, false otherwise.
	 */
	grid(fn: (cell: T, pos: Pos) => boolean) {
		return this.#data.every((row, y) => row.every((cell, x) => fn(cell, new Pos({ y, x }))))
	}

	/**
	 * Check if a given function returns true for all cells in a specific box.
	 * @param reg The box number (0-8).
	 * @param fn The function to check against each cell in the box.
	 * @returns True if the function returns true for all cells in the specified box, false otherwise.
	 */
	reg(reg: number, fn: (cell: T, pos: Pos) => boolean): boolean {
		const boxPos = Pos.fromReg(reg)
		for (const pos of Pos.iterateMatrix(3)) {
			const currPos = boxPos.sum(pos)
			if (!fn(this.#data[currPos.y][currPos.x], currPos)) return false
		}

		return true
	}

	/**
	 * Check if a given function returns true for all cells in a specific row.
	 * @param row The row number (0-8).
	 * @param fn The function to check against each cell in the row.
	 * @returns True if the function returns true for all cells in the specified row, false otherwise.
	 */
	row(row: number, fn: (cell: T, pos: Pos) => boolean) {
		return this.#data[row].every((cell, x) => fn(cell, new Pos({ y: row, x })))
	}
}

class GridComparer<T> {
	readonly #data
	readonly #origin

	constructor(data: GridData<T>, origin: Pos) {
		this.#data = data
		this.#origin = origin
	}

	/**
	 * Compare a function with cells in the same column of the specified cell.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all cells in the same column, false otherwise.
	 */
	withCol(fn: (origin: T, curr: T, currPos: Pos) => boolean) {
		const { x } = this.#origin
		for (const y of iterateArray(9)) {
			const pos = new Pos({ x, y })
			if (!pos.equalsRow(this.#origin) && !fn(this.#cellBy(this.#origin), this.#cellBy(pos), pos)) return false
		}
		return true
	}

	/**
	 * Compare a function with cells in the same column of the specified cell.
	 * @param otherPos The other position.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all cells in the same column, false otherwise.
	 */
	withOther(otherPos: Pos, fn: (origin: T, other: T) => boolean) {
		return fn(this.#cellBy(this.#origin), this.#cellBy(otherPos))
	}

	/**
	 * Compare a function with cells in the same box of the specified cell.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all cells in the same box, false otherwise.
	 */
	withReg(fn: (origin: T, curr: T, currPos: Pos) => boolean) {
		const reg = this.#origin.initReg
		for (const pos of Pos.iterateMatrix(3)) {
			const currPos = pos.sum(reg)
			if (!currPos.equalsPos(this.#origin) && !fn(this.#cellBy(this.#origin), this.#cellBy(currPos), currPos))
				return false
		}

		return true
	}

	/**
	 * Compare a function with related cells in the same row, column, and box of the specified cell.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all related cells, false otherwise.
	 */
	withRelated(fn: (origin: T, curr: T, currPos: Pos) => boolean) {
		for (const currPos of Pos.iterateMatrix(9)) {
			if (
				!currPos.equalsPos(this.#origin) &&
				currPos.areRelated(this.#origin) &&
				!fn(this.#cellBy(this.#origin), this.#cellBy(currPos), currPos)
			)
				return false
		}

		return true
	}

	/**
	 * Compare a function with cells in the same row of the specified cell.
	 * @param fn The comparison function.
	 * @returns True if the comparison function returns true for all cells in the same row, false otherwise.
	 */
	withRow(fn: (origin: T, curr: T, currPos: Pos) => boolean) {
		const { y } = this.#origin
		for (const x of iterateArray(9)) {
			const pos = new Pos({ y, x })
			if (!pos.equalsCol(this.#origin) && !fn(this.#cellBy(this.#origin), this.#cellBy(pos), pos)) return false
		}
		return true
	}

	#cellBy(pos: Pos) {
		return this.#data[pos.y][pos.x]
	}
}

export interface MapperProp<T> {
	/**
	 * Add a move.
	 * @param fn The mapping function that the move will have.
	 * @returns New `GridMapper` with the move.
	 */
	<U>(fn: (cell: T, pos: Pos) => T | U): GridMapper<T | U>
	/**
	 * Add a move if the condition is true.
	 * @param condition The condition
	 * @param fn The mapping function that the move will have.
	 * @returns New `GridMapper` with the move if condition is true.
	 */
	onlyIf<U>(condition: boolean, fn: (cell: T, pos: Pos) => T | U): GridMapper<T | U>
}

export interface MapperPropWithoutOrigin<T> extends MapperProp<T> {
	/** Add a move not applicable to the origin. */
	withoutOrigin: MapperProp<T>
}

/**
 * Create a GridMapper property.
 * @param mapper The mapper to be added.
 * @param type The type of property.
 * @param withOrigin If it will affect the origin as well.
 * @returns The GridMapper property.
 */
function createMapperProp<T>(mapper: GridMapper<T>, type: MapperMoveType, withOrigin: boolean) {
	const prop: MapperProp<T> = <U>(fn: (cell: T, pos: Pos) => T | U) =>
		GridMapper.addMove(mapper, { fn, type, withOrigin })

	prop.onlyIf = <U>(condition: boolean, fn: (cell: T, pos: Pos) => T | U) => (condition ? prop(fn) : mapper)

	return prop
}

/**
 * Create a GridMapper property with "withoutOrigin" function.
 * @param mapper The mapper to be added.
 * @param type The type of the property.
 * @returns The GridMapper property with "withoutOrigin" function.
 */
function createMapperPropWithoutOrigin<T>(mapper: GridMapper<T>, type: Exclude<MapperMoveType, 'cell'>) {
	const prop = createMapperProp(mapper, type, true) as MapperPropWithoutOrigin<T>

	prop.withoutOrigin = createMapperProp(mapper, type, false)

	return prop
}

class GridMapper<T> {
	/** Add a move to be applied only the origin. */
	readonly cell = createMapperProp(this, 'cell', true)
	/** Add a move to be applied to the origin column. */
	readonly col = createMapperPropWithoutOrigin(this, 'col')
	/** Add a move to be applied to the origin region. */
	readonly reg = createMapperPropWithoutOrigin(this, 'reg')
	/** Add a move to be applied to the cells that are in the same column, region or row. */
	readonly related = createMapperPropWithoutOrigin(this, 'related')
	/** Add a move to be applied to the origin row. */
	readonly row = createMapperPropWithoutOrigin(this, 'row')

	readonly #data
	readonly #gridMoves
	readonly #origin

	/**
	 * Creates an instance of the GridSvc class with the provided data.
	 * @param data A two-dimensional array representing the Sudoku grid.
	 * @param origin The origin of the changes.
	 * @param gridMoves The initials grid moves.
	 */
	constructor(data: GridData<T>, origin: Pos, gridMoves: Array<MapperMove<T>> = []) {
		this.#data = data
		this.#origin = origin
		this.#gridMoves = gridMoves
	}

	static addMove<T>(mapper: GridMapper<T>, move: MapperMove<T>) {
		return new GridMapper(mapper.#data, mapper.#origin, [...mapper.#gridMoves, move])
	}

	/**
	 * Applies the all moves.
	 * @param effect Function to be executed for each move.
	 * @returns The updated Grid.
	 */
	apply(effect: (cell: { next: T; prev: T }, pos: Pos) => void = noop) {
		const data = Pos.createMatrix(9, (pos): T => {
			let cell = this.#cellBy(pos)
			for (const { type, fn, withOrigin } of this.#gridMoves) {
				const isOrigin = pos.equalsPos(this.#origin)
				const equalPos = type === 'cell' && isOrigin
				const equalCol = type === 'col' && pos.equalsCol(this.#origin)
				const equalRow = type === 'row' && pos.equalsRow(this.#origin)
				const equalReg = type === 'reg' && pos.equalsReg(this.#origin)
				const areRelated = type === 'related' && pos.areRelated(this.#origin)

				if ((withOrigin || !isOrigin) && (equalPos || equalReg || equalCol || equalRow || areRelated)) {
					const next = fn(cell, pos)
					effect({ next, prev: cell }, pos)
					cell = next
				}
			}
			return cell
		})

		return new Grid(data)
	}

	#cellBy(pos: Pos) {
		return this.#data[pos.y][pos.x]
	}
}

class GridJoiner<T> {
	readonly #data

	constructor(data: GridData<T>) {
		this.#data = data
	}

	/**
	 * Join the values of cells in the entire grid into a string using specified separators.
	 * @param separators Separators for columns and rows in the grid.
	 * @returns A string representation of the entire grid with the specified separators.
	 */
	all(separators: { col?: string | undefined; row?: string | undefined }): string
	all({ col = ',', row = '\n' }: { col?: string | undefined; row?: string | undefined }) {
		return this.#data.map(Row => Row.join(col)).join(row)
	}

	/**
	 * Join the values of cells in a specific column into a string using a specified row separator.
	 * @param col The column number (0-8).
	 * @param separator The separator for rows in the column.
	 * @returns A string representation of the column with the specified row separator.
	 */
	col(col: number, separator: string) {
		let str = ''

		for (const y of iterateArray(9))
			if (y === 0) str += this.#data[y][col]
			else str += separator + this.#data[y][col]

		return str
	}

	/**
	 * Join the values of cells in a specific box into a string using specified separators.
	 * @param reg The box number (0-8).
	 * @param separators Separators for columns and rows in the box.
	 * @returns A string representation of the box with the specified separators.
	 */
	reg(reg: number, separators: { col?: string | undefined; row?: string | undefined }): string
	reg(reg: number, { col = ',', row = '\n' }: { col?: string | undefined; row?: string | undefined }) {
		let str = ''
		const regPos = Pos.fromReg(reg)
		for (const pos of Pos.iterateMatrix(3)) {
			const { y, x } = pos.sum(regPos)
			if (pos.equalsPos(IDLE_POS)) str += this.#data[y][x]
			else if (pos.equalsCol(IDLE_POS)) str += col + this.#data[y][x]
			else str += row + this.#data[y][x]
		}

		return str
	}

	/**
	 * Join the values of cells in a specific row into a string using a specified column separator.
	 * @param row The row number (0-8).
	 * @param separator The separator for columns in the row.
	 * @returns A string representation of the row with the specified column separator.
	 */
	row(row: number, separator: string) {
		return this.#data[row].join(separator)
	}
}

class GridSome<T> {
	readonly #data

	constructor(data: GridData<T>) {
		this.#data = data
	}

	/**
	 * Check if a given function returns true for at least one cell in a specific column.
	 * @param col The column number (0-8).
	 * @param fn The function to check against each cell in the column.
	 * @returns True if the function returns true for at least one cell in the specified column, false otherwise.
	 */
	col(col: number, fn: (cell: T, pos: Pos) => boolean) {
		for (const y of iterateArray(9)) if (fn(this.#data[y][col], new Pos({ y, x: col }))) return true
		return false
	}

	/**
	 * Check if a given function returns true for at least one cell in the entire grid.
	 * @param fn The function to check against each cell in the grid.
	 * @returns True if the function returns true for at least one cell in the entire grid, false otherwise.
	 */
	grid(fn: (cell: T, pos: Pos) => boolean) {
		return this.#data.some((row, y) => row.some((cell, x) => fn(cell, new Pos({ y, x }))))
	}

	/**
	 * Check if a given function returns true for at least one cell in a specific box.
	 * @param reg The box number (0-8).
	 * @param fn The function to check against each cell in the box.
	 * @returns True if the function returns true for at least one cell in the specified box, false otherwise.
	 */
	reg(reg: number, fn: (cell: T, pos: Pos) => boolean) {
		const boxPos = Pos.fromReg(reg)
		for (const pos of Pos.iterateMatrix(3)) {
			const currPos = pos.sum(boxPos)
			if (fn(this.#data[currPos.y][currPos.x], currPos)) return true
		}

		return false
	}

	/**
	 * Check if a given function returns true for at least one cell in a specific row.
	 * @param row The row number (0-8).
	 * @param fn The function to check against each cell in the row.
	 * @returns True if the function returns true for at least one cell in the specified row, false otherwise.
	 */
	row(row: number, fn: (cell: T, pos: Pos) => boolean) {
		return this.#data[row].some((cell, x) => fn(cell, new Pos({ y: row, x })))
	}
}

export class Grid<T> {
	/** Get the `GridEvery` */
	readonly every: GridEvery<T>
	/** Get the `GridJoiner`. */
	readonly join: GridJoiner<T>
	/** Get the `GridSome` */
	readonly some: GridSome<T>
	readonly #data

	/**
	 * Creates an instance of the GridSvc class with the provided data.
	 * @param data A two-dimensional array representing the Sudoku grid.
	 */
	constructor(data: GridData<T>) {
		this.#data = this.#internalMap(data, cell => cell)
		this.every = new GridEvery(this.#data)
		this.join = new GridJoiner(this.#data)
		this.some = new GridSome(this.#data)
	}

	get data() {
		return this.#data
	}

	/**
	 * Creates an instance of the GridSvc with map function.
	 * @param fn A mapping function to call on every element of the array.
	 * @returns A new Grid.
	 */
	static create<T>(fn: (pos: Pos) => T) {
		return new Grid(Pos.createMatrix(9, fn))
	}

	/**
	 * Get the value of a cell at the specified position.
	 * @param position The position of the cell to retrieve.
	 * @returns The value of the cell.
	 */
	cellBy(position: PosData) {
		return this.#data[position.y][position.x]
	}

	/**
	 * creates a `GridComparer` with the position set as origin.
	 * @param origin The position of origin.
	 * @returns The `GridComparer` created.
	 */
	compare(origin: Pos) {
		return new GridComparer(this.#data, origin)
	}

	/**
	 * Return a copy of grid.
	 * @returns A new grid with the same data.
	 */
	copy() {
		return new Grid(this.data)
	}

	/**
	 * Counts the cells that meet the condition.
	 * @param fn The function that holds the condition.
	 * @returns The number of cells that meet the condition.
	 */
	count(fn: (cell: T, pos: Pos) => boolean) {
		let asserts = 0
		for (const pos of Pos.iterateMatrix(9)) if (fn(this.cellBy(pos), pos)) asserts++

		return asserts
	}

	/**
	 * Group and transform subgrids using the provided function.
	 * @param fn The transformation function to apply to subgrids.
	 * @returns An object containing subgrids with the transformed values.
	 */
	createSubgrids<U extends Record<string, unknown>>(fn: (cell: T, pos: Pos) => U) {
		const newGrid = {} as {
			[K in keyof U]: Grid<U[K]>
		}

		for (const pos of Pos.iterateMatrix(9)) {
			const result = fn(this.cellBy(pos), pos)

			for (const key of keysBy(result)) {
				if (!(key in newGrid)) newGrid[key] = new Grid(Pos.createMatrix(9, () => null as U[keyof U]))
				newGrid[key].#mutateCell(pos, result[key])
			}
		}

		return newGrid
	}

	/**
	 * Map the values of cells in the entire grid using a provided mapping function.
	 * @param fn The mapping function.
	 * @returns A new grid with the mapped values in the entire grid.
	 */
	mapAll<U>(fn: (cell: T, pos: Pos) => U) {
		return new Grid(this.#internalMap(this.#data, fn))
	}

	/**
	 * creates a `GridMapper` with the position set as origin.
	 * @param origin The position of origin.
	 * @returns The `GridMapper` created.
	 */
	mapBy(origin: PosData) {
		return new GridMapper(this.data, new Pos(origin))
	}

	#internalMap<I, U>(data: GridData<I>, fn: (cell: I, pos: Pos) => U) {
		return data.map((row, y) => row.map((cell, x) => fn(cell, new Pos({ y, x })))) as GridData<U>
	}

	/**
	 * Change the content of the specific cell.
	 * @param pos Position of cell to be mutate.
	 * @param newCell The new Cell content.
	 */
	#mutateCell(pos: Pos, newCell: T): void
	#mutateCell({ y, x }: Pos, newCell: T) {
		this.#data[y][x] = newCell
	}
}
