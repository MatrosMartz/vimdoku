import { PosObs } from '~/share/domain/services'
import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'

export const posState = createState(inject(PosObs))
