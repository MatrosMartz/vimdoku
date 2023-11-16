import type { Readable } from 'svelte/store'

import { mediator } from '$cmd/infra/services'
import type { Board } from '$sudoku/domain/models'

function createBoardState(): Readable<Board | null | undefined> {
	return {
		subscribe(observer) {
			return mediator.subscribe('board', observer)
		},
	}
}

export const boardState = createBoardState()

function createBoardSavedState(): Readable<boolean> {
	return {
		subscribe(observer) {
			void mediator.load()
			return mediator.subscribe('boardSaved', observer)
		},
	}
}

export const boardSavedState = createBoardSavedState()
