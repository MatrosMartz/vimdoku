import type { BoardJSON, SudokuInfo, SudokuSettsJSON } from '../models'

export interface SudokuRepo {
	create(data: { board: BoardJSON; info: SudokuInfo; setts: SudokuSettsJSON }): Promise<void>
	delete(): Promise<void>
	getBoard(): Promise<BoardJSON>
	getInfo(): Promise<SudokuInfo>
	getSetts(): Promise<SudokuSettsJSON>
	hasData(): Promise<boolean>
	save(data: { board: BoardJSON; info: SudokuInfo }): Promise<void>
}
