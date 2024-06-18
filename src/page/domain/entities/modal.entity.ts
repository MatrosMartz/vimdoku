import { Collection } from '~/share/domain/entities'
import { A, Prtcl } from '~/share/utils'

export enum Kind {
	Cmd = 'command',
	Modes = 'Modes',
	None = 'none',
	Pause = 'pause',
	Pref = 'preferences',
	SelGame = 'select-difficulty',
	Warn = 'Warn',
	Win = 'Win',
}

export const KINDS = new Collection.Builder().addToMain
	.fromObject(Kind)
	.addNewSub.conditional('COMPOUND', 'SIMPLE', A.is.Array.with(0, A.equalTo('Pref', 'Warn')))
	.done()

abstract class Base implements Prtcl.IEquals<Modal> {
	abstract readonly kind: Kind

	toJSON() {
		return { kind: this.kind }
	}

	abstract [Prtcl.equalsTo](other: Modal): boolean
}

export class Cmd extends Base {
	readonly kind = Kind.Cmd

	static is(modal: unknown): modal is Cmd {
		return modal instanceof Cmd
	}

	[Prtcl.equalsTo](other: Modal) {
		return other.kind === Kind.Cmd
	}
}

export class Modes extends Base {
	readonly kind = Kind.Modes

	static is(modal: unknown): modal is Modes {
		return modal instanceof Modes
	}

	[Prtcl.equalsTo](other: Modal) {
		return other.kind === Kind.Modes
	}
}

export class None extends Base {
	readonly kind = Kind.None

	static is(modal: unknown): modal is None {
		return modal instanceof None
	}

	[Prtcl.equalsTo](other: Modal) {
		return other.kind === Kind.None
	}
}

export class Pause extends Base {
	readonly kind = Kind.Pause

	static is(modal: unknown): modal is Pause {
		return modal instanceof Pause
	}

	[Prtcl.equalsTo](other: Modal) {
		return other.kind === Kind.Pause
	}
}

export enum PrefType {
	showAll = 'show-all',
	showDiffer = 'show-differ',
	edit = 'edit',
}

export const PREF_TYPE = new Collection.Builder().addToMain
	.fromObject(PrefType)
	.addNewSub.create('SHOW', A.is.Array.with(0, A.is.String.startWith('show')))
	.done()

export class Pref<Type extends PrefType> extends Base {
	readonly kind = Kind.Pref
	readonly type

	constructor(type: Type) {
		super()
		this.type = type
	}

	static is<Type extends PrefType | undefined>(
		modal: unknown,
		type?: Type
	): modal is Pref<Type extends undefined ? PrefType : Type> {
		return modal instanceof Pref && (type == null || modal.type === type)
	}

	[Prtcl.equalsTo](other: Modal) {
		return other.kind === Kind.Pref && other.type === this.type
	}

	toJSON() {
		return { kind: this.kind, type: this.type }
	}
}

export class SelGame extends Base {
	readonly kind = Kind.SelGame

	static is(modal: unknown): modal is SelGame {
		return modal instanceof SelGame
	}

	[Prtcl.equalsTo](other: Modal) {
		return other.kind === Kind.SelGame
	}
}

export enum WarnType {
	unsave = 'unsave',
}

export const WARN_TYPE = new Collection.Builder().addToMain.fromObject(WarnType).done()

export class Warn<Type extends WarnType> extends Base {
	readonly kind = Kind.Warn
	readonly type

	constructor(type: Type) {
		super()
		this.type = type
	}

	static is<Type extends WarnType | undefined>(
		modal: unknown,
		type?: Type
	): modal is Warn<Type extends undefined ? WarnType : Type> {
		return modal instanceof Warn && (type == null || modal.type === type)
	}

	[Prtcl.equalsTo](other: Modal) {
		return other.kind === Kind.Warn && other.type === this.type
	}

	toJSON() {
		return { kind: this.kind, type: this.type }
	}
}

export class Win extends Base {
	readonly kind = Kind.Win

	static is(modal: unknown): modal is Win {
		return modal instanceof Win
	}

	[Prtcl.equalsTo](other: Modal) {
		return other.kind === Kind.Win
	}
}

export type Modal = Cmd | Modes | None | Pause | Pref<PrefType> | SelGame | Warn<WarnType> | Win

/**
 * Checks is any value is Modal Type.
 * @param value Value to check.
 * @returns True if value is Modal, false otherwise.
 */
export function is(value: unknown): value is Modal {
	return value instanceof Base
}

export const IDLE: Modal = new None()
