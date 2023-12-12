import { ScreenSvc } from '$screen/domain/services'

import { screenObs } from '../stores'

export const vimScreen = new ScreenSvc(screenObs)
