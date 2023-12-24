import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'
import { ScreenObs } from '$screen/domain/services'

export const screenState = createState(inject(ScreenObs))
