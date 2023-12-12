import { I18nSvc } from '$i18n/domain/services'

import { i18nObs } from '../stores'

export const i18n = new I18nSvc(i18nObs)
