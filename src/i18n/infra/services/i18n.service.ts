import { I18nSvc } from '$i18n/domain/services'

import { browserI18nRepo } from '../repositories'

export const i18n = new I18nSvc(browserI18nRepo)
