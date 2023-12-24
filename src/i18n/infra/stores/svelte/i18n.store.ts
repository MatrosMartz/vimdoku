import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'
import { I18nObs } from '$i18n/domain/services'

export const i18nState = createState(inject(I18nObs))
