import type { Pos } from '~/share/domain/models'
import { PosSvc } from '~/share/domain/services'
import type { Tuple } from '~/share/types'
import { createArray, createMatrix, iterateArray, iterateMatrix } from '~/share/utils'

import { type CBFn, type CompareCBFn, type CreateCBFn, type Grid, type IGrid } from '../models'

/** Represent a Sudoku Grid Service. */
export class GridSvc<T> implements IGrid<T> {
	/** The position of the first cell. */
	static readonly FIRST_POSITION: Pos = { y: 0, x: 0 }
	/** The position of the last cell. */
	static readonly LAST_POSITION: Pos = { y: 8, x: 8 }

	readonly #data

	/**
	 * Creates an instance of the GridSvc class with the provided data.
	 * @param data A two-dimensional array representing the Sudoku grid.
	 * @throws {Error} If the data is invalid (not a 9x9 grid).
	 */
	constructor(data: Grid<T>) {
		this.#data = data
	}

	get data() {
		return this.#mapData(cell => cell)
	}

	/**
	 * Creates an instance of the GridSvc with map function.
	 * @param mapFn A mapping function to call on every element of the array.
	 */
	static create<T>(mapFn: CreateCBFn<T>) {
		return new GridSvc(createMatrix(9, mapFn))
	}

	compareRelated(cellPos: Pos, fn: CompareCBFn<T, boolean>) {
		return this.compareWithBox(cellPos, fn) && this.compareWithCol(cellPos, fn) && this.compareWithRow(cellPos, fn)
	}

	compareWithBox(cellPos: Pos, fn: CompareCBFn<T, boolean>) {
		const box = PosSvc.getInitsBox(cellPos)
		for (const pos of iterateMatrix(3)) {
			const currPos = PosSvc.sumPos(pos, box)
			if (!PosSvc.equalsPos(cellPos, currPos) && !fn(this.getCell(cellPos), this.getCell(currPos), currPos))
				return false
		}

		return true
	}

	compareWithCol(cellPos: Pos, fn: CompareCBFn<T, boolean>) {
		const { x } = cellPos
		for (const y of iterateArray(9))
			if (y !== cellPos.y && !fn(this.getCell(cellPos), this.getCell({ y, x }), { y, x })) return false
		return true
	}

	compareWithRow(cellPos: Pos, fn: CompareCBFn<T, boolean>) {
		const { y } = cellPos
		for (const x of iterateArray(9))
			if (x !== cellPos.x && !fn(this.getCell(cellPos), this.getCell({ y, x }), { y, x })) return false
		return true
	}

	copy() {
		return new GridSvc(this.data)
	}

	editCell<U>(cellPos: Pos, fn: CBFn<T, U>) {
		const newGrid = this.#mapData((cell, pos) =>
			PosSvc.equalsPos(cellPos, pos) ? fn(this.getCell(cellPos), cellPos) : cell
		)

		return new GridSvc(newGrid)
	}

	everyBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = PosSvc.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const currPos = PosSvc.sumPos(boxPos, pos)
			if (!fn(this.getCell(currPos), currPos)) return false
		}

		return true
	}

	everyCol(x: number, fn: CBFn<T, boolean>) {
		for (const y of iterateArray(9)) if (!fn(this.#data[y][x], { y, x })) return false
		return true
	}

	everyGrid(fn: CBFn<T, boolean>) {
		return this.#data.every((row, y) => row.every((cell, x) => fn(cell, { y, x })))
	}

	everyRow(y: number, fn: CBFn<T, boolean>) {
		return this.#data[y].every((cell, x) => fn(cell, { y, x }))
	}

	getCell(pos: Pos): T
	getCell({ y, x }: Pos) {
		return this.#data[y][x]
	}

	groupSubgrids<U>(fn: CBFn<T, U>) {
		const newGrid = {} as {
			[K in keyof U]: GridSvc<U[K]>
		}

		for (const pos of iterateMatrix(9)) {
			const result = fn(this.getCell(pos), pos)

			for (const key of Object.keys(result)) {
				if (!(key in newGrid)) newGrid[key] = new GridSvc(createArray(9, () => Array(9) as Tuple<U[keyof U], 9>))
				newGrid[key].#mutateCell(pos, result[key])
			}
		}

		return newGrid
	}

	joinBox(box: number, separators: { x?: string; y?: string }): string
	joinBox(box: number, { y: rowSep = '', x: colSep = '' }: { x?: string; y?: string }) {
		let str = ''
		const boxPos = PosSvc.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { y, x } = PosSvc.sumPos(pos, boxPos)
			if (pos.y === 0 && pos.x === 0) str += this.#data[y][x]
			else if (pos.x === 0) str += colSep + this.#data[y][x]
			else str += rowSep + this.#data[y][x]
		}

		return str
	}

	joinCol(x: number, rowSeparator: string) {
		let str = ''

		for (const y of iterateArray(9))
			if (y === 0) str += this.#data[y][x]
			else str += rowSeparator + this.#data[y][x]

		return str
	}

	joinGrid(separators: { x?: string; y?: string }): string
	joinGrid({ x = '', y = '' }: { x?: string; y?: string }) {
		return this.#data.map(Row => Row.join(y)).join(x)
	}

	joinRow(rowIndex: number, colSeparator: string) {
		return this.#data[rowIndex].join(colSeparator)
	}

	mapBox<U>(box: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return PosSvc.getBoxFromPos(currPos) === box ? fn(cell, currPos) : cell
		})

		return new GridSvc(newData)
	}

	mapCol<U>(x: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return currPos.x === x ? fn(cell, currPos) : cell
		})
		return new GridSvc(newData)
	}

	mapFiltered<U, S extends T>(filter: (cell: T, pos: Pos) => cell is S, map: CBFn<S, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return filter(cell, currPos) ? map(cell, currPos) : cell
		})

		return new GridSvc(newData)
	}

	mapGrid<U>(fn: CBFn<T, U>) {
		return new GridSvc(this.#mapData(fn))
	}

	mapRelated<U>(cellPos: Pos, fn: CBFn<T, U>) {
		const newData = this.#mapData((cell, currPos) => {
			if (PosSvc.equalsPos(cellPos, currPos)) return cell
			if (PosSvc.areRelated(cellPos, currPos)) return fn(cell, currPos)
			return cell
		})

		return new GridSvc(newData)
	}

	mapRow<U>(y: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return currPos.y === y ? fn(cell, currPos) : cell
		})

		return new GridSvc(newData)
	}

	someBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = PosSvc.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { y, x } = PosSvc.sumPos(boxPos, pos)
			if (fn(this.#data[y][x], { y, x })) return true
		}

		return false
	}

	someCol(x: number, fn: CBFn<T, boolean>) {
		for (const y of iterateArray(9)) if (fn(this.getCell({ y, x }), { y, x })) return true
		return false
	}

	someGrid(fn: CBFn<T, boolean>): boolean {
		return this.#data.some((row, y) => row.some((cell, x) => fn(cell, { y, x })))
	}

	someRow(y: number, fn: CBFn<T, boolean>): boolean {
		return this.#data[y].some((cell, x) => fn(cell, { y, x }))
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

	#mapData<U>(fn: CBFn<T, U>) {
		return this.#data.map((row, y) => row.map((cell, x) => fn(cell, { y, x }))) as Grid<U>
	}
}
