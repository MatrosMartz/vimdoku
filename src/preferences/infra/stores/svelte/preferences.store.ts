import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'
import { PrefsObs } from '$pref/domain/services'

export const prefsState = createState(inject(PrefsObs))
