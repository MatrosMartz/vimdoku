export enum Kind {
	HOLDER = 'holder',
	SYMBOL = 'symbol',
	VALUE = 'value',
	VARIABLE = 'variable',
	NORMAL = 'normal',
}

abstract class Base<K extends Kind> {
	protected readonly _kind
	protected readonly _value

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

export class Holder extends Base<Kind.HOLDER> {
	constructor(value: string) {
		super(Kind.HOLDER, value)
	}
}

export class Normal extends Base<Kind.NORMAL> {
	constructor(value: string) {
		super(Kind.NORMAL, value)
	}
}

export class Symbol extends Base<Kind.SYMBOL> {
	constructor(value: string) {
		super(Kind.SYMBOL, value)
	}
}

export class Value extends Base<Kind.VALUE> {
	constructor(value: string) {
		super(Kind.VALUE, value)
	}
}

export class Variable extends Base<Kind.VARIABLE> {
	constructor(value: string) {
		super(Kind.VARIABLE, value)
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type SubCmdToken = Holder | Normal | Symbol | Value | Variable
