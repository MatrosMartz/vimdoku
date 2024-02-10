import { match } from '~/share/utils'
import { CmdTokenKind, SubTokenKind } from '$cmd/domain/entities'
import { CmdListSvc, CmdSvc, type CreateHeader, SubCmdSvc } from '$cmd/domain/services'
import { PREFS_ACTIONS, SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services/actions.service'
import { NON_TOGGLE_NAMES, PREFS_NAMES, TOGGLE_NAMES } from '$pref/domain/models'
import { ACCESSIBILITY_KINDS, COLOR_SCHEMAS, ICON_THEMES, LANGS } from '$pref/domain/models/user.model'
import { DialogKind } from '$screen/domain/models'
import { DIFFICULTIES_NAMES, DifficultyKind } from '$sudoku/domain/models'

import { med } from './mediator.service'

/**
 * Create a DOM span element with the specified text and optional CSS class.
 * @param className Optional CSS class to apply to the span element.
 * @param text The text content of the span element.
 * @returns Span element
 */
function createSpan(className: string, text?: string) {
	const span = document.createElement('span')
	span.classList.add(className)
	if (text != null) span.textContent = text

	return span
}

export const createHeader: CreateHeader<HTMLHeadingElement> = ([cmdToken, subTokens]) => {
	const heading = document.createElement('h3')
	heading.classList.add('monospace', 'highlight')

	const cmdSpan = createSpan('command')
	for (const { kind, value } of cmdToken.tokens) {
		cmdSpan.appendChild(
			match(kind)
				.case(CmdTokenKind.OPTIONAL, () => createSpan('optional', value))
				.case(CmdTokenKind.REQUIRED, () => document.createTextNode(value))
				.done()
		)
	}

	const fragment = document.createDocumentFragment()
	for (const { kind, value } of subTokens.tokens) {
		fragment.appendChild(
			match(kind)
				.case([SubTokenKind.HOLDER, SubTokenKind.VARIABLE], () => createSpan('holder', value))
				.case(SubTokenKind.SYMBOL, () => createSpan('symbol', value))
				.case(SubTokenKind.VALUE, () => createSpan('value', value))
				.default(() => document.createTextNode(value))
				.done()
		)
	}
	heading.append(cmdSpan, ' ', fragment)

	return heading
}

const SET_CMD = CmdSvc.create('se[t]', {
	desc: i18n => i18n.get('cmdDesc-set-showAll', 'Show all preferences that differ from their default value.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.PrefDiff }),
})
	.sub(
		SubCmdSvc.create('{preference}', {
			desc: [
				i18n => i18n.get('cmdDesc-set-suggest-1', 'Toggle preference: Set, switch it on preference.'),
				i18n => i18n.get('cmdDesc-set-suggest-2', 'String or Number preference: Show value of preference'),
			],
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<?>', {
			desc: i18n => i18n.get('cmdDesc-set-showSuggest', 'Show value of {preference}.'),
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<&>', {
			desc: i18n => i18n.get('cmdDesc-set-resetSuggest', "Reset option to it's default value."),
		})
	)
	.sub(
		SubCmdSvc.create('<no>{preference}', {
			desc: i18n => i18n.get('cmdDesc-set-toggleInvSuggest', 'Toggle preference: Set, switch it off.'),
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<!>', {
			desc: i18n => i18n.get('cmdDesc-set-toggleInvSuggest', 'Toggle preference: Set, Invert value.'),
		})
	)
	.sub(
		SubCmdSvc.create('<inv>{preference}', {
			desc: i18n => i18n.get('cmdDesc-set-toggleInvSuggest', 'Toggle preference: Set, Invert value.'),
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<=>{value}', {
			desc: i18n =>
				i18n.get('cmdDesc-set-setNonToggleSuggest', 'String or Number preference: Assign to {preference} the {value}.'),
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<:>{value}', {
			desc: i18n =>
				i18n.get('cmdDesc-set-setNonToggleSuggest', 'String or Number preference: Assign to {preference} the {value}.'),
		})
	)
	.sub(
		SubCmdSvc.create('<all>', {
			desc: i18n => i18n.get('cmdDesc-set-showAll', 'Show all preferences.'),
			fn: () => med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.PrefAll }),
		})
	)
	.sub(
		SubCmdSvc.create('<all><&>', {
			desc: i18n => i18n.get('cmdDesc-set-resetAll', 'Reset all preferences.'),
			fn: () => med.dispatch(PREFS_ACTIONS.reset, { type: 'all' }),
		})
	)
	.subFromArray(PREFS_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<?>`, {
			desc: i18n => i18n.getTemplate('cmdDesc-set-showPref', { head: 'Show value of ', tail: '.' }, pref),
			fn: () => med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.ShowPref, opts: { pref } }),
		})
	)
	.subFromArray(PREFS_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<&>`, {
			desc: i18n => i18n.getTemplate('cmdDesc-set-resetPref', { head: 'Reset value of ', tail: '.' }, pref),
			fn: () => med.dispatch(PREFS_ACTIONS.reset, { type: 'by-key', key: pref }),
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})`, {
			desc: i18n => i18n.getTemplate('cmdDesc-set-toggleOnPref', { head: 'Set, ', tail: ' switch it on.' }, pref),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: pref, value: true }),
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})`, {
			desc: i18n => i18n.getTemplate('cmdDesc-set-showNonToggle', { head: 'Show value of ', tail: '.' }, pref),
			fn: () => med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.ShowPref, opts: { pref } }),
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`<no>(${pref})`, {
			desc: i18n => i18n.getTemplate('cmdDesc-set-toggleOffPref', { head: 'Set, ', tail: ' switch it off.' }, pref),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: pref, value: false }),
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<!>`, {
			desc: i18n => i18n.getTemplate('cmdDesc-set-toggleInvPref', { head: 'Set, ', tail: ' invert value.' }, pref),
			fn: () => med.dispatch(PREFS_ACTIONS.invert, { pref }),
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`<inv>(${pref})`, {
			desc: i18n => i18n.getTemplate('cmdDesc-set-toggleInvPref', { head: 'Set, ', tail: ' invert value.' }, pref),
			fn: () => med.dispatch(PREFS_ACTIONS.invert, { pref }),
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<=>{value}`, {
			desc: i18n =>
				i18n.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, pref),
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<:>{value}`, {
			desc: i18n =>
				i18n.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, pref),
		})
	)
	.subFromArray(LANGS, lang =>
		SubCmdSvc.create(`(language)<=>(${lang})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'language')
					.replace('{value}', `"${lang}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'language', value: lang }),
		})
	)
	.subFromArray(LANGS, lang =>
		SubCmdSvc.create(`(language)<:>(${lang})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'language')
					.replace('{value}', `"${lang}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'language', value: lang }),
		})
	)
	.subFromArray(COLOR_SCHEMAS, schema =>
		SubCmdSvc.create(`(colorSchema)<=>(${schema})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'colorSchema')
					.replace('{value}', `"${schema}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'colorSchema', value: schema }),
		})
	)
	.subFromArray(COLOR_SCHEMAS, schema =>
		SubCmdSvc.create(`(colorSchema)<:>(${schema})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'colorSchema')
					.replace('{value}', `"${schema}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'colorSchema', value: schema }),
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(contrast)<=>(${accessibility})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'contrast')
					.replace('{value}', `"${accessibility}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'contrast', value: accessibility }),
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(contrast)<:>(${accessibility})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'contrast')
					.replace('{value}', `"${accessibility}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'contrast', value: accessibility }),
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(motionReduce)<=>(${accessibility})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'motionReduce')
					.replace('{value}', `"${accessibility}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'motionReduce', value: accessibility }),
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(motionReduce)<:>(${accessibility})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'motionReduce')
					.replace('{value}', `"${accessibility}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'motionReduce', value: accessibility }),
		})
	)
	.subFromArray(ICON_THEMES, theme =>
		SubCmdSvc.create(`(iconTheme)<=>(${theme})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'iconTheme')
					.replace('{value}', `"${theme}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'iconTheme', value: theme }),
		})
	)
	.subFromArray(ICON_THEMES, theme =>
		SubCmdSvc.create(`(iconTheme)<:>(${theme})`, {
			desc: i18n =>
				i18n
					.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'iconTheme')
					.replace('{value}', `"${theme}"`),
			fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'iconTheme', value: theme }),
		})
	)
	.sub(
		SubCmdSvc.create('(history)<=>{|value|}', {
			desc: i18n =>
				i18n.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'history'),
			fn: ({ value }) => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'history', value }),
		})
	)
	.sub(
		SubCmdSvc.create('(history)<:>{|value|}', {
			desc: i18n =>
				i18n.getTemplate('cmdDesc-set-setNonTogglePref', { head: 'Assign to ', tail: ' the {value}.' }, 'history'),
			fn: ({ value }) => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'history', value }),
		})
	)
	.done()

const START_CMD = CmdSvc.create('st[art]', {
	desc: i18n =>
		i18n.getTemplate('cmdDesc-start-difficulty', { head: 'Start new game with ', tail: ' difficulty.' }, 'Easy'),
	fn: () => med.dispatch(SUDOKU_ACTIONS.start, { difficulty: DifficultyKind.Easy }),
})
	.sub(
		SubCmdSvc.create('{difficulty}', {
			desc: i18n => i18n.get('cmdDesc-start-subject', 'Start new game with the selected difficulty.'),
		})
	)
	.subFromArray(DIFFICULTIES_NAMES, difficulty =>
		SubCmdSvc.create(`(${difficulty})`, {
			desc: i18n =>
				i18n.getTemplate(
					'cmdDesc-start-difficulty',
					{ head: 'Start new game with ', tail: ' difficulty.' },
					difficulty
				),
			fn: () => med.dispatch(SUDOKU_ACTIONS.start, { difficulty: DifficultyKind[difficulty] }),
		})
	)
	.done()
const PAUSE_CMD = CmdSvc.create('pa[use]', {
	desc: i18n => i18n.get('cmdDesc-pause', 'Pause current game.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.Pause }),
}).done()

const WRITE_CMD = CmdSvc.create('w[rite]', {
	desc: i18n => i18n.get('cmdDesc-write', 'Save current game.'),
	fn: () => med.dispatch(SUDOKU_ACTIONS.save),
}).done()

const RESUME_CMD = CmdSvc.create('re[sume]', {
	desc: [
		i18n => i18n.get('cmdDesc-resume-1', 'Resume the current game.'),
		i18n => i18n.get('cmdDesc-resume-2', 'Resume the saved game only if no game active.'),
	],
	fn: () => med.dispatch(SUDOKU_ACTIONS.resume),
}).done()

const QUIT_CMD = CmdSvc.create('q[uit]', {
	desc: i18n => i18n.get('cmdDesc-quit', 'Close the current windows.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.close),
}).done()

const WQUIT_CMD = CmdSvc.create('wq[uit]', {
	desc: i18n => i18n.get('cmdDesc-write', 'Save the current game and close the windows.'),
	fn: () => med.dispatch(SUDOKU_ACTIONS.save).dispatch(SCREEN_ACTIONS.close),
}).done()

const XIT_CMD = CmdSvc.create('x[it]', {
	desc: i18n => i18n.get('cmdDesc-writeLike', 'Like ":wq", but save only when changes have been made.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.close),
}).done()

const EXIT_CMD = CmdSvc.create('exi[t]', {
	desc: i18n => i18n.get('cmdDesc-writeLike', 'Like ":wq", but save only when changes have been made.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.close),
}).done()

const HELP_CMD = CmdSvc.create('h[elp]', {
	desc: i18n => i18n.get('cmdDesc-help-main', 'Open dialog and display the help file in read-only mode.'),
	// TODO: fn() {},
})
	.sub(
		SubCmdSvc.create('{subject}', {
			desc: i18n => i18n.get('cmdDesc-help-suggest', 'Like ":help", additionally jump to the tag {subject}.'),
			// TODO: fn() {},
		})
	)
	.subFromArray(['set', 'start', 'pause', 'write', 'resume', 'quit', 'wquit', 'xit', 'exit', 'help'], cmd =>
		SubCmdSvc.create(`<:>(${cmd})`, {
			desc: i18n =>
				i18n.getTemplate(
					'cmdDesc-help-withArg',
					{ head: 'Open a window and display the help of ', tail: ' command.' },
					cmd
				),
			// TODO: fn() {},
		})
	)
	.done()

export const cmdList = CmdListSvc.create(createHeader)
	.cmd(SET_CMD)
	.cmd(START_CMD)
	.cmd(PAUSE_CMD)
	.cmd(WRITE_CMD)
	.cmd(RESUME_CMD)
	.cmd(QUIT_CMD)
	.cmd(WQUIT_CMD)
	.cmd(XIT_CMD)
	.cmd(EXIT_CMD)
	.cmd(HELP_CMD)
	.done()

// 	new Sugg({
// 		cmdStr: 'q[uit]<!>',
// 		descriptions: 'Close without save, also when the current game has changes.',
// 		id: 'quit-unsave',
// 	}),
