import { inject } from '~/share/utils'
import { createState } from '~/share/utils/svelte/create-state'
import { SuggsObs } from '$cmd/domain/services'

export const suggsState = createState(inject(SuggsObs<HTMLHeadingElement>))
