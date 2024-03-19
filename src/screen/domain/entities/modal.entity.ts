export enum ModalKind {
	Cmd = 'command',
	Modes = 'Modes',
	None = 'none',
	Pause = 'pause',
	Pref = 'preferences',
	SelGame = 'select-difficulty',
	Warn = 'Warn',
	Win = 'Win',
}

export abstract class Modal {
	abstract readonly kind: ModalKind

	static createCmd() {
		return new CmdModal()
	}

	static createModes() {
		return new ModesModal()
	}

	static createNone() {
		return new NoneModal()
	}

	static createPause() {
		return new PauseModal()
	}

	static createPref(type: PrefModalType) {
		return new PrefModal(type)
	}

	static createSelGame() {
		return new SelGameModal()
	}

	static createWarn(type: WarnModalType) {
		return new WarnModal(type)
	}

	static createWin() {
		return new WinModal()
	}

	static isCmd(modal: Modal): modal is CmdModal {
		return modal.kind === ModalKind.Cmd
	}

	static isModes(modal: Modal): modal is ModesModal {
		return modal.kind === ModalKind.Modes
	}

	static isNone(modal: Modal): modal is NoneModal {
		return modal.kind === ModalKind.None
	}

	static isPause(modal: Modal): modal is PauseModal {
		return modal.kind === ModalKind.Pause
	}

	static isPref<Type extends PrefModalType | undefined>(
		modal: Modal,
		type?: Type
	): modal is PrefModal<Type extends undefined ? PrefModalType : Type> {
		return modal.kind === ModalKind.Pref && (type == null || (modal as PrefModal<PrefModalType>).type === type)
	}

	static isSelGame(modal: Modal): modal is SelGameModal {
		return modal.kind === ModalKind.SelGame
	}

	static isWarn<Type extends WarnModalType | undefined>(
		modal: Modal,
		type?: Type
	): modal is WarnModal<Type extends undefined ? WarnModalType : Type> {
		return modal.kind === ModalKind.Warn && (type == null || (modal as WarnModal<WarnModalType>).type === type)
	}

	static isWin(modal: Modal): modal is WinModal {
		return modal.kind === ModalKind.Win
	}

	toJSON() {
		return { kind: this.kind }
	}
}

class CmdModal extends Modal {
	get kind() {
		return ModalKind.Cmd as const
	}
}

class ModesModal extends Modal {
	get kind() {
		return ModalKind.Modes as const
	}
}

class NoneModal extends Modal {
	get kind() {
		return ModalKind.None as const
	}
}

class PauseModal extends Modal {
	get kind() {
		return ModalKind.Pause as const
	}
}

export type PrefModalType = 'show-all' | 'show-differ' | 'edit'

class PrefModal<Type extends PrefModalType> extends Modal {
	readonly #type

	constructor(type: Type) {
		super()
		this.#type = type
	}

	get kind() {
		return ModalKind.Pref as const
	}

	get type() {
		return this.#type
	}

	toJSON() {
		return { kind: this.kind, type: this.type }
	}
}

class SelGameModal extends Modal {
	get kind() {
		return ModalKind.SelGame as const
	}
}

export type WarnModalType = 'unsave'

class WarnModal<Type extends WarnModalType> extends Modal {
	readonly #type

	constructor(type: Type) {
		super()
		this.#type = type
	}

	get kind() {
		return ModalKind.Warn as const
	}

	get type() {
		return this.#type
	}

	toJSON() {
		return { kind: this.kind, type: this.type }
	}
}

class WinModal extends Modal {
	get kind() {
		return ModalKind.Win as const
	}
}

export const IDLE_MODAL = Modal.createNone()
