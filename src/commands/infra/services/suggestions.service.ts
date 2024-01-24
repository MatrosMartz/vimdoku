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
		cmdStr: 'h[elp]',
		descriptions: 'Open dialog and display the help file in read-only mode.',
		id: 'help-main',
	}),
	new Sugg({
		cmdStr: 'h[elp] {subject}',
		descriptions: 'Like ":help", additionally jump to the tag {subject}.',
		id: 'help-subject',
	}),
]

export const SET_SUGGS: Sugg[] = [
	new Sugg({
		cmdStr: 'se[t] <all>',
		descriptions: 'Show all preferences.',
		id: 'set-show-all',
	}),
	new Sugg({
		cmdStr: 'se[t] <all><&>',
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
	...Sugg.createArray(NON_TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})`,
		descriptions: `Show value of ${pref}.`,
		id: `set-show-b-${pref}`,
	})),
	...Sugg.createArray(TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] <no>(${pref})`,
		descriptions: `Reset, ${pref} switch it off.`,
		id: `set-switch-off-${pref}`,
	})),
	...Sugg.createArray(TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})<!>`,
		descriptions: `${pref} invert value.`,
		id: `set-switch-excl-${pref}`,
	})),
	...Sugg.createArray(TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] <inv>(${pref})`,
		descriptions: `${pref} invert value.`,
		id: `set-switch-invert-${pref}`,
	})),
	...Sugg.createArray(NON_TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})<=>value`,
		descriptions: `Assing to ${pref} the {value}.`,
		id: `set-assign-eql-${pref}`,
	})),
	...Sugg.createArray(NON_TOGGLE_NAMES, pref => ({
		cmdStr: `se[t] (${pref})<:>value`,
		descriptions: `Assign to ${pref} the {value}.`,
		id: `set-assign-col-${pref}`,
	})),
	new Sugg({
		cmdStr: 'se[t]',
		descriptions: 'Show all preferences that differ from their default value.',
		id: 'set-show-differ',
	}),
	new Sugg({
		cmdStr: 'se[t] {preference}',
		descriptions: [
			'Toggle preference: Set, switch it on preference.',
			'String or Number preference: Show value of preference',
		],
		id: 'set-switch-on-show',
	}),
	new Sugg({
		cmdStr: 'se[t] {preference}<?>',
		descriptions: 'Show value of {preference}.',
		id: 'set-show-holder',
	}),
	new Sugg({
		cmdStr: 'se[t] {preference}<&>',
		descriptions: "Reset option to it's default value.",
		id: 'set-reset-holder',
	}),
	new Sugg({
		cmdStr: 'se[t] <no>{preference}',
		descriptions: 'Toggle preference: Reset, switch it off.',
		id: 'set-switch-off-holer',
	}),
	new Sugg({
		cmdStr: 'se[t] {preference}<!>',
		descriptions: 'Toggle preference: Invert value.',
		id: 'set-switch-excl-holder',
	}),
	new Sugg({
		cmdStr: 'se[t] <inv>{preference}',
		descriptions: 'Toggle preference: Invert value.',
		id: 'set-switch-invert-holder',
	}),
	new Sugg({
		cmdStr: 'se[t] {preference}<=>{value}',
		descriptions: 'String or Number preference: Assign to {pref} the {value}.',
		id: 'set-assign-eql-holder',
	}),
	new Sugg({
		cmdStr: 'se[t] {preference}<:>{value}',
		descriptions: 'String or Number preference: Assign to {pref} the {value}.',
		id: 'set-assign-col-holder',
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
	new Sugg({
		cmdStr: 'q[uit]',
		descriptions: 'Close the current windows.',
		id: 'quit',
	}),
	new Sugg({
		cmdStr: 'q[uit]<!>',
		descriptions: 'Close without save, also when the current game has changes.',
		id: 'quit-unsave',
	}),
	new Sugg({
		cmdStr: 'wq[uit]',
		descriptions: 'Save the current game and close the windows.',
		id: 'quit-save',
	}),
	new Sugg({
		cmdStr: 'x[it]',
		descriptions: 'Like ":wq", but save only when changes have been made.',
		id: 'xit',
	}),
	new Sugg({
		cmdStr: 'exi[t]',
		descriptions: 'Like ":wq", but save only when changes have been made.',
		id: 'xit',
	}),
]

export const ALL_SUGGS = HELP_SUGGS.concat(SET_SUGGS, GAME_SUGGS)
