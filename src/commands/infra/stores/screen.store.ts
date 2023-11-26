import { ObsSvc } from '~/share/domain/services'
import { ScreenSvc } from '$screen/domain/services'

export const screenObs = new ObsSvc(ScreenSvc.DEFAULT_SCREEN)
