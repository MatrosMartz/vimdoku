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

export abstract class ModalEntity {
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

	static isCmd(modal: ModalEntity): modal is CmdModal {
		return modal.kind === ModalKind.Cmd
	}

	static isModes(modal: ModalEntity): modal is ModesModal {
		return modal.kind === ModalKind.Modes
	}

	static isNone(modal: ModalEntity): modal is NoneModal {
		return modal.kind === ModalKind.None
	}

	static isPause(modal: ModalEntity): modal is PauseModal {
		return modal.kind === ModalKind.Pause
	}

	static isPref<Type extends PrefModalType | undefined>(
		modal: ModalEntity,
		type?: Type
	): modal is PrefModal<Type extends undefined ? PrefModalType : Type> {
		return modal.kind === ModalKind.Pref && (type == null || (modal as PrefModal<PrefModalType>).type === type)
	}

	static isSelGame(modal: ModalEntity): modal is SelGameModal {
		return modal.kind === ModalKind.SelGame
	}

	static isWarn<Type extends WarnModalType | undefined>(
		modal: ModalEntity,
		type?: Type
	): modal is WarnModal<Type extends undefined ? WarnModalType : Type> {
		return modal.kind === ModalKind.Warn && (type == null || (modal as WarnModal<WarnModalType>).type === type)
	}

	static isWin(modal: ModalEntity): modal is WinModal {
		return modal.kind === ModalKind.Win
	}
}

class CmdModal extends ModalEntity {
	get kind() {
		return ModalKind.Cmd as const
	}
}

class ModesModal extends ModalEntity {
	get kind() {
		return ModalKind.Modes as const
	}
}

class NoneModal extends ModalEntity {
	get kind() {
		return ModalKind.None as const
	}
}

class PauseModal extends ModalEntity {
	get kind() {
		return ModalKind.Pause as const
	}
}

export type PrefModalType = 'show-all' | 'show-differ' | 'edit'

class PrefModal<Type extends PrefModalType> extends ModalEntity {
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
}

class SelGameModal extends ModalEntity {
	get kind() {
		return ModalKind.SelGame as const
	}
}

export type WarnModalType = 'unsave'

class WarnModal<Type extends WarnModalType> extends ModalEntity {
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
}

class WinModal extends ModalEntity {
	get kind() {
		return ModalKind.Win as const
	}
}

export const IDLE_MODAL = ModalEntity.createNone()
