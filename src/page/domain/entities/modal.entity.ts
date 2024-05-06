import { Collection } from '~/share/domain/entities'
import { Assert, AssertCommons } from '~/share/utils'

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

export const KINDS = new Collection.Builder()
	.addEntries(Collection.entriesByObj(Kind))
	.createConditionalSubCollections(
		'COMPOUND',
		'SIMPLE',
		Assert.tuple([Assert.equalTo('Pref', 'Warn'), AssertCommons.Any])
	)
	.done()

abstract class Base {
	abstract readonly kind: Kind

	toJSON() {
		return { kind: this.kind }
	}
}

export class Cmd extends Base {
	get kind() {
		return Kind.Cmd as const
	}

	static is(modal: unknown): modal is Cmd {
		return modal instanceof Cmd
	}
}

export class Modes extends Base {
	get kind() {
		return Kind.Modes as const
	}

	static is(modal: unknown): modal is Modes {
		return modal instanceof Modes
	}
}

export class None extends Base {
	get kind() {
		return Kind.None as const
	}

	static is(modal: unknown): modal is None {
		return modal instanceof None
	}
}

export class Pause extends Base {
	get kind() {
		return Kind.Pause as const
	}

	static is(modal: unknown): modal is Pause {
		return modal instanceof Pause
	}
}

export enum PrefType {
	showAll = 'show-all',
	showDiffer = 'show-differ',
	edit = 'edit',
}

export const PREF_TYPE = new Collection.Builder()
	.addEntries(Collection.entriesByObj(PrefType))
	.createSubCollection('SHOW', Assert.tuple([Assert.startWith('show'), AssertCommons.Any]))
	.done()

export class Pref<Type extends PrefType> extends Base {
	readonly #type

	constructor(type: Type) {
		super()
		this.#type = type
	}

	get kind() {
		return Kind.Pref as const
	}

	get type() {
		return this.#type
	}

	static is<Type extends PrefType | undefined>(
		modal: unknown,
		type?: Type
	): modal is Pref<Type extends undefined ? PrefType : Type> {
		return modal instanceof Pref && (type == null || modal.type === type)
	}

	toJSON() {
		return { kind: this.kind, type: this.type }
	}
}

export class SelGame extends Base {
	get kind() {
		return Kind.SelGame as const
	}

	static is(modal: unknown): modal is SelGame {
		return modal instanceof SelGame
	}
}

export enum WarnType {
	unsave = 'unsave',
}

export const WARN_TYPE = new Collection.Builder().addEntries(Collection.entriesByObj(WarnType)).done()

export class Warn<Type extends WarnType> extends Base {
	readonly #type

	constructor(type: Type) {
		super()
		this.#type = type
	}

	get kind() {
		return Kind.Warn as const
	}

	get type() {
		return this.#type
	}

	static is<Type extends WarnType | undefined>(
		modal: unknown,
		type?: Type
	): modal is Warn<Type extends undefined ? WarnType : Type> {
		return modal instanceof Warn && (type == null || modal.type === type)
	}

	toJSON() {
		return { kind: this.kind, type: this.type }
	}
}

export class Win extends Base {
	get kind() {
		return Kind.Win as const
	}

	static is(modal: unknown): modal is Win {
		return modal instanceof Win
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
