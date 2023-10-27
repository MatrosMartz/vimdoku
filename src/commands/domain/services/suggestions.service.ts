import { COMMANDS_NAMES, type ISuggestion, type Suggestion } from '../models'

interface SuggestionsOpts {
	cmdStr: string
	desc: string
	id: string
}

/** Represent a Suggestions Service. */
export class SuggestionsService implements ISuggestion {
	#data: Suggestion
	#rgxStr: string

	/**
	 * Creates an instance of the ExecutorService class.
	 * @param opts Options for create Suggestion.
	 */
	constructor(opts: SuggestionsOpts)
	constructor({ cmdStr, desc, id }: SuggestionsOpts) {
		const [cmd, , opt, , arg] = cmdStr.split(/(\[)(\w+)(\]\s?)/)

		this.#rgxStr = SuggestionsService.#createRgxStr(cmd, opt, arg)
		const header = SuggestionsService.#createCmd(cmd, opt, arg)
		const input = SuggestionsService.#createInput(cmd, opt, arg)

		this.#data = { header, desc, id, input }
	}

	get data() {
		return this.#data
	}

	/**
	 * Generate the formatted command string for displaying in the suggestion.
	 * @param cmd The command part of the input string.
	 * @param opt The optional part of the input string.
	 * @param arg The argument part of the input string.
	 */
	static #createCmd(cmd: string, opt: string, arg: string) {
		const span = document.createElement('h3')
		const cmdSpan = SuggestionsService.#createSpan(cmd, 'command')
		const optSpan = SuggestionsService.#createSpan(opt, 'optional')
		cmdSpan.appendChild(optSpan)
		span.appendChild(cmdSpan)

		if (arg.length === 0) return span

		span.appendChild(document.createTextNode(' '))

		for (const section of arg.split(/(?=\{)|(?='[^']+')|(?=\()/)) {
			if (section == null || section.length === 0) continue
			if (/^'.*'$/.test(section)) span.appendChild(SuggestionsService.#createSpan(section.slice(1, -1), 'text'))
			else if (/^\{\w+\}$/.test(arg)) span.appendChild(SuggestionsService.#createSpan(section.slice(1, -1), 'holder'))
			else if (/^\(\w+\)$/.test(section)) span.appendChild(SuggestionsService.#createSpan(section.slice(1, -1), 'key'))
			else if (/^:\w+$/.test(section)) span.appendChild(SuggestionsService.#createSpan(section, 'command'))
			else if (/^<\w+>/.test(section)) span.appendChild(SuggestionsService.#createSpan(section.slice(1, -1), 'special'))
			else span.appendChild(document.createTextNode(section))
		}

		return span
	}

	/**
	 * Generate the input command string for display in the suggestion.
	 * @param cmd The command part of the input string.
	 * @param opt The optional part of the input string.
	 * @param arg The argument part of the input string.
	 */
	static #createInput(cmd: string, opt: string, arg: string) {
		const optInput = opt.replace(/\[|\]/g, '')
		if (arg.length === 0 || /^\{\w+\}$/.test(arg)) return cmd + optInput
		const argInput = arg.replace(/[<>()]/g, '').replace(/(?:(?<=\w+[:=]")([^"]+"))|(?:(?<=\w+[:=]')([^']+'))/, '')

		return `${cmd}${optInput} ${argInput}`
	}

	/**
	 * Generate a regular expression string for matching commands.
	 * @param cmd The command part of the input string.
	 * @param opt The optional part of the input string.
	 * @param arg The argument part of the input string.
	 */
	static #createRgxStr(cmd: string, opt: string, arg: string) {
		const cmdRgx = `${cmd}(?:${opt})?`
		if (arg.length === 0 || /^\{\w+\}$/.test(arg)) return cmdRgx
		const parsedArg = arg
			.replace(/(?<=<)[^}]+(?=>)/g, match => `[${match}]*`)
			.replace(/\(\w+\)/g, match => `[${match.slice(1, -1)}]*`)
			.replace(/[<>]/g, '')
			.replace(/(?<=[:=]\]\*")[^"]+(?=")/, '\\w+"?')
			.replace(/(?<=[:=]\]\*')[^']+(?=')/, "\\w+'?")
		return `${cmdRgx} ${parsedArg}`
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

	match(cmd: string) {
		return new RegExp(this.#rgxStr).test(cmd)
	}
}

export const HELP_SUGGESTIONS: SuggestionsService[] = [
	...COMMANDS_NAMES.map(
		cmd =>
			new SuggestionsService({
				cmdStr: `h[elp] :${cmd}`,
				desc: `Open a window and display the help of ${cmd} command.`,
				id: `help-${cmd}`,
			})
	),
	new SuggestionsService({
		cmdStr: 'h[elp] {subject}',
		desc: 'Like ":help", additionally jump to the tag {subject}.',
		id: 'help-subject',
	}),
	new SuggestionsService({
		cmdStr: 'h[elp]',
		desc: 'Open dialog and display the help file in read-only mode.',
		id: 'help',
	}),
]

export const ALL_SUGGESTIONS = [...HELP_SUGGESTIONS]
