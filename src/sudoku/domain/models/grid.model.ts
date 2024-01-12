import type { Pos } from '~/share/domain/models'
import type { Tuple } from '~/share/types'

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
