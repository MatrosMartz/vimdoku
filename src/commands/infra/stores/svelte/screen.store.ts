import type { Readable } from 'svelte/store'

import { mediator } from '$cmd/infra/services'
import type { VimScreen } from '$screen/domain/models'

function createScreenState(): Readable<VimScreen> {
	return {
		subscribe(observer) {
			return mediator.subscribe('screen', observer)
		},
	}
}

export const screenState = createScreenState()
