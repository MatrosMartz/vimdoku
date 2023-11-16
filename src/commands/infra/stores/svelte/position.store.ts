import type { Readable } from 'svelte/store'

import type { Position } from '~/share/domain/models'
import { mediator } from '$cmd/infra/services'

function createPosState(): Readable<Position> {
	return {
		subscribe(observer) {
			return mediator.subscribe('position', observer)
		},
	}
}

export const posState = createPosState()
