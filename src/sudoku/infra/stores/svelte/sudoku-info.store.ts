import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'
import { ErrorsObs, TimerObs } from '$sudoku/domain/services'

export const errorsState = createState(inject(ErrorsObs))
export const timerState = createState(inject(TimerObs))
