import type { BoardJSON, SudokuInfo, SudokuSettsJSON } from '$sudoku/domain/models'

export declare namespace SudokuRepos {
	interface Board {
		clear(): Promise<void>
		get(): Promise<BoardJSON | null>
		has(): Promise<boolean>
		save(board: BoardJSON): Promise<void>
	}

	interface Info {
		clear(): Promise<void>
		get(): Promise<SudokuInfo | null>
		has(): Promise<boolean>
		save(info: SudokuInfo): Promise<void>
	}

	interface Setts {
		clear(): Promise<void>
		get(): Promise<SudokuSettsJSON | null>
		has(): Promise<boolean>
		save(setts: SudokuSettsJSON): Promise<void>
	}

	interface Data {
		board?: BoardJSON | null
		info?: SudokuInfo | null
		setts?: SudokuSettsJSON | null
	}

	interface All {
		clear(): Promise<void>
		get(): Promise<Data>
		has(): Promise<boolean>
		save(data: Data): Promise<void>
	}
}
