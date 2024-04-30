import { Collection } from '~/share/domain/entities'

export enum Kind {
	beginner = '1.92',
	basic = '1.87',
	easy = '1.75',
	medium = '1.5',
	advanced = '1.4',
	hard = '1.3',
	expert = '1.2',
}

/* eslint-disable @typescript-eslint/no-redeclare, import/export */
export const KINDS = Collection.create().addEntries(Collection.entriesByObj(Kind)).done()
export declare module KINDS {
	type Entry = typeof KINDS extends Collection.Composite<infer Entry, any> ? Entry : never
	type Key = Entry[0]
	type Value = Entry[1]
}
