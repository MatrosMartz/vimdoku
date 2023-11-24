export enum ModeKinds {
	A = 'annotation',
	I = 'insert',
	X = 'normal',
}

export const MODES_KEYS: Record<ModeKinds, string> = {
	[ModeKinds.A]: 'KeyA',
	[ModeKinds.I]: 'KeyI',
	[ModeKinds.X]: 'Esc',
}