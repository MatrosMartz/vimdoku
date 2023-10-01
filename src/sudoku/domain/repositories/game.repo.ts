import type { CellJSON, GameOptsJSON } from '../models'

export interface GameRepo {
	create(opts: GameOptsJSON, board: CellJSON[][]): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<CellJSON[][] | null>
	getOpts(): Promise<GameOptsJSON | null>
	hasBoard(): Promise<boolean>
	hasOpts(): Promise<boolean>
	setBoard(board: CellJSON[][]): Promise<void>
}
