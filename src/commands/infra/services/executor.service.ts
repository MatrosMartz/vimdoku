import { ExecutorService } from '$cmd/domain/services'

import { ALL_SUGGESTIONS } from '.'
import { mediator } from './mediator.service'

export const executor = new ExecutorService({ allSuggestions: ALL_SUGGESTIONS, mediator })
