import { COMMANDS_NAMES } from '$cmd/domain/models'
import { SuggestionService } from '$cmd/domain/services'
import { NON_TOGGLE_NAMES, PREFERENCES_NAMES, TOGGLE_NAMES } from '$pref/domain/models'
import { DIFFICULTIES_NAMES } from '$sudoku/domain/models'

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
	...SuggestionService.createArray(PREFERENCES_NAMES, pref => ({
		cmdStr: `se[t] (${pref})<?>`,
		descriptions: `Show value of ${pref}.`,
		id: `set-show-a-${pref}`,
	})),
	...SuggestionService.createArray(PREFERENCES_NAMES, pref => ({
		cmdStr: `set[t] (${pref})<&>`,
		descriptions: `Reset value of ${pref}`,
		id: `set-reset-${pref}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t] {preference}<&>',
		descriptions: "Reset option to it's default value.",
		id: 'set-reset-preference',
	}),
	...SuggestionService.createArray(TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})`,
		descriptions: `Set, ${pref} switch it on.`,
		id: `set-switch-on-${pref}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t] {preference}',
		descriptions: [
			'Toggle preference: Set, switch it on preference.',
			'String or Number preference: Show value of preference',
		],
		id: 'set-switch-on-show',
	}),
	...SuggestionService.createArray(NON_TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})`,
		descriptions: `Show value of ${pref}.`,
		id: `set-show-b-${pref}`,
	})),
	new SuggestionService({
		cmdStr: 'se[t]',
		descriptions: 'Show all preferences that differ from their default value.',
		id: 'set-show-differ',
	}),
]

export const GAME_SUGGESTIONS: SuggestionService[] = [
	...SuggestionService.createArray(DIFFICULTIES_NAMES, difficulty => ({
		cmdStr: `st[art] (${difficulty})`,
		descriptions: `Start new game with the "${difficulty}" difficulty.`,
		id: `start-${difficulty}`,
	})),
	new SuggestionService({
		cmdStr: 'st[art] {difficulty}',
		descriptions: 'Start new game with the selected difficulty.',
		id: 'start-difficulty',
	}),
	new SuggestionService({
		cmdStr: 'pa[use]',
		descriptions: 'Pause current game.',
		id: 'pause',
	}),
	new SuggestionService({
		cmdStr: 'w[rite]',
		descriptions: 'Save current game.',
		id: 'write',
	}),
	new SuggestionService({
		cmdStr: 're[sume]',
		descriptions: ['Resume the current game.', 'Resume the saved game only if no game active.'],
		id: 'resume',
	}),
]

export const ALL_SUGGESTIONS = HELP_SUGGESTIONS.concat(SET_SUGGESTIONS, GAME_SUGGESTIONS)
