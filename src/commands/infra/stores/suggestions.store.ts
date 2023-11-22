import { Context, Observable } from '~/share/domain/services'
import type { Suggestion } from '$cmd/domain/models'

export const suggsObservable = new Observable<Suggestion[]>()

export const suggsCtx = new Context(suggsObservable, [])
