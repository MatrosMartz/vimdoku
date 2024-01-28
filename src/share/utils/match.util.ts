import type { Entry } from '../types'
import { noop } from './commons.util'

interface Matcher<V, R = never> {
	/**
	 * Define one or more cases.
	 * @param c The one or more cases that may match.
	 * @param fn The function to be executed in case of matching.
	 */
	case<C extends V, CR>(
		c: C | C[],
		fn: () => CR
	): Exclude<V, C> extends never ? EndMatcher<R | CR> : Matcher<Exclude<V, C>, R | CR>
	/**
	 * Define default case.
	 * @param fn The function to execute if none of the above cases match.
	 */
	default<DR>(fn: () => DR): EndMatcher<R | DR>
}

interface EndMatcher<R> {
	/** The execution of the function coincided. */
	done(): R
}

interface Match {
	/**
	 * @param value The value to be matched.
	 * @returns The matcher.
	 */
	<T>(value: T): Matcher<T>
	/**
	 * @param value The string to be matched.
	 * @returns The regexp matcher.
	 */
	rgx(value: string): Matcher<string>
}

/**
 * Get matcher.
 * @param value The value to match.
 * @param entries With case as key and functions as values.
 * @param defaultFn The function if none of the above data matches.
 * @returns The return of the matched case function.
 */
function getMatcher<V, R = never>(
	value: V,
	entries: Array<[V, () => R]>,
	defaultFn: () => R
): Matcher<V> & EndMatcher<R> {
	return {
		case<C extends V, CR>(c: C | C[], fn: () => CR) {
			const cases = (Array.isArray(c) ? c : [c]).map(c => [c, fn] satisfies Entry)
			const newEntries = [...entries, ...cases]

			return getMatcher<V, R | CR>(value, newEntries, defaultFn) as any
		},
		default: <DR>(fn: () => DR) => getMatcher<V, R | DR>(value, entries, fn) as any,
		done() {
			return new Map(entries).get(value)?.() ?? defaultFn()
		},
	}
}

/**
 * Get regexp matcher.
 * @param value The regexp to match.
 * @param entries With case as key and functions as values.
 * @param defaultFn The function if none of the above data matches.
 * @returns The return of the matched case function.
 */
function getRgxMatcher<V extends string, R = never>(
	value: V,
	entries: Array<[V, () => R]>,
	defaultFn: () => R
): Matcher<V> & EndMatcher<R> {
	return {
		case<C extends V, CR>(c: C | C[], fn: () => CR) {
			const cases = (Array.isArray(c) ? c : [c]).map(c => [c, fn] satisfies Entry)
			const newEntries = [...entries, ...cases]

			return getRgxMatcher<V, R | CR>(value, newEntries, defaultFn) as any
		},
		default: <DR>(fn: () => DR) => getRgxMatcher<V, R | DR>(value, entries, fn) as any,
		done() {
			return entries.find(([key]) => new RegExp(key).test(value))?.[1]() ?? defaultFn()
		},
	}
}

const match: Match = value => getMatcher(value, [], noop)
match.rgx = value => getRgxMatcher(value, [], noop)

export { match }
