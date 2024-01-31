import { match } from '~/share/utils'
import { CmdTokenKind, SubTokenKind } from '$cmd/domain/entities'
import { CmdListSvc, CmdSvc, type CreateHeader, SubCmdSvc } from '$cmd/domain/services'
import {
	ACCESSIBILITY_KINDS,
	COLOR_SCHEMAS,
	ICON_THEMES,
	LANGS,
	NON_TOGGLE_NAMES,
	PrefAction,
	PREFS_NAMES,
	TOGGLE_NAMES,
} from '$pref/domain/models'
import { DialogKind, ScreenAction } from '$screen/domain/models'
import { DIFFICULTIES_NAMES, DifficultyKind, SudokuAction } from '$sudoku/domain/models'

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
	desc: 'Show all preferences that differ from their default value.',
	fn: () => med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.PrefDiff }),
})
	.sub(
		SubCmdSvc.create('{preference}', {
			desc: [
				'Toggle preference: Set, switch it on preference.',
				'String or Number preference: Show value of preference',
			],
		})
	)
	.sub(SubCmdSvc.create('{preference}<?>', { desc: 'Show value of {preference}.' }))
	.sub(SubCmdSvc.create('{preference}<&>', { desc: "Reset option to it's default value." }))
	.sub(SubCmdSvc.create('<no>{preference}', { desc: 'Toggle preference: Set, switch it off.' }))
	.sub(SubCmdSvc.create('{preference}<!>', { desc: 'Toggle preference: Set, Invert value.' }))
	.sub(SubCmdSvc.create('<inv>{preference}', { desc: 'Toggle preference: Set, Invert value.' }))
	.sub(
		SubCmdSvc.create('{preference}<=>{value}', {
			desc: 'String or Number preference: Assign to {pref} the {value}.',
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<:>{value}', {
			desc: 'String or Number preference: Assign to {pref} the {value}.',
		})
	)
	.sub(
		SubCmdSvc.create('<all>', {
			desc: 'Show all preferences.',
			fn: () => med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.PrefAll }),
		})
	)
	.sub(
		SubCmdSvc.create('<all><&>', {
			desc: 'Reset all preferences.',
			fn: () => med.dispatch(PrefAction.Reset, { type: 'all' }),
		})
	)
	.subFromArray(PREFS_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<?>`, {
			desc: `Show value of ${pref}.`,
			// TODO: fn: () => med.dispatch(ScreenAction.OpenDialog, {kind: DialogKind.ViewPref, pref })
		})
	)
	.subFromArray(PREFS_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<&>`, {
			desc: `Reset value of ${pref}.`,
			fn: () => med.dispatch(PrefAction.Reset, { type: 'by-key', key: pref }),
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})`, {
			desc: `Set, ${pref} switch it on.`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: pref, value: true})
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})`, {
			desc: `Show value of ${pref}.`,
			// TODO: fn: () => med.dispatch(ScreenAction.OpenDialog, {kind: DialogKind.ViewPref, pref })
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`<no>(${pref})`, {
			desc: `Set, ${pref} switch it off.`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: pref, value: false})
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<!>`, {
			desc: `Set, ${pref} invert value.`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: pref, toggle: true })
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`<inv>(${pref})`, {
			desc: `Set, ${pref} invert value.`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: pref, toggle: true })
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<=>{value}`, {
			desc: `Assign to ${pref} the {value}.`,
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<:>{value}`, {
			desc: `Assign to ${pref} the {value}.`,
		})
	)
	.subFromArray(LANGS, lang =>
		SubCmdSvc.create(`(language)<=>(${lang})`, {
			desc: `Assign to language the "${lang}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'language', value: lang})
		})
	)
	.subFromArray(LANGS, lang =>
		SubCmdSvc.create(`(language)<:>(${lang})`, {
			desc: `Assign to language the "${lang}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'language', value: lang})
		})
	)
	.subFromArray(COLOR_SCHEMAS, schema =>
		SubCmdSvc.create(`(colorSchema)<=>(${schema})`, {
			desc: `Assign to colorSchema the "${schema}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'colorSchema', value: schema})
		})
	)
	.subFromArray(COLOR_SCHEMAS, schema =>
		SubCmdSvc.create(`(colorSchema)<:>(${schema})`, {
			desc: `Assign to colorSchema the "${schema}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'colorSchema', value: schema})
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(contrast)<=>(${accessibility})`, {
			desc: `Assign to contrast the "${accessibility}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'contrast', value: accessibility})
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(contrast)<:>(${accessibility})`, {
			desc: `Assign to contrast the "${accessibility}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'contrast', value: accessibility})
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(motionReduce)<=>(${accessibility})`, {
			desc: `Assign to motionReduce the "${accessibility}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'motionReduce', value: accessibility})
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(motionReduce)<:>(${accessibility})`, {
			desc: `Assign to motionReduce the "${accessibility}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'motionReduce', value: accessibility})
		})
	)
	.subFromArray(ICON_THEMES, theme =>
		SubCmdSvc.create(`(iconTheme)<=>(${theme})`, {
			desc: `Assign to iconTheme the "${theme}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'iconTheme', value: theme})
		})
	)
	.subFromArray(ICON_THEMES, theme =>
		SubCmdSvc.create(`(iconTheme)<:>(${theme})`, {
			desc: `Assign to iconTheme the "${theme}".`,
			// TODO: fn: () => med.dispatch(PrefAction.Set, {type:'by-key', key: 'iconTheme', value: theme})
		})
	)
	.sub(
		SubCmdSvc.create('(history)<=>{|value|}', {
			desc: 'Assign to contrast the {value}.',
			// TODO: fn: ({value}) => med.dispatch(PrefAction.Set, {type:'by-key', key: 'history', value})
		})
	)
	.sub(
		SubCmdSvc.create('(history)<:>{|value|}', {
			desc: 'Assign to contrast the {value}.',
			// TODO: fn: ({value}) => med.dispatch(PrefAction.Set, {type:'by-key', key: 'history', value})
		})
	)
	.done()

const START_CMD = CmdSvc.create('st[art]', {
	desc: 'Start new game with Easy difficulty.',
	fn: () => med.dispatch(SudokuAction.Start, { difficulty: DifficultyKind.Easy }),
})
	.sub(SubCmdSvc.create('{difficulty}', { desc: 'Start new game with the selected difficulty.' }))
	.subFromArray(DIFFICULTIES_NAMES, difficulty =>
		SubCmdSvc.create(`(${difficulty})`, {
			desc: `Start new game with the "${difficulty}" difficulty.`,
			fn: () => med.dispatch(SudokuAction.Start, { difficulty: DifficultyKind[difficulty] }),
		})
	)
	.done()
const PAUSE_CMD = CmdSvc.create('pa[use]', {
	desc: 'Pause current game.',
	fn: () => med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.Pause }),
}).done()

const WRITE_CMD = CmdSvc.create('w[rite]', {
	desc: 'Save current game.',
	fn: () => med.dispatch(SudokuAction.Save),
}).done()

const RESUME_CMD = CmdSvc.create('re[sume]', {
	desc: ['Resume the current game.', 'Resume the saved game only if no game active.'],
	fn: () => med.dispatch(SudokuAction.Resume),
}).done()

const QUIT_CMD = CmdSvc.create('q[uit]', {
	desc: 'Close the current windows.',
	fn: () => med.dispatch(ScreenAction.Exit),
}).done()

const WQUIT_CMD = CmdSvc.create('wq[uit]', {
	desc: 'Save the current game and close the windows.',
	fn: () => med.dispatch(SudokuAction.Save).dispatch(ScreenAction.Exit),
}).done()

const XIT_CMD = CmdSvc.create('x[it]', {
	desc: 'Like ":wq", but save only when changes have been made.',
	fn: () => med.dispatch(ScreenAction.Exit),
}).done()

const EXIT_CMD = CmdSvc.create('exi[t]', {
	desc: 'Like ":wq", but save only when changes have been made.',
	fn: () => med.dispatch(ScreenAction.Exit),
}).done()

const HELP_CMD = CmdSvc.create('h[elp]', {
	desc: 'Open dialog and display the help file in read-only mode.',
	// TODO: fn() {},
})
	.sub(
		SubCmdSvc.create('{subject}', {
			desc: 'Like ":help", additionally jump to the tag {subject}.',
			// TODO: fn() {},
		})
	)
	.subFromArray(['set', 'start', 'pause', 'write', 'resume', 'quit', 'wquit', 'xit', 'exit', 'help'], cmd =>
		SubCmdSvc.create(`<:>(${cmd})`, {
			desc: `Open a window and display the help of ${cmd} command.`,
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
