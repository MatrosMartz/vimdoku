import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'
import { PageObs } from '$page/domain/services'

export const pageState = createState(inject(PageObs))
