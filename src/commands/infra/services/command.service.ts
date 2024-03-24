import { match } from '~/share/utils'
import { CmdTokenKind, SubTokenKind } from '$cmd/domain/entities'
import { CmdListSvc, CmdSvc, type CreateHeader, SubCmdSvc } from '$cmd/domain/services'
import { I18N_ACTIONS, PREFS_ACTIONS, SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services/actions.service'
import { LANGS } from '$i18n/domain/const'
import { NON_TOGGLE_NAMES, PREFS_NAMES, TOGGLE_NAMES } from '$pref/domain/models'
import { ACCESSIBILITY_KINDS, COLOR_SCHEMAS, ICON_THEMES } from '$pref/domain/models/user.model'
import { Modal } from '$screen/domain/entities'
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

const SET_CMD = CmdSvc.buildFn('se[t]', {
	desc: i18n => i18n.ns('share').cmdDesc_set_showAll('Show all preferences that differ from their default value.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.openModal, { modal: Modal.createPref('show-differ') }),
})
	.addSubFn(
		SubCmdSvc.buildFn('{preference}', {
			desc: [
				i18n => i18n.ns('share').cmdDesc_set_suggest1('Toggle preference: Set, switch it on preference.'),
				i18n => i18n.ns('share').cmdDesc_set_suggest2('String or Number preference: Show value of preference'),
			],
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<?>', {
			desc: i18n => i18n.ns('share').cmdDesc_set_showSuggest('Show value of {preference}.'),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<&>', {
			desc: i18n => i18n.ns('share').cmdDesc_set_resetSuggest("Reset option to it's default value."),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<no>{preference}', {
			desc: i18n => i18n.ns('share').cmdDesc_set_toggleInvSuggest('Toggle preference: Set, switch it off.'),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<!>', {
			desc: i18n => i18n.ns('share').cmdDesc_set_toggleInvSuggest('Toggle preference: Set, Invert value.'),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<inv>{preference}', {
			desc: i18n => i18n.ns('share').cmdDesc_set_toggleInvSuggest('Toggle preference: Set, Invert value.'),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<=>{value}', {
			desc: i18n =>
				i18n
					.ns('share')
					.cmdDesc_set_setNonToggleSuggest('String or Number preference: Assign to {preference} the {value}.'),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<:>{value}', {
			desc: i18n =>
				i18n
					.ns('share')
					.cmdDesc_set_setNonToggleSuggest('String or Number preference: Assign to {preference} the {value}.'),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<all>', {
			desc: i18n => i18n.ns('share').cmdDesc_set_showAll('Show all preferences.'),
			fn: () => med.dispatch(SCREEN_ACTIONS.openModal, { modal: Modal.createPref('show-all') }),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<all><&>', {
			desc: i18n => i18n.ns('share').cmdDesc_set_resetAll('Reset all preferences.'),
			fn: () => med.dispatch(PREFS_ACTIONS.reset, { type: 'all' }),
		})
	)
	.addSubFn(
		...PREFS_NAMES.map(pref =>
			SubCmdSvc.buildFn(`(${pref})<?>`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_showPref('Show value of {|pref|}.', { pref }),
				// fn: () => med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.ShowPref, opts: { pref } }),
			})
		)
	)
	.addSubFn(
		...PREFS_NAMES.map(pref =>
			SubCmdSvc.buildFn(`(${pref})<&>`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_resetPref('Reset value of {|pref|}.', { pref }),
				fn: () => med.dispatch(PREFS_ACTIONS.reset, { type: 'by-key', key: pref }),
			})
		)
	)
	.addSubFn(
		...TOGGLE_NAMES.map(pref =>
			SubCmdSvc.buildFn(`(${pref})`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_toggleOnPref('Set, {|pref|} to switch it on.', { pref }),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: pref, value: true }),
			})
		)
	)
	.addSubFn(
		...NON_TOGGLE_NAMES.map(pref =>
			SubCmdSvc.buildFn(`(${pref})`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_showPref('Show value of {|pref|}.', { pref }),
				// fn: () => med.dispatch(SCREEN_ACTIONS.openModal, { kind: DialogKind.ShowPref, opts: { pref } }),
			})
		)
	)
	.addSubFn(
		...TOGGLE_NAMES.map(pref =>
			SubCmdSvc.buildFn(`<no>(${pref})`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_toggleOffPref('Set, {|pref|} to switch off.', { pref }),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: pref, value: false }),
			})
		)
	)
	.addSubFn(
		...TOGGLE_NAMES.map(pref =>
			SubCmdSvc.buildFn(`(${pref})<!>`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_toggleInvPref('Invert value of {|pref|}.', { pref }),
				fn: () => med.dispatch(PREFS_ACTIONS.invert, { pref }),
			})
		)
	)
	.addSubFn(
		...TOGGLE_NAMES.map(pref =>
			SubCmdSvc.buildFn(`<inv>(${pref})`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_toggleInvPref('Invert value of {|pref|}.', { pref }),
				fn: () => med.dispatch(PREFS_ACTIONS.invert, { pref }),
			})
		)
	)
	.addSubFn(
		...NON_TOGGLE_NAMES.map(pref =>
			SubCmdSvc.buildFn(`(${pref})<=>{value}`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref }),
			})
		)
	)
	.addSubFn(
		...NON_TOGGLE_NAMES.map(pref =>
			SubCmdSvc.buildFn(`(${pref})<:>{value}`, {
				desc: i18n => i18n.ns('share').cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref }),
			})
		)
	)
	.addSubFn(
		...COLOR_SCHEMAS.map(schema =>
			SubCmdSvc.buildFn(`(colorSchema)<=>(${schema})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'colorSchema' })
						.replace('{value}', `"${schema}"`),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'colorSchema', value: schema }),
			})
		)
	)
	.addSubFn(
		...COLOR_SCHEMAS.map(schema =>
			SubCmdSvc.buildFn(`(colorSchema)<:>(${schema})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'colorSchema' })
						.replace('{value}', `"${schema}"`),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'colorSchema', value: schema }),
			})
		)
	)
	.addSubFn(
		...ACCESSIBILITY_KINDS.map(accessibility =>
			SubCmdSvc.buildFn(`(contrast)<=>(${accessibility})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'contrast' })
						.replace('{value}', `"${accessibility}"`),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'contrast', value: accessibility }),
			})
		)
	)
	.addSubFn(
		...ACCESSIBILITY_KINDS.map(accessibility =>
			SubCmdSvc.buildFn(`(contrast)<:>(${accessibility})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'contrast' })
						.replace('{value}', `"${accessibility}"`),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'contrast', value: accessibility }),
			})
		)
	)
	.addSubFn(
		...ACCESSIBILITY_KINDS.map(accessibility =>
			SubCmdSvc.buildFn(`(motionReduce)<=>(${accessibility})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'motionReduce' })
						.replace('{value}', `"${accessibility}"`),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'motionReduce', value: accessibility }),
			})
		)
	)
	.addSubFn(
		...ACCESSIBILITY_KINDS.map(accessibility =>
			SubCmdSvc.buildFn(`(motionReduce)<:>(${accessibility})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'motionReduce' })
						.replace('{value}', `"${accessibility}"`),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'motionReduce', value: accessibility }),
			})
		)
	)
	.addSubFn(
		...ICON_THEMES.map(theme =>
			SubCmdSvc.buildFn(`(iconTheme)<=>(${theme})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'iconTheme' })
						.replace('{value}', `"${theme}"`),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'iconTheme', value: theme }),
			})
		)
	)
	.addSubFn(
		...ICON_THEMES.map(theme =>
			SubCmdSvc.buildFn(`(iconTheme)<:>(${theme})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'iconTheme' })
						.replace('{value}', `"${theme}"`),
				fn: () => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'iconTheme', value: theme }),
			})
		)
	)
	.addSubFn(
		SubCmdSvc.buildFn('(history)<=>{|value|}', {
			desc: i18n =>
				i18n.ns('share').cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'history' }),
			fn: ({ value }) => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'history', value }),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('(history)<:>{|value|}', {
			desc: i18n =>
				i18n.ns('share').cmdDesc_set_setNonTogglePref('Assign to {|pref|} the {value}.', { pref: 'history' }),
			fn: ({ value }) => med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: 'history', value }),
		})
	)
	.done()

