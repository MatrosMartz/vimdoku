export enum ModeKind {
	N = 'annotation',
	I = 'insert',
	V = 'visual',
	X = 'normal',
}

export const MODES_KEYS: Record<ModeKind, string> = {
	[ModeKind.N]: 'KeyN',
	[ModeKind.I]: 'KeyI',
	[ModeKind.V]: 'KeyV',
	[ModeKind.X]: 'Esc',
}
