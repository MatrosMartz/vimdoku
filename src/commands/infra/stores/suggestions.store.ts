import { ContextSvc, Observable } from '~/share/domain/services'
import type { Sugg } from '$cmd/domain/models'

export const suggsObservable = new Observable<Sugg[]>()

export const suggsCtx = new ContextSvc(suggsObservable, [])
