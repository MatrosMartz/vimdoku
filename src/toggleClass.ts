interface ClassMatches<T> {
	default: T
	main: T
	media: string
}

export function toggleClass<T>(value: T, matches: ClassMatches<T>, className: string) {
	if (value === matches.main || (value === matches.default && window.matchMedia(matches.media).matches))
		document.documentElement.classList.add(className)
	else document.documentElement.classList.remove(className)
}
