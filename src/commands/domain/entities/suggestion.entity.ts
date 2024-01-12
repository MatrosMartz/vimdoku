interface SuggOpts {
	cmdStr: string
	descriptions: string | [string, ...string[]]
	id: string
}

export class Sugg {
	readonly #descriptions
	readonly #header
	readonly #id
	readonly #input
	readonly #rgxStr

	/**
	 * Creates an instance of the Sugg class.
	 * @param opts Options for create Suggestion.
	 */
	constructor(opts: SuggOpts)
	constructor({ cmdStr, descriptions, id }: SuggOpts) {
		const [cmd, opt, arg = ''] = cmdStr.split(/(\[\w+\] ?)/)
		const parseOpt = opt.replace(/(\[|\]|\s)/g, '')

		this.#rgxStr = Sugg.#createRgxStr(cmd, parseOpt, arg)
		this.#header = Sugg.#createCmd(cmd, parseOpt, arg)
		this.#input = Sugg.#createInput(cmd, parseOpt, arg)
		this.#descriptions = Object.freeze<[string, ...string[]]>(
			Array.isArray(descriptions) ? descriptions : [descriptions]
		)
		this.#id = id
	}

	/** The Suggestion descriptions. */
	get descriptions() {
		return this.#descriptions
	}

	/** The Suggestion header element. */
	get header() {
		return this.#header
	}

	/** The Suggestion identifier. */
	get id() {
		return this.#id
	}

	/** The input value. */
	get input() {
		return this.#input
	}

	/**
	 * Create an Array of SuggestionSvc instances from another Array to be mapped.
	 * @param array The original array.
	 * @param fn Function to be executed for each iteration of the original array, and which returns the options to create an instance.
	 */
	static createArray<T>(array: T[], fn: (value: T) => SuggOpts) {
		return array.map(value => new Sugg(fn(value)))
	}

	/**
	 * Generate the formatted command string for displaying in the suggestion.
	 * @param cmd The command part of the input string.
	 * @param opt The optional part of the input string.
	 * @param arg The argument part of the input string.
	 */
	static #createCmd(cmd: string, opt: string, arg: string) {
		const h3 = document.createElement('h3')
		h3.classList.add('monospace', 'highlight')
		const cmdSpan = Sugg.#createSpan(cmd, 'command')
		const optSpan = Sugg.#createSpan(opt, 'optional')
		cmdSpan.appendChild(optSpan)
		h3.appendChild(cmdSpan)

		if (arg.length === 0) return h3

		h3.appendChild(document.createTextNode(' '))

		for (const section of arg.split(/(?=\{)|(?='[^']+')|(?=\()|(?=<)/)) {
			if (section == null || section.length === 0) continue
			if (/^'.*'$/.test(section)) h3.appendChild(Sugg.#createSpan(section.slice(1, -1), 'text'))
			else if (/^\{\w+\}$/.test(arg)) h3.appendChild(Sugg.#createSpan(section.slice(1, -1), 'holder'))
			else if (/^\(\w+\)$/.test(section)) h3.appendChild(Sugg.#createSpan(section.slice(1, -1), 'value'))
			else if (/^:\w+$/.test(section)) h3.appendChild(Sugg.#createSpan(section.slice(1), 'command'))
			else if (/^<[^>]*>$/.test(section)) h3.appendChild(Sugg.#createSpan(section.slice(1, -1), 'special'))
			else h3.appendChild(document.createTextNode(section))
		}

		return h3
	}

	/**
	 * Generate the input command string for display in the suggestion.
	 * @param cmd The command part of the input string.
	 * @param opt The optional part of the input string.
	 * @param arg The argument part of the input string.
	 */
	static #createInput(cmd: string, opt: string, arg: string) {
		const optInput = opt.replace(/\[|\]/g, '')
		if (arg.length === 0) return cmd + optInput
		if (/^\{[^}]+\}$/.test(arg)) return cmd + optInput + ' '
		const argInput = arg.replace(/[<>()]/g, '').replace(/(?:(?<=\w+[:=]")([^"]+"))|(?:(?<=\w+[:=]')('[^']+'))/, '')

		return `${cmd}${optInput} ${argInput}`
	}

	/**
	 * Generate a regular expression string for matching commands.
	 * @param cmd The command part of the input string.
	 * @param opt The optional part of the input string.
	 * @param arg The argument part of the input string.
	 */
	static #createRgxStr(cmd: string, opt: string, arg: string) {
		const cmdRgx = '^' + cmd[0] + this.#optionally(cmd.slice(1) + opt)
		if (arg.length === 0 || /^\{\w+\}$/.test(arg)) return cmdRgx + '$'
		const parsedArg = arg
			.replace(/[&?:]/, match => '\\' + match)
			.replace(/^('[^']+')|("[^"]+")$/, this.#optionally)
			.replace(/\\:\w+/, this.#optionally)
			.replace(/\(\w+\)|<[^>]+>/g, match => this.#optionally(match.slice(1, -1)))
			.replace(/(?<=[:=]\?")[^"]+"?/, '\\w+"?')
			.replace(/(?<=[:=]\?')[^']+'?/, "\\w+'?")
		return `${cmdRgx} ${parsedArg}$`
	}

	/**
	 * Create a DOM span element with the specified text and optional CSS class.
	 * @param text The text content of the span element.
	 * @param type Optional CSS class to apply to the span element.
	 */
	static #createSpan(text: string, type?: string) {
		const span = document.createElement('span')
		if (type != null) span.classList.add(type)
		span.textContent = text

		return span
	}

	/**
	 * Generate a regular expression string for matching words.
	 * @param str The input string.
	 */
	static #optionally(str: string) {
		return str.split(/(?<!\\)/).reduceRight((acc, curr) => `(${curr}${acc}?)`) + '?'
	}

	/**
	 * Check if the given command matches the suggestion based on the regular expression.
	 * @param cmd The command to be matched.
	 * @returns True if the command matches the suggestion, otherwise false.
	 */
	match(cmd: string) {
		return new RegExp(this.#rgxStr).test(cmd)
	}
}
