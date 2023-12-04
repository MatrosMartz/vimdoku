export enum ModeKinds {
	N = 'annotation',
	I = 'insert',
	V = 'visual',
	X = 'normal',
}

export const MODES_KEYS: Record<ModeKinds, string> = {
	[ModeKinds.N]: 'KeyN',
	[ModeKinds.I]: 'KeyI',
	[ModeKinds.V]: 'KeyV',
	[ModeKinds.X]: 'Esc',
}
