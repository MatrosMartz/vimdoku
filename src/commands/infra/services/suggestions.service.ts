import { COMMANDS_NAMES } from '$cmd/domain/models'
import { SuggestionService } from '$cmd/domain/services'
import { NON_TOGGLE_NAMES, PREFERENCES_NAMES, TOGGLE_NAMES } from '$preferences/domain/models'

export const HELP_SUGGESTIONS: SuggestionService[] = [
	...SuggestionService.createArray(COMMANDS_NAMES, cmd => ({
		cmdStr: `h[elp] :${cmd}`,
		descriptions: `Open a window and display the help of ${cmd} command.`,
		id: `help-cmd-${cmd}`,
	})),
	new SuggestionService({
		cmdStr: 'h[elp] {subject}',
		descriptions: 'Like ":help", additionally jump to the tag {subject}.',
		id: 'help-subject',
	}),
	new SuggestionService({
		cmdStr: 'h[elp]',
		descriptions: 'Open dialog and display the help file in read-only mode.',
		id: 'help-main',
	}),
]

export const SET_SUGGESTIONS: SuggestionService[] = [
	new SuggestionService({
		cmdStr: 'se[t] <all>',
		descriptions: 'Show all preferences.',
		id: 'set-show-all',
	}),
	new SuggestionService({
		cmdStr: 'se[t] <all&>',
		descriptions: 'Reset all preferences',
		id: 'set-reset-all',
	}),
	...SuggestionService.createArray(PREFERENCES_NAMES, name => ({
		cmdStr: `se[t] (${name})<?>`,
		descriptions: `Show value of ${name}.`,
		id: `set-show-a-${name}`,
	})),
	...SuggestionService.createArray(PREFERENCES_NAMES, name => ({
		cmdStr: `set[t] (${name})<&>`,
		descriptions: `Reset value of ${name}`,
		id: `set-reset-${name}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t] {preference}<&>',
		descriptions: "Reset option to it's default value.",
		id: 'set-reset-preference',
	}),
	...SuggestionService.createArray(TOGGLE_NAMES, name => ({
		cmdStr: `se[t] (${name})`,
		descriptions: `Set, ${name} switch it on.`,
		id: `set-switch-on-${name}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t] {preference}',
		descriptions: [
			'Toggle preference: Set, switch it on preference.',
			'String or Number preference: Show value of preference',
		],
		id: 'set-switch-on-show',
	}),
	...SuggestionService.createArray(NON_TOGGLE_NAMES, name => ({
		cmdStr: `se[t] (${name})`,
		descriptions: `Show value of ${name}.`,
		id: `set-show-b-${name}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t]',
		descriptions: 'Show all preferences that differ from their default value.',
		id: 'set-show-differ',
	}),
]

export const ALL_SUGGESTIONS = HELP_SUGGESTIONS.concat(SET_SUGGESTIONS)
