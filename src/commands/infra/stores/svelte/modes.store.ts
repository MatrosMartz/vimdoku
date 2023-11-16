import type { Readable } from 'svelte/store'

import { mediator } from '$cmd/infra/services'
import type { ModeKinds } from '$sudoku/domain/models'

function createModesState(): Readable<ModeKinds> {
	return {
		subscribe(observer) {
			return mediator.subscribe('modes', observer)
		},
	}
}

export const modesState = createModesState()