const START_CMD = CmdSvc.buildFn('st[art]', {
	desc: i18n =>
		i18n
			.ns('share')
			.cmdDesc_start_difficulty('Start new game with the {|difficulty|} difficulty.', { difficulty: 'Easy' }),
	fn: () => med.dispatch(SUDOKU_ACTIONS.start, { difficulty: DifficultyKind.Easy }),
})
	.addSubFn(
		SubCmdSvc.buildFn('{difficulty}', {
			desc: i18n => i18n.ns('share').cmdDesc_start_subject('Start new game with the selected difficulty.'),
		})
	)
	.addSubFn(
		...DIFFICULTIES_NAMES.map(difficulty =>
			SubCmdSvc.buildFn(`(${difficulty})`, {
				desc: i18n =>
					i18n
						.ns('share')
						.cmdDesc_start_difficulty('Start new game with the {|difficulty|} difficulty.', { difficulty }),
				fn: () => med.dispatch(SUDOKU_ACTIONS.start, { difficulty: DifficultyKind[difficulty] }),
			})
		)
	)
	.done()
const PAUSE_CMD = CmdSvc.buildFn('pa[use]', {
	desc: i18n => i18n.ns('share').cmdDesc_pause('Pause current game.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.openModal, { modal: Modal.createPause() }),
}).done()

const WRITE_CMD = CmdSvc.buildFn('w[rite]', {
	desc: i18n => i18n.ns('share').cmdDesc_write('Save current game.'),
	fn: () => med.dispatch(SUDOKU_ACTIONS.save),
}).done()

const RESUME_CMD = CmdSvc.buildFn('re[sume]', {
	desc: [
		i18n => i18n.ns('share').cmdDesc_resume1('Resume the current game.'),
		i18n => i18n.ns('share').cmdDesc_resume2('Resume the saved game only if no game active.'),
	],
	fn: () => med.dispatch(SUDOKU_ACTIONS.resume),
}).done()

const QUIT_CMD = CmdSvc.buildFn('q[uit]', {
	desc: i18n => i18n.ns('share').cmdDesc_quit('Close the current windows.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.close),
}).done()

const WQUIT_CMD = CmdSvc.buildFn('wq[uit]', {
	desc: i18n => i18n.ns('share').cmdDesc_write('Save the current game and close the windows.'),
	fn: () => med.dispatch(SUDOKU_ACTIONS.save).dispatch(SCREEN_ACTIONS.close),
}).done()

const XIT_CMD = CmdSvc.buildFn('x[it]', {
	desc: i18n => i18n.ns('share').cmdDesc_writeLike('Like ":wq", but save only when changes have been made.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.close),
}).done()

const EXIT_CMD = CmdSvc.buildFn('exi[t]', {
	desc: i18n => i18n.ns('share').cmdDesc_writeLike('Like ":wq", but save only when changes have been made.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.close),
}).done()

const LANGUAGE_CMD = CmdSvc.buildFn('lan[guage]', {
	desc: i18n => i18n.ns('share').cmdDesc_language_show('Show the current value of language.'),
})
	.addSubFn(
		SubCmdSvc.buildFn('{lang}', {
			desc: i18n => i18n.ns('share').cmdDesc_language_set('Sets the current language to {lang}.'),
		})
	)
	.addSubFn(
		...LANGS.map(lang =>
			SubCmdSvc.buildFn(`(${lang})`, {
				desc: i18n => i18n.ns('share').cmdDesc_language_setSuggest('Sets the current language to {|lang|}.', { lang }),
				fn: () => med.dispatch(I18N_ACTIONS.changeLang, { lang }),
			})
		)
	)
	.done()

const HELP_CMD = CmdSvc.buildFn('h[elp]', {
	desc: i18n => i18n.ns('share').cmdDesc_help_main('Open dialog and display the help file in read-only mode.'),
	// TODO: fn() {},
})
	.addSubFn(
		SubCmdSvc.buildFn('{subject}', {
			desc: i18n => i18n.ns('share').cmdDesc_help_suggest('Like ":help", additionally jump to the tag {subject}.'),
			// TODO: fn() {},
		})
	)
	.addSubFn(
		...['set', 'start', 'pause', 'write', 'resume', 'quit', 'wquit', 'xit', 'exit', 'help', 'language'].map(cmd =>
			SubCmdSvc.buildFn(`<:>(${cmd})`, {
				desc: i18n =>
					i18n.ns('share').cmdDesc_help_withArg('Open dialog and display the help of {|subject|}.', { subject: cmd }),
				// TODO: fn() {},
			})
		)
	)
	.done()

export const cmdList = CmdListSvc.buildFn(createHeader)
	.addCmdFn(SET_CMD)
	.addCmdFn(START_CMD)
	.addCmdFn(PAUSE_CMD)
	.addCmdFn(WRITE_CMD)
	.addCmdFn(RESUME_CMD)
	.addCmdFn(QUIT_CMD)
	.addCmdFn(WQUIT_CMD)
	.addCmdFn(XIT_CMD)
	.addCmdFn(EXIT_CMD)
	.addCmdFn(LANGUAGE_CMD)
	.addCmdFn(HELP_CMD)
	.done()

// 	new Sugg({
// 		cmdStr: 'q[uit]<!>',
// 		descriptions: 'Close without save, also when the current game has changes.',
// 		id: 'quit-unsave',
// 	}),
