export enum DialogKinds {
	Help = 'help',
	None = 'none',
	Pref = 'preferences',
}

export enum HelpDialogKinds {}

export interface HelpDialogOpts {
	kind: HelpDialogKinds
}

export enum PrefDialogKinds {
	all = 'all',
	diff = 'differ',
	edit = 'edit',
}

export interface PrefDialogOpts {
	kind: PrefDialogKinds
}

export type DialogOpts = [DialogKinds.None] | [DialogKinds.Help, HelpDialogOpts] | [DialogKinds.Pref, PrefDialogOpts]
