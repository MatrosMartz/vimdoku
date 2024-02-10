import { noop } from '~/share/utils'
import { CmdListSvc, CmdSvc, type CreateHeader, SubCmdSvc } from '$cmd/domain/services'
import { NON_TOGGLE_NAMES, PREFS_NAMES, TOGGLE_NAMES } from '$pref/domain/models'
import { ACCESSIBILITY_KINDS, COLOR_SCHEMAS, ICON_THEMES, LANGS } from '$pref/domain/models/user.model'
import { DIFFICULTIES_NAMES } from '$sudoku/domain/models'

export const createHeader: CreateHeader<[string, string]> = ([cmdToken, subTokens]) => [
	cmdToken.tokens.join(''),
	subTokens.tokens.join(''),
]

/**
 * Get command description mock function
 * @returns mock description.
 */
function descMock() {
	return ''
}

const SET_CMD = CmdSvc.create('se[t]', {
	desc: descMock,
	fn: noop,
})
	.sub(
		SubCmdSvc.create('{preference}', {
			desc: [descMock, descMock],
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<?>', {
			desc: descMock,
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<&>', {
			desc: descMock,
		})
	)
	.sub(
		SubCmdSvc.create('<no>{preference}', {
			desc: descMock,
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<!>', {
			desc: descMock,
		})
	)
	.sub(
		SubCmdSvc.create('<inv>{preference}', {
			desc: descMock,
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<=>{value}', {
			desc: descMock,
		})
	)
	.sub(
		SubCmdSvc.create('{preference}<:>{value}', {
			desc: descMock,
		})
	)
	.sub(
		SubCmdSvc.create('<all>', {
			desc: descMock,
			fn: noop,
		})
	)
	.sub(
		SubCmdSvc.create('<all><&>', {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(PREFS_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<?>`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(PREFS_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<&>`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`<no>(${pref})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<!>`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`<inv>(${pref})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<=>{value}`, {
			desc: descMock,
		})
	)
	.subFromArray(NON_TOGGLE_NAMES, pref =>
		SubCmdSvc.create(`(${pref})<:>{value}`, {
			desc: descMock,
		})
	)
	.subFromArray(LANGS, lang =>
		SubCmdSvc.create(`(language)<=>(${lang})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(LANGS, lang =>
		SubCmdSvc.create(`(language)<:>(${lang})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(COLOR_SCHEMAS, schema =>
		SubCmdSvc.create(`(colorSchema)<=>(${schema})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(COLOR_SCHEMAS, schema =>
		SubCmdSvc.create(`(colorSchema)<:>(${schema})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(contrast)<=>(${accessibility})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(contrast)<:>(${accessibility})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(motionReduce)<=>(${accessibility})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(ACCESSIBILITY_KINDS, accessibility =>
		SubCmdSvc.create(`(motionReduce)<:>(${accessibility})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(ICON_THEMES, theme =>
		SubCmdSvc.create(`(iconTheme)<=>(${theme})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.subFromArray(ICON_THEMES, theme =>
		SubCmdSvc.create(`(iconTheme)<:>(${theme})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.sub(
		SubCmdSvc.create('(history)<=>{|value|}', {
			desc: descMock,
			fn: noop,
		})
	)
	.sub(
		SubCmdSvc.create('(history)<:>{|value|}', {
			desc: descMock,
			fn: noop,
		})
	)
	.done()

const START_CMD = CmdSvc.create('st[art]', {
	desc: descMock,
	fn: noop,
})
	.sub(
		SubCmdSvc.create('{difficulty}', {
			desc: descMock,
		})
	)
	.subFromArray(DIFFICULTIES_NAMES, difficulty =>
		SubCmdSvc.create(`(${difficulty})`, {
			desc: descMock,
			fn: noop,
		})
	)
	.done()
const PAUSE_CMD = CmdSvc.create('pa[use]', {
	desc: descMock,
	fn: noop,
}).done()

const WRITE_CMD = CmdSvc.create('w[rite]', {
	desc: descMock,
	fn: noop,
}).done()

const RESUME_CMD = CmdSvc.create('re[sume]', {
	desc: [descMock, descMock],
	fn: noop,
}).done()

const QUIT_CMD = CmdSvc.create('q[uit]', {
	desc: descMock,
	fn: noop,
}).done()

const WQUIT_CMD = CmdSvc.create('wq[uit]', {
	desc: descMock,
	fn: noop,
}).done()

const XIT_CMD = CmdSvc.create('x[it]', {
	desc: descMock,
	fn: noop,
}).done()

const EXIT_CMD = CmdSvc.create('exi[t]', {
	desc: descMock,
	fn: noop,
}).done()

const HELP_CMD = CmdSvc.create('h[elp]', {
	desc: descMock,
	// TODO: fn() {},
})
	.sub(
		SubCmdSvc.create('{subject}', {
			desc: descMock,
			// TODO: fn() {},
		})
	)
	.subFromArray(['set', 'start', 'pause', 'write', 'resume', 'quit', 'wquit', 'xit', 'exit', 'help'], cmd =>
		SubCmdSvc.create(`<:>(${cmd})`, {
			desc: descMock,
			// TODO: fn() {},
		})
	)
	.done()

export const cmdListMock = CmdListSvc.create(createHeader)
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
