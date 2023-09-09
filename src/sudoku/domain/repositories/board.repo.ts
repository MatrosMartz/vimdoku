import type { Board, BoardOpts } from '../entities'

export interface BoardRepo {
	create(opts?: BoardOpts): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<Board | null>
	has(): Promise<boolean>
}
