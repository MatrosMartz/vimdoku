import { createState } from '~/share/utils/svelte/create-state'

import { i18nObs } from '../i18n.store'

export const i18nState = createState(i18nObs)
