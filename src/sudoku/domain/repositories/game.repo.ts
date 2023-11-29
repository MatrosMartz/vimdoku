import type { BoardJSON, GameInfo, GameOptsJSON } from '../models'

export interface GameRepo {
	create(opts: GameOptsJSON, board: BoardJSON): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<BoardJSON | null>
	getInfo(): Promise<GameInfo | null>
	getOpts(): Promise<GameOptsJSON | null>
	hasData(): Promise<boolean>
	save(data: { board: BoardJSON; info: GameInfo }): Promise<void>
}
