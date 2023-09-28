import type { BoardService, BoardOpts } from '../models'

export interface BoardRepo {
	create(opts?: BoardOpts): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<BoardService | null>
	has(): Promise<boolean>
}
