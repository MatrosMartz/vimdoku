import { ExecutorService } from '$cmd/domain/services'

import { mediator } from './mediator.service'
import { ALL_SUGGESTIONS } from './suggestions.service'

export const executor = new ExecutorService({ allSuggestions: ALL_SUGGESTIONS, mediator })
