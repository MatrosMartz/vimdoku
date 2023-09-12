import {
	DialogKinds,
	type HelpDialogKinds,
	MainScreenKinds,
	type PrefDialogKinds,
	type VimScreenValue,
} from '../models'

export interface HelpDialogOpts {
	kind: HelpDialogKinds
}

export interface PrefDialogOpts {
	kind: PrefDialogKinds
}

const { freeze: _f } = Object

type DialogOpts = HelpDialogKinds | PrefDialogKinds | null

export class VimScreen {
	static readonly DEFAULT_SCREEN = _f<VimScreenValue>({
		dialog: DialogKinds.None,
		main: MainScreenKinds.Init,
	})

	#dialogOpts: DialogOpts = null
	#value: VimScreenValue = { ...VimScreen.DEFAULT_SCREEN }

	get dialog() {
		return this.#value.dialog
	}

	get main() {
		return this.#value.main
	}

	setDialog(dialog: DialogKinds.None): void
	setDialog(dialog: DialogKinds.Help, opts: HelpDialogKinds): void
	setDialog(dialog: DialogKinds.Pref, opts: PrefDialogKinds): void
	setDialog(dialog: DialogKinds, opts: DialogOpts = null) {
		this.#value = { ...this.#value, dialog }
		this.#dialogOpts = structuredClone(opts)
	}

	setMain(main: MainScreenKinds) {
		this.#value = { ...this.#value, main }
	}
}
