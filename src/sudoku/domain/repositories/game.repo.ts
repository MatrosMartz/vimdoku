import type { BoardJSON, GameOptsJSON } from '../models'

export interface GameRepo {
	create(opts: GameOptsJSON, board: BoardJSON): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<BoardJSON | null>
	getOpts(): Promise<GameOptsJSON | null>
	getTimer(): Promise<number | null>
	hasBoard(): Promise<boolean>
	hasOpts(): Promise<boolean>
	hasTimer(): Promise<boolean>
	save(data: {board: BoardJSON, timer: number}): Promise<void>
}
