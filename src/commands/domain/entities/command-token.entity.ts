export enum Kind {
	OPTIONAL = 'optional',
	REQUIRED = 'required',
}

abstract class Base<K extends Kind> {
	protected _kind
	protected _value

	constructor(kind: K, value: string) {
		this._kind = kind
		this._value = value
	}

	get kind() {
		return this._kind
	}

	get value() {
		return this._value
	}

	toString() {
		return `${this._kind}-${this._value}`
	}
}

export class Optional extends Base<Kind.OPTIONAL> {
	constructor(value: string) {
		super(Kind.OPTIONAL, value)
	}
}

export class Required extends Base<Kind.REQUIRED> {
	constructor(value: string) {
		super(Kind.REQUIRED, value)
	}
}

export type CmdToken = Optional | Required
