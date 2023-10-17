import type { BoardJSON, GameOptsJSON } from '../models'

export interface GameRepo {
	create(opts: GameOptsJSON, board: BoardJSON): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<BoardJSON | null>
	getOpts(): Promise<GameOptsJSON | null>
	hasBoard(): Promise<boolean>
	hasOpts(): Promise<boolean>
	setBoard(board: BoardJSON): Promise<void>
}
