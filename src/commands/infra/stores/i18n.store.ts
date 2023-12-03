import { AsyncObsSvc } from '~/share/domain/services'
import type { I18nData } from '$i18n/domain/models'
import { i18n } from '$i18n/infra/services'

export const i18nObs = new AsyncObsSvc<I18nData>(i18n.data)
