import { Collection } from '~/share/domain/entities'

export enum Kind {
	N = 'notes',
	I = 'insert',
	V = 'visual',
	X = 'normal',
}

export const KEYS: Record<Kind, string> = {
	[Kind.N]: 'KeyN',
	[Kind.I]: 'KeyI',
	[Kind.V]: 'KeyV',
	[Kind.X]: 'Esc',
}

export const ALL = new Collection.Builder().addEntries(Collection.entriesByObj(Kind)).done()

export const IDLE = Kind.X
