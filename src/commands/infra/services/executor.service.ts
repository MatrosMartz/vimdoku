import { ExecutorSvc } from '$cmd/domain/services'

import { suggsCtx } from '../stores'
import { mediator } from './mediator.service'
import { ALL_SUGGS } from './suggestions.service'

export const executor = new ExecutorSvc({ allSuggestions: ALL_SUGGS, mediator, suggsCtx })
