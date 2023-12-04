import type { BoardJSON, GameInfo, GameOptsJSON } from '../models'

export interface GameRepo {
	create(data: { info?: GameInfo; board: BoardJSON; opts: GameOptsJSON }): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<BoardJSON>
	getInfo(): Promise<GameInfo>
	getOpts(): Promise<GameOptsJSON>
	hasData(): Promise<boolean>
	save(data: { board: BoardJSON; info: GameInfo }): Promise<void>
}
