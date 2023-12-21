export enum DialogKind {
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

export const dialogPref = [DialogKind.PrefAll, DialogKind.PrefDiff, DialogKind.PrefEdit]

export type DialogPref = DialogKind.PrefAll | DialogKind.PrefDiff | DialogKind.PrefEdit
