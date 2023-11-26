import { ExecSvc } from '$cmd/domain/services'

import { suggsObs } from '../stores'
import { med } from './mediator.service'
import { ALL_SUGGS } from './suggestions.service'

export const exec = new ExecSvc({ allSuggestions: ALL_SUGGS, mediator: med, suggsObs })
