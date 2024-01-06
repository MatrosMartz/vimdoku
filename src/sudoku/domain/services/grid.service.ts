import { IDLE_POS, type Pos } from '~/share/domain/models'
import { Entity, PosSvc } from '~/share/domain/services'
import { createMatrix, iterateArray, iterateMatrix, noop } from '~/share/utils'

import { type Grid, type GridMapper, type GridMethods, type IGrid } from '../models'

class GridEverySvc<T> implements GridMethods.IEvery<T> {
	readonly #data

	constructor(data: Grid<T>) {
		this.#data = data
	}

	col(col: number, fn: (cell: T, pos: Pos) => boolean) {
		for (const y of iterateArray(9)) if (!fn(this.#data[y][col], { y, x: col })) return false
		return true
	}

	grid(fn: (cell: T, pos: Pos) => boolean) {
		return this.#data.every((row, y) => row.every((cell, x) => fn(cell, { y, x })))
	}

	reg(reg: number, fn: (cell: T, pos: Pos) => boolean): boolean {
		const boxPos = PosSvc.getPosFromReg(reg)
		for (const pos of iterateMatrix(3)) {
			const { y, x } = PosSvc.sumPos(boxPos, pos)
			if (!fn(this.#data[y][x], { y, x })) return false
		}

		return true
	}

	row(row: number, fn: (cell: T, pos: Pos) => boolean) {
		return this.#data[row].every((cell, x) => fn(cell, { y: row, x }))
	}
}

class GridComparerSvc<T> implements GridMethods.IComparer<T> {
	readonly #data
	readonly #origin

	constructor(data: Grid<T>, origin: Pos) {
		this.#data = data
		this.#origin = origin
	}

	withCol(fn: (origin: T, curr: T, currPos: Pos) => boolean) {
		const { x } = this.#origin
		for (const y of iterateArray(9)) {
			const pos = { x, y }
			if (!PosSvc.equalsRow(pos, this.#origin) && !fn(this.#cellBy(this.#origin), this.#cellBy(pos), pos)) return false
		}
		return true
	}

	withOther(otherPos: Pos, fn: (origin: T, other: T) => boolean) {
		return fn(this.#cellBy(this.#origin), this.#cellBy(otherPos))
	}

	withReg(fn: (origin: T, curr: T, currPos: Pos) => boolean) {
		const reg = PosSvc.getInitsReg(this.#origin)
		for (const pos of iterateMatrix(3)) {
			const currPos = PosSvc.sumPos(pos, reg)
			if (!PosSvc.equalsPos(this.#origin, currPos) && !fn(this.#cellBy(this.#origin), this.#cellBy(currPos), currPos))
				return false
		}

		return true
	}

	withRelated(fn: (origin: T, curr: T, currPos: Pos) => boolean) {
		for (const currPos of iterateMatrix(9)) {
			if (
				!PosSvc.equalsPos(this.#origin, currPos) &&
				PosSvc.areRelated(this.#origin, currPos) &&
				!fn(this.#cellBy(this.#origin), this.#cellBy(currPos), currPos)
			)
				return false
		}

		return true
	}

	withRow(fn: (origin: T, curr: T, currPos: Pos) => boolean) {
		const { y } = this.#origin
		for (const x of iterateArray(9)) {
			const pos = { y, x }
			if (!PosSvc.equalsCol(pos, this.#origin) && !fn(this.#cellBy(this.#origin), this.#cellBy(pos), pos)) return false
		}
		return true
	}

	#cellBy(pos: Pos) {
		return this.#data[pos.y][pos.x]
	}
}

function createMapperProp<T>(mapper: GridMapperSvc<T>, type: GridMapper.Type, withOrigin: boolean) {
	const prop: GridMapper.Prop<T> = <U>(fn: (cell: T, pos: Pos) => T | U) =>
		GridMapperSvc.addMove(mapper, { fn, type, withOrigin })

	prop.onlyIf = <U>(condition: boolean, fn: (cell: T, pos: Pos) => T | U) => (condition ? prop(fn) : mapper)

	return prop
}

function createMapperPropWithoutOrigin<T>(mapper: GridMapperSvc<T>, type: Exclude<GridMapper.Type, 'cell'>) {
	const prop = createMapperProp(mapper, type, true) as GridMapper.PropWithoutOrigin<T>

	prop.withoutOrigin = createMapperProp(mapper, type, false)

	return prop
}

class GridMapperSvc<T> implements GridMethods.IMapper<T> {
	readonly cell = createMapperProp(this, 'cell', true)
	readonly col = createMapperPropWithoutOrigin(this, 'col')
	readonly reg = createMapperPropWithoutOrigin(this, 'reg')
	readonly related = createMapperPropWithoutOrigin(this, 'related')
	readonly row = createMapperPropWithoutOrigin(this, 'row')

	readonly #data
	readonly #gridMoves
	readonly #origin

	/**
	 * Creates an instance of the GridSvc class with the provided data.
	 * @param data A two-dimensional array representing the Sudoku grid.
	 */
	constructor(data: Grid<T>, origin: Pos, gridMoves: Array<GridMapper.Move<T>> = []) {
		this.#data = data
		this.#origin = origin
		this.#gridMoves = gridMoves
	}

	static addMove<T>(mapper: GridMapperSvc<T>, move: GridMapper.Move<T>) {
		return new GridMapperSvc(mapper.#data, mapper.#origin, [...mapper.#gridMoves, move])
	}

	apply(effect: (cell: T, pos: Pos) => void = noop) {
		const data = createMatrix(9, (pos): T => {
			let cell = this.#cellBy(pos)
			for (const { type, fn, withOrigin } of this.#gridMoves) {
				const isOrigin = PosSvc.equalsPos(pos, this.#origin)
				const equalPos = type === 'cell' && isOrigin
				const equalCol = type === 'col' && PosSvc.equalsCol(pos, this.#origin)
				const equalRow = type === 'row' && PosSvc.equalsRow(pos, this.#origin)
				const equalReg = type === 'reg' && PosSvc.equalsReg(pos, this.#origin)
				const areRelated = type === 'related' && PosSvc.areRelated(pos, this.#origin)

				if ((withOrigin || !isOrigin) && (equalPos || equalReg || equalCol || equalRow || areRelated)) {
					const newCell = fn(cell, pos)
					if (!(cell instanceof Entity && newCell instanceof Entity) || cell.id !== newCell.id) effect(cell, pos)
					cell = newCell
				}
			}
			return cell
		})

		return new GridSvc(data)
	}

	#cellBy(pos: Pos) {
		return this.#data[pos.y][pos.x]
	}
}

class GridJoinerSvc<T> implements GridMethods.IJoiner {
	readonly #data

	constructor(data: Grid<T>) {
		this.#data = data
	}

	all(separators: { col?: string | undefined; row?: string | undefined }): string
	all({ col = ',', row = '\n' }: { col?: string | undefined; row?: string | undefined }) {
		return this.#data.map(Row => Row.join(col)).join(row)
	}

	col(col: number, rowSeparator: string) {
		let str = ''

		for (const y of iterateArray(9))
			if (y === 0) str += this.#data[y][col]
			else str += rowSeparator + this.#data[y][col]

		return str
	}

	reg(reg: number, separators: { col?: string | undefined; row?: string | undefined }): string
	reg(reg: number, { col = ',', row = '\n' }: { col?: string | undefined; row?: string | undefined }) {
		let str = ''
		const regPos = PosSvc.getPosFromReg(reg)
		for (const pos of iterateMatrix(3)) {
			const { y, x } = PosSvc.sumPos(pos, regPos)
			if (PosSvc.equalsPos(pos, IDLE_POS)) str += this.#data[y][x]
			else if (PosSvc.equalsCol(pos, IDLE_POS)) str += col + this.#data[y][x]
			else str += row + this.#data[y][x]
		}

		return str
	}

	row(row: number, colSeparator: string) {
		return this.#data[row].join(colSeparator)
	}
}

class GridSomeSvc<T> implements GridMethods.ISome<T> {
	readonly #data

	constructor(data: Grid<T>) {
		this.#data = data
	}

	col(col: number, fn: (cell: T, pos: Pos) => boolean) {
		for (const y of iterateArray(9)) if (fn(this.#data[y][col], { y, x: col })) return true
		return false
	}

	grid(fn: (cell: T, pos: Pos) => boolean) {
		return this.#data.some((row, y) => row.some((cell, x) => fn(cell, { y, x })))
	}

	reg(reg: number, fn: (cell: T, pos: Pos) => boolean) {
		const boxPos = PosSvc.getPosFromReg(reg)
		for (const pos of iterateMatrix(3)) {
			const { y, x } = PosSvc.sumPos(boxPos, pos)
			if (fn(this.#data[y][x], { y, x })) return true
		}

		return false
	}

	row(row: number, fn: (cell: T, pos: Pos) => boolean) {
		return this.#data[row].some((cell, x) => fn(cell, { y: row, x }))
	}
}

export class GridSvc<T> implements IGrid<T> {
	readonly every: GridEverySvc<T>
	readonly join: GridJoinerSvc<T>
	readonly some: GridSomeSvc<T>
	readonly #data

	/**
	 * Creates an instance of the GridSvc class with the provided data.
	 * @param data A two-dimensional array representing the Sudoku grid.
	 */
	constructor(data: Grid<T>) {
		this.#data = this.#internalMap(data, cell => cell)
		this.every = new GridEverySvc(this.#data)
		this.join = new GridJoinerSvc(this.#data)
		this.some = new GridSomeSvc(this.#data)
	}

	get data() {
		return this.#data
	}

	/**
	 * Creates an instance of the GridSvc with map function.
	 * @param mapFn A mapping function to call on every element of the array.
	 */
	static create<T>(fn: (pos: Pos) => T) {
		return new GridSvc(createMatrix(9, fn))
	}

	cellBy(pos: Pos) {
		return this.#data[pos.y][pos.x]
	}

	compare(origin: Pos) {
		return new GridComparerSvc(this.#data, origin)
	}

	copy() {
		return new GridSvc(this.data)
	}

	count(fn: (cell: T, pos: Pos) => boolean) {
		let asserts = 0
		for (const pos of iterateMatrix(9)) if (fn(this.cellBy(pos), pos)) asserts++

		return asserts
	}

	createSubgrids<U>(fn: (cell: T, pos: Pos) => U) {
		const newGrid = {} as {
			[K in keyof U]: GridSvc<U[K]>
		}

		for (const pos of iterateMatrix(9)) {
			const result = fn(this.cellBy(pos), pos)

			for (const key of Object.keys(result)) {
				if (!(key in newGrid)) newGrid[key] = new GridSvc(createMatrix(9, () => null as U[keyof U]))
				newGrid[key].#mutateCell(pos, result[key])
			}
		}

		return newGrid
	}

	mapAll<U>(fn: (cell: T, pos: Pos) => U) {
		return new GridSvc(this.#internalMap(this.#data, fn))
	}

	mapBy(origin: Pos) {
		return new GridMapperSvc(this.data, origin)
	}

	#internalMap<I, U>(data: Grid<I>, fn: (cell: I, pos: Pos) => U) {
		return data.map((row, y) => row.map((cell, x) => fn(cell, { y, x }))) as Grid<U>
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
