import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'
import { ModeObs } from '$sudoku/domain/services'

export const modeState = createState(inject(ModeObs))
