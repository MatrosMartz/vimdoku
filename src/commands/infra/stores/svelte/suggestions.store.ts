import { suggsObs } from '../suggestions.store'
import { createState } from '~/share/utils/svelte/create-state'

export const suggsState = createState(suggsObs)
