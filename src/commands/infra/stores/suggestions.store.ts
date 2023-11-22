import { ContextService, Observable } from '~/share/domain/services'
import type { Suggestion } from '$cmd/domain/models'

export const suggsObservable = new Observable<Suggestion[]>()

export const suggsCtx = new ContextService(suggsObservable, [])
