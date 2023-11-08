import type { Readable } from 'svelte/store'

import { mediator } from '$cmd/infra/services'
import type { ModeKinds } from '$sudoku/domain/models'

function createModesStore(): Readable<ModeKinds> {
	return {
		subscribe(observer) {
			void mediator.load()
			return mediator.subscribe('modes', observer)
		},
	}
}

export const modesSvelte = createModesStore()
