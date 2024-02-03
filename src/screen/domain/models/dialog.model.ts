import type { Prefs } from '$pref/domain/models'

export enum DialogKind {
	Cmd = 'command',
	InLn = 'inline',
	None = 'none',
	Pause = 'pause',
	PrefAll = 'preferences-all',
	PrefDiff = 'preferences-differ',
	PrefEdit = 'preferences-edit',
	sel = 'select',
	ShowPref = 'ShowPref',
	Warn = 'Warn',
	Win = 'Win',
}

export const dialogPref = [DialogKind.PrefAll, DialogKind.PrefDiff, DialogKind.PrefEdit]

export type DialogPref = DialogKind.PrefAll | DialogKind.PrefDiff | DialogKind.PrefEdit

export interface InLnDialogOpts {
	type: 'modes' | 'position'
}

export interface ShowPrefDialogOpts {
	pref: keyof Prefs
}

export interface WarnDialogOpts {
	type: 'unsave'
}

export type DialogOpts = InLnDialogOpts | WarnDialogOpts | ShowPrefDialogOpts | null | undefined

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
	| { kind: DialogKind.ShowPref; opts: ShowPrefDialogOpts }
	| { kind: DialogKind.Warn; opts: WarnDialogOpts }

export const IDLE_DIALOG = { kind: DialogKind.None } as const satisfies DialogData
