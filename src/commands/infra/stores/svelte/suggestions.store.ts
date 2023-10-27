import type { Readable } from 'svelte/store'

import type { Suggestion } from '$cmd/domain/models'
import { executor } from '$cmd/infra/services'

function createSuggestionsStore(): Readable<Suggestion[]> {
	return {
		subscribe(run) {
			return executor.subscribe('suggestions', run)
		},
	}
}

export const suggsSvelte = createSuggestionsStore()
