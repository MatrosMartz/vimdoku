import { NON_TOGGLE_NAMES, PREFERENCES_NAMES, TOGGLE_NAMES } from '$preferences/domain/models'

import { COMMANDS_NAMES, type ISuggestion, type Suggestion } from '../models'

interface SuggestionsOpts {
	cmdStr: string
	desc: string
	id: string
}

/** Represent a Suggestions Service. */
export class SuggestionService implements ISuggestion {
	#data: Suggestion
	#rgxStr: string

	/**
	 * Creates an instance of the ExecutorService class.
	 * @param opts Options for create Suggestion.
	 */
	constructor(opts: SuggestionsOpts)
	constructor({ cmdStr, desc, id }: SuggestionsOpts) {
		const [cmd, , opt, , arg] = cmdStr.split(/(\[)(\w+)(\]\s?)/)

		this.#rgxStr = SuggestionService.#createRgxStr(cmd, opt, arg)
		const header = SuggestionService.#createCmd(cmd, opt, arg)
		const input = SuggestionService.#createInput(cmd, opt, arg)

		const action = /\{[^}]\}/.test(arg) ? 'replace' : 'execute'

		this.#data = { action, header, desc, id, input }
	}

	get data() {
		return this.#data
	}

	/**
	 * Create an Array of SuggestionService instances from another Array to be mapped.
	 * @param array The original array.
	 * @param fn Function to be executed for each iteration of the original array, and which returns the options to create an instance.
	 */
	static createArray<T>(array: T[], fn: (value: T) => SuggestionsOpts) {
		return array.map(value => new SuggestionService(fn(value)))
	}

	/**
	 * Generate the formatted command string for displaying in the suggestion.
	 * @param cmd The command part of the input string.
	 * @param opt The optional part of the input string.
	 * @param arg The argument part of the input string.
	 */
	static #createCmd(cmd: string, opt: string, arg: string) {
		const h3 = document.createElement('h3')
		const cmdSpan = SuggestionService.#createSpan(cmd, 'command')
		const optSpan = SuggestionService.#createSpan(opt, 'optional')
		cmdSpan.appendChild(optSpan)
		h3.appendChild(cmdSpan)

		if (arg.length === 0) return h3

		h3.appendChild(document.createTextNode(' '))

		for (const section of arg.split(/(?=\{)|(?='[^']+')|(?=\()|(?=<)/)) {
			if (section == null || section.length === 0) continue
			if (/^'.*'$/.test(section)) h3.appendChild(SuggestionService.#createSpan(section.slice(1, -1), 'text'))
			else if (/^\{\w+\}$/.test(arg)) h3.appendChild(SuggestionService.#createSpan(section.slice(1, -1), 'holder'))
			else if (/^\(\w+\)$/.test(section)) h3.appendChild(SuggestionService.#createSpan(section.slice(1, -1), 'key'))
			else if (/^:\w+$/.test(section)) h3.appendChild(SuggestionService.#createSpan(section.slice(1), 'command'))
			else if (/^<[^>]*>$/.test(section)) h3.appendChild(SuggestionService.#createSpan(section.slice(1, -1), 'special'))
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
		const cmdRgx = cmd[0] + this.#optionally(cmd.slice(1) + opt)
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

	match(cmd: string) {
		return new RegExp(this.#rgxStr).test(cmd)
	}
}

export const HELP_SUGGESTIONS: SuggestionService[] = [
	...SuggestionService.createArray(COMMANDS_NAMES, cmd => ({
		cmdStr: `h[elp] :${cmd}`,
		desc: `Open a window and display the help of ${cmd} command.`,
		id: `help-${cmd}`,
	})),
	new SuggestionService({
		cmdStr: 'h[elp] {subject}',
		desc: 'Like ":help", additionally jump to the tag {subject}.',
		id: 'help-subject',
	}),
	new SuggestionService({
		cmdStr: 'h[elp]',
		desc: 'Open dialog and display the help file in read-only mode.',
		id: 'help-main',
	}),
]

export const SET_SUGGESTIONS: SuggestionService[] = [
	new SuggestionService({
		cmdStr: 'se[t] <all>',
		desc: 'Show all preferences.',
		id: 'set-show-all',
	}),
	new SuggestionService({
		cmdStr: 'se[t] <all&>',
		desc: 'Reset all preferences',
		id: 'set-reset-all',
	}),
	...SuggestionService.createArray(PREFERENCES_NAMES, name => ({
		cmdStr: `se[t] (${name})<?>`,
		desc: `Show value of ${name}.`,
		id: `set-show-a-${name}`,
	})),
	...SuggestionService.createArray(PREFERENCES_NAMES, name => ({
		cmdStr: `set[t] (${name})<&>`,
		desc: `Reset value of ${name}`,
		id: `set-reset-${name}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t]] {preference}<&>',
		desc: "Reset option to it's default value.",
		id: 'set-reset-preference',
	}),
	...SuggestionService.createArray(TOGGLE_NAMES, name => ({
		cmdStr: `se[t] (${name})`,
		desc: `Set, ${name} switch it on.`,
		id: `set-switch-on-${name}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t] {preference}',
		desc: 'Toggle preference: Set, switch it on.',
		id: 'set-switch-on-preference',
	}),
	...SuggestionService.createArray(NON_TOGGLE_NAMES, name => ({
		cmdStr: `se[t] (${name})`,
		desc: `Show value of ${name}.`,
		id: `set-show-b-${name}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t] {preference}',
		desc: 'Show value of {preference}.',
		id: 'set-show-b-preference',
	}),
	new SuggestionService({
		cmdStr: 'se[t]',
		desc: 'Show all preferences that differ from their default value.',
		id: 'set-show-differ',
	}),
]

export const ALL_SUGGESTIONS = HELP_SUGGESTIONS.concat(SET_SUGGESTIONS)
