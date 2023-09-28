import type { BoardOpts } from '../models'

export interface BoardOptsRepo {
	create(): Promise<void>
	delete(): Promise<void>
	getBoardOpts(): Promise<BoardOpts | null>
	has(): Promise<boolean>
}
