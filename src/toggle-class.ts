interface ClassMatches<T> {
	default: T
	main: T
	media: string
}

/**
 * Add or remove class to document if preferences match.
 * @param value The current value
 * @param matches Matches object.
 * @param className The name of class.
 */
export function toggleClass<T>(value: T, matches: ClassMatches<T>, className: string) {
	if (value === matches.main || (value === matches.default && window.matchMedia(matches.media).matches))
		document.documentElement.classList.add(className)
	else document.documentElement.classList.remove(className)
}
