import type { RequireOne } from '~/share/types'

export interface Position {
	x: number
	y: number
}

export interface IPosition {
	/**
	 * Change the current position by updating the row and/or column.
	 * @param pos An object containing row and/or col properties to update the position.
	 */
	change(pos: RequireOne<Position>): this
	/** Get the current data of position. */
	get data(): Position
	/**
	 * Move the position down by a specified number of times within the valid range.
	 * @param times The number of times to move down.
	 */
	moveDown(times: number): this
	/**
	 * Move the position left by a specified number of times within the valid range.
	 * @param times The number of times to move left.
	 */
	moveLeft(times: number): this
	/**
	 * Move the position right by a specified number of times within the valid range.
	 * @param times The number of times to move right.
	 */
	moveRight(times: number): this
	/**
	 * Move the position up by a specified number of times within the valid range.
	 * @param times The number of times to move up.
	 */
	moveUp(times: number): this
}
