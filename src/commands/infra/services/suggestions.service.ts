import { Sugg } from '$cmd/domain/entities'
import { COMMANDS_NAMES } from '$cmd/domain/models'
import { NON_TOGGLE_NAMES, PREFS_NAMES, TOGGLE_NAMES } from '$pref/domain/models'
import { DIFFICULTIES_NAMES } from '$sudoku/domain/models'

export const HELP_SUGGS: Sugg[] = [
	...Sugg.createArray(COMMANDS_NAMES, cmd => ({
		cmdStr: `h[elp] :${cmd}`,
		descriptions: `Open a window and display the help of ${cmd} command.`,
		id: `help-cmd-${cmd}`,
	})),
	new Sugg({
		cmdStr: 'h[elp] {subject}',
		descriptions: 'Like ":help", additionally jump to the tag {subject}.',
		id: 'help-subject',
	}),
	new Sugg({
		cmdStr: 'h[elp]',
		descriptions: 'Open dialog and display the help file in read-only mode.',
		id: 'help-main',
	}),
]

export const SET_SUGGS: Sugg[] = [
	new Sugg({
		cmdStr: 'se[t] <all>',
		descriptions: 'Show all preferences.',
		id: 'set-show-all',
	}),
	new Sugg({
		cmdStr: 'se[t] <all&>',
		descriptions: 'Reset all preferences',
		id: 'set-reset-all',
	}),
	...Sugg.createArray(PREFS_NAMES, pref => ({
		cmdStr: `se[t] (${pref})<?>`,
		descriptions: `Show value of ${pref}.`,
		id: `set-show-a-${pref}`,
	})),
	...Sugg.createArray(PREFS_NAMES, pref => ({
		cmdStr: `set[t] (${pref})<&>`,
		descriptions: `Reset value of ${pref}`,
		id: `set-reset-${pref}`,
	})),
	new Sugg({
		cmdStr: 'se[t] {preference}<&>',
		descriptions: "Reset option to it's default value.",
		id: 'set-reset-preference',
	}),
	...Sugg.createArray(TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})`,
		descriptions: `Set, ${pref} switch it on.`,
		id: `set-switch-on-${pref}`,
	})),
	new Sugg({
		cmdStr: 'se[t] {preference}',
		descriptions: [
			'Toggle preference: Set, switch it on preference.',
			'String or Number preference: Show value of preference',
		],
		id: 'set-switch-on-show',
	}),
	...Sugg.createArray(NON_TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})`,
		descriptions: `Show value of ${pref}.`,
		id: `set-show-b-${pref}`,
	})),
	new Sugg({
		cmdStr: 'se[t]',
		descriptions: 'Show all preferences that differ from their default value.',
		id: 'set-show-differ',
	}),
]

export const GAME_SUGGS: Sugg[] = [
	...Sugg.createArray(DIFFICULTIES_NAMES, difficulty => ({
		cmdStr: `st[art] (${difficulty})`,
		descriptions: `Start new game with the "${difficulty}" difficulty.`,
		id: `start-${difficulty}`,
	})),
	new Sugg({
		cmdStr: 'st[art] {difficulty}',
		descriptions: 'Start new game with the selected difficulty.',
		id: 'start-difficulty',
	}),
	new Sugg({
		cmdStr: 'pa[use]',
		descriptions: 'Pause current game.',
		id: 'pause',
	}),
	new Sugg({
		cmdStr: 'w[rite]',
		descriptions: 'Save current game.',
		id: 'write',
	}),
	new Sugg({
		cmdStr: 're[sume]',
		descriptions: ['Resume the current game.', 'Resume the saved game only if no game active.'],
		id: 'resume',
	}),
]

export const ALL_SUGGS = HELP_SUGGS.concat(SET_SUGGS, GAME_SUGGS)
