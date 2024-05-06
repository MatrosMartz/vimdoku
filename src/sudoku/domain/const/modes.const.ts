import { Collection } from '~/share/domain/entities'

export enum ModeKind {
	N = 'notes',
	I = 'insert',
	V = 'visual',
	X = 'normal',
}

export const MODE_KEYS: Record<ModeKind, string> = {
	[ModeKind.N]: 'KeyN',
	[ModeKind.I]: 'KeyI',
	[ModeKind.V]: 'KeyV',
	[ModeKind.X]: 'Esc',
}

export const MODES = new Collection.Builder().addEntries(Collection.entriesByObj(ModeKind)).done()

export const IDLE_MODE = ModeKind.X
