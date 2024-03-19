import { ScreenSvc } from '$screen/domain/services'

import { browserPageRepo } from '../repositories'

export const vimScreen = new ScreenSvc({ repo: browserPageRepo })
