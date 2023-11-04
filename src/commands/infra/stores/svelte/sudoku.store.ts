import type { Readable } from 'svelte/store'

import { mediator } from '$cmd/infra/services'
import type { Board } from '$sudoku/domain/models'

function createBoardStore(): Readable<Board | null | undefined> {
	return {
		subscribe(observer) {
			void mediator.load()
			return mediator.subscribe('board', observer)
		},
	}
}

export const boardSvelte = createBoardStore()
