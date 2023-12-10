export enum DialogKinds {
	Cmd = 'command',
	InLn = 'inline',
	Help = 'help',
	None = 'none',
	PrefAll = 'preferences-all',
	PrefDiff = 'preferences-differ',
	PrefEdit = 'preferences-edit',
	Win = 'Win',
}

export const dialogPref = [DialogKinds.PrefAll, DialogKinds.PrefDiff, DialogKinds.PrefEdit]

export type DialogPref = DialogKinds.PrefAll | DialogKinds.PrefDiff | DialogKinds.PrefEdit
