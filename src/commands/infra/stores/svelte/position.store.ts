import type { Readable } from 'svelte/store'

import type { Position } from '~/share/domain/models'
import { mediator } from '$cmd/infra/services'

function createPosStore(): Readable<Position> {
	return {
		subscribe(observer) {
			void mediator.load()
			return mediator.subscribe('position', observer)
		},
	}
}

export const posSvelte = createPosStore()
