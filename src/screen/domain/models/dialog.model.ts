export enum DialogKinds {
	Cmd = 'command',
	Help = 'help',
	InLn = 'inline',
	None = 'none',
	Pause = 'pause',
	PrefAll = 'preferences-all',
	PrefDiff = 'preferences-differ',
	PrefEdit = 'preferences-edit',
	sel = 'select',
	Win = 'Win',
}

export const dialogPref = [DialogKinds.PrefAll, DialogKinds.PrefDiff, DialogKinds.PrefEdit]

export type DialogPref = DialogKinds.PrefAll | DialogKinds.PrefDiff | DialogKinds.PrefEdit
