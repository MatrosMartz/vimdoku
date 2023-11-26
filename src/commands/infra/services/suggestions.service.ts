import { COMMANDS_NAMES } from '$cmd/domain/models'
import { SuggSvc } from '$cmd/domain/services'
import { NON_TOGGLE_NAMES, PREFS_NAMES, TOGGLE_NAMES } from '$pref/domain/models'
import { DIFFICULTIES_NAMES } from '$sudoku/domain/models'

export const HELP_SUGGS: SuggSvc[] = [
	...SuggSvc.createArray(COMMANDS_NAMES, cmd => ({
		cmdStr: `h[elp] :${cmd}`,
		descriptions: `Open a window and display the help of ${cmd} command.`,
		id: `help-cmd-${cmd}`,
	})),
	new SuggSvc({
		cmdStr: 'h[elp] {subject}',
		descriptions: 'Like ":help", additionally jump to the tag {subject}.',
		id: 'help-subject',
	}),
	new SuggSvc({
		cmdStr: 'h[elp]',
		descriptions: 'Open dialog and display the help file in read-only mode.',
		id: 'help-main',
	}),
]

export const SET_SUGGS: SuggSvc[] = [
	new SuggSvc({
		cmdStr: 'se[t] <all>',
		descriptions: 'Show all preferences.',
		id: 'set-show-all',
	}),
	new SuggSvc({
		cmdStr: 'se[t] <all&>',
		descriptions: 'Reset all preferences',
		id: 'set-reset-all',
	}),
	...SuggSvc.createArray(PREFS_NAMES, pref => ({
		cmdStr: `se[t] (${pref})<?>`,
		descriptions: `Show value of ${pref}.`,
		id: `set-show-a-${pref}`,
	})),
	...SuggSvc.createArray(PREFS_NAMES, pref => ({
		cmdStr: `set[t] (${pref})<&>`,
		descriptions: `Reset value of ${pref}`,
		id: `set-reset-${pref}`,
	})),
	new SuggSvc({
		cmdStr: 'se[t] {preference}<&>',
		descriptions: "Reset option to it's default value.",
		id: 'set-reset-preference',
	}),
	...SuggSvc.createArray(TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})`,
		descriptions: `Set, ${pref} switch it on.`,
		id: `set-switch-on-${pref}`,
	})),
	new SuggSvc({
		cmdStr: 'se[t] {preference}',
		descriptions: [
			'Toggle preference: Set, switch it on preference.',
			'String or Number preference: Show value of preference',
		],
		id: 'set-switch-on-show',
	}),
	...SuggSvc.createArray(NON_TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})`,
		descriptions: `Show value of ${pref}.`,
		id: `set-show-b-${pref}`,
	})),
	new SuggSvc({
		cmdStr: 'se[t]',
		descriptions: 'Show all preferences that differ from their default value.',
		id: 'set-show-differ',
	}),
]

export const GAME_SUGGS: SuggSvc[] = [
	...SuggSvc.createArray(DIFFICULTIES_NAMES, difficulty => ({
		cmdStr: `st[art] (${difficulty})`,
		descriptions: `Start new game with the "${difficulty}" difficulty.`,
		id: `start-${difficulty}`,
	})),
	new SuggSvc({
		cmdStr: 'st[art] {difficulty}',
		descriptions: 'Start new game with the selected difficulty.',
		id: 'start-difficulty',
	}),
	new SuggSvc({
		cmdStr: 'pa[use]',
		descriptions: 'Pause current game.',
		id: 'pause',
	}),
	new SuggSvc({
		cmdStr: 'w[rite]',
		descriptions: 'Save current game.',
		id: 'write',
	}),
	new SuggSvc({
		cmdStr: 're[sume]',
		descriptions: ['Resume the current game.', 'Resume the saved game only if no game active.'],
		id: 'resume',
	}),
]

export const ALL_SUGGS = HELP_SUGGS.concat(SET_SUGGS, GAME_SUGGS)
