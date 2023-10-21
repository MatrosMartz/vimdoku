import type { Readable } from 'svelte/store'

import { mediator } from '$cmd/infra/services'
import type { Preferences } from '$preferences/domain/models'

function createPreferencesStore(): Readable<Preferences> {
	return {
		subscribe(observer) {
			void mediator.load()
			return mediator.subscribe('preferences', observer)
		},
	}
}

export const prefSvelte = createPreferencesStore()
