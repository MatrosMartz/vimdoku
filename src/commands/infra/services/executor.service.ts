import { ExecSvc } from '$cmd/domain/services'

import { cmdList } from './command.service'

export const exec = new ExecSvc({ cmdList })
