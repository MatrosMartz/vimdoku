import { ExecSvc } from '$cmd/domain/services'

import { cmdList } from './command.service'
import { med } from './mediator.service'

export const exec = new ExecSvc({ cmdList, mediator: med })
