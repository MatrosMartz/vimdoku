import type { Board, BoardOpts } from '../models'

export interface BoardRepo {
	create(opts?: BoardOpts): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<Board | null>
	has(): Promise<boolean>
}
