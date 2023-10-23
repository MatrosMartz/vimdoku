import type { Readable } from 'svelte/store'

import { mediator } from '$cmd/infra/services'
import type { VimScreen } from '$screen/domain/models'

function createScreenStore(): Readable<VimScreen> {
	return {
		subscribe(observer) {
			void mediator.load()
			return mediator.subscribe('screen', observer)
		},
	}
}

export const screenSvelte = createScreenStore()
