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

export interface HelpDialogOpts {
	search: string
}

export interface InLnDialogOpts {
	type: 'modes' | 'position'
}

export type DialogOpts = HelpDialogOpts | null | undefined

export type DialogsWithoutOpts =
	| DialogKind.Cmd
	| DialogKind.None
	| DialogKind.Pause
	| DialogKind.PrefAll
	| DialogKind.PrefDiff
	| DialogKind.PrefEdit
	| DialogKind.sel
	| DialogKind.Win

export type DialogData =
	| { opts?: null; kind: DialogsWithoutOpts }
	| { kind: DialogKind.InLn; opts: InLnDialogOpts }
	| { kind: DialogKind.Help; opts: HelpDialogOpts }

export const IDLE_DIALOG = { kind: DialogKind.None } as const satisfies DialogData
