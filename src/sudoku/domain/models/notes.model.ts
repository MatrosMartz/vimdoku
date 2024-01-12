import type { Tuple } from '~/share/types'

/** valid numbers for notes or cell values. */
export type ValidNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type NotesData = Tuple<ValidNumbers | null, 9>

export type NotesJSON = Tuple<ValidNumbers, 9>

export const EMPTY_NOTES = [null, null, null, null, null, null, null, null, null] as const

/** Represent the first 9 primes numbers. */
export const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23] as const
