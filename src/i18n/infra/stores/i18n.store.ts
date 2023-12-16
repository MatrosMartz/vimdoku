import { ObsSvc } from '~/share/domain/services'
import type { I18nData } from '$i18n/domain/models'
import { I18nSvc } from '$i18n/domain/services'

export const i18nObs = new ObsSvc<I18nData>(I18nSvc.IDLE)
