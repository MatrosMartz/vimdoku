import { ObsSvc } from '~/share/domain/services'
import type { Sugg } from '$cmd/domain/models'

export const suggsObs = new ObsSvc<Sugg[]>([])
