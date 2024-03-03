import { ScreenSvc } from '$screen/domain/services'

import { browserRouteRepo } from '../repositories'

export const vimScreen = new ScreenSvc({ repo: browserRouteRepo })
