import { ExecutorService } from '$cmd/domain/services'

import { suggsCtx } from '../stores'
import { mediator } from './mediator.service'
import { ALL_SUGGESTIONS } from './suggestions.service'

export const executor = new ExecutorService({ allSuggestions: ALL_SUGGESTIONS, mediator, suggsCtx })
