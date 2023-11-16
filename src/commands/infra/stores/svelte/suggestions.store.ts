import type { Readable } from 'svelte/store'

import type { Suggestion } from '$cmd/domain/models'
import { executor } from '$cmd/infra/services'

function createSuggestionsState(): Readable<Suggestion[]> {
	return {
		subscribe(observer) {
			return executor.subscribe('suggestions', observer)
		},
	}
}

export const suggsState = createSuggestionsState()
