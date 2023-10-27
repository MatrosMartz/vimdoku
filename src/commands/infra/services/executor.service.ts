import { ExecutorService } from '$cmd/domain/services'

import { mediator } from './mediator.service'

export const executor = new ExecutorService({ mediator })
