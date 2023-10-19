import type { Position } from '~/share/domain/models'
import { PositionService } from '~/share/domain/services'
import type { Tuple } from '~/share/types'
import { createArray, createMatrix, iterateArray, iterateMatrix } from '~/share/utils'

import type { CBFn, CompareCBFn, CreateCBFn, GridData, IGrid } from '../models'

/** Represent a Sudoku Grid Service. */
export class GridService<T> implements IGrid<T> {
	/** The position of the first cell. */
	static readonly FIRST_POSITION: Position = { y: 0, x: 0 }
	/** The position of the last cell. */
	static readonly LAST_POSITION: Position = { y: 8, x: 8 }

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
				!PositionService.equalsPos(cellPos, currPos) &&
				!fn(this.#data[cellPos.y][cellPos.x], this.getCell(currPos), currPos)
			)
				return false
		}

		return true
	}

	compareWithCol(CellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	compareWithCol({ y: compareY, x }: Position, fn: CompareCBFn<T, boolean>) {
		for (const y of iterateArray(9))
			if (y !== compareY && !fn(this.#data[compareY][x], this.#data[y][x], { y, x })) return false
		return true
	}

	compareWithRow(cellPos: Position, fn: CompareCBFn<T, boolean>): boolean
	compareWithRow({ y, x: compareX }: Position, fn: CompareCBFn<T, boolean>) {
		for (const x of iterateArray(9))
			if (x !== compareX && !fn(this.#data[y][compareX], this.#data[y][x], { y, x })) return false
		return true
	}

	copy() {
		return new GridService(this.data)
	}

	editCell<U>(cellPos: Position, fn: CBFn<T, U>) {
		const newGrid: GridData<T | U> = this.data

		newGrid[cellPos.y][cellPos.x] = fn(this.getCell(cellPos), cellPos)

		return new GridService(newGrid)
	}

	everyBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = PositionService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { y, x } = PositionService.sumPos(boxPos, pos)
			if (!fn(this.#data[y][x], { y, x })) return false
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

	getCell(pos: Position): T
	getCell({ y, x }: Position) {
		return this.#data[y][x]
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

	joinBox(box: number, separators: { x?: string; y?: string }): string
	joinBox(box: number, { y: rowSep = '', x: colSep = '' }: { x?: string; y?: string }) {
		let str = ''
		const boxPos = PositionService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { y, x } = PositionService.sumPos(pos, boxPos)
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
			return PositionService.getBoxFromPos(currPos) === box ? fn(cell, currPos) : cell
		})

		return new GridService(newData)
	}

	mapCol<U>(x: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return currPos.x === x ? fn(cell, currPos) : cell
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
		const newData = this.#data.map((row, y) => row.map((cell, x) => fn(cell, { y, x }))) as GridData<U>
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

	mapRow<U>(y: number, fn: CBFn<T, U>) {
		const newData = createMatrix(9, currPos => {
			const cell = this.getCell(currPos)
			return currPos.y === y ? fn(cell, currPos) : cell
		})

		return new GridService(newData)
	}

	someBox(box: number, fn: CBFn<T, boolean>) {
		const boxPos = PositionService.getPosFromBox(box)
		for (const pos of iterateMatrix(3)) {
			const { y, x } = PositionService.sumPos(boxPos, pos)
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
	#mutateCell(pos: Position, newCell: T): void
	#mutateCell({ y, x }: Position, newCell: T) {
		this.#data[y][x] = newCell
	}
}
