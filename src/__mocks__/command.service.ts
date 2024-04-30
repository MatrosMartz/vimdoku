import { noop } from '~/share/utils'
import { CmdListSvc, CmdSvc, type CreateHeader, SubCmdSvc } from '$cmd/domain/services'
import { PREFS_FIELDS } from '$pref/domain/models'
import { ACCESSIBILITIES, COLOR_SCHEMAS, ICON_THEMES } from '$pref/domain/models/user.model'
import { Difficulty } from '$sudoku/domain/const'

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

const SET_CMD = CmdSvc.buildFn('se[t]', {
	desc: descMock,
	fn: noop,
})
	.addSubFn(
		SubCmdSvc.buildFn('{preference}', {
			desc: [descMock, descMock],
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<?>', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<&>', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<no>{preference}', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<!>', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<inv>{preference}', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<=>{value}', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{preference}<:>{value}', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<all>', {
			desc: descMock,
			fn: noop,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<all><&>', {
			desc: descMock,
			fn: noop,
		})
	)
	.addSubFn(
		...PREFS_FIELDS.transform(([pref]) =>
			SubCmdSvc.buildFn(`(${pref})<?>`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...PREFS_FIELDS.transform(([pref]) =>
			SubCmdSvc.buildFn(`(${pref})<&>`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...PREFS_FIELDS.subs.TOGGLE.transform(([pref]) =>
			SubCmdSvc.buildFn(`(${pref})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...PREFS_FIELDS.subs.NON_TOGGLE.transform(([pref]) =>
			SubCmdSvc.buildFn(`(${pref})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...PREFS_FIELDS.subs.TOGGLE.transform(([pref]) =>
			SubCmdSvc.buildFn(`<no>(${pref})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...PREFS_FIELDS.subs.TOGGLE.transform(([pref]) =>
			SubCmdSvc.buildFn(`(${pref})<!>`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...PREFS_FIELDS.subs.TOGGLE.transform(([pref]) =>
			SubCmdSvc.buildFn(`<inv>(${pref})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...PREFS_FIELDS.subs.NON_TOGGLE.transform(([pref]) =>
			SubCmdSvc.buildFn(`(${pref})<=>{value}`, {
				desc: descMock,
			})
		)
	)
	.addSubFn(
		...PREFS_FIELDS.subs.NON_TOGGLE.transform(([pref]) =>
			SubCmdSvc.buildFn(`(${pref})<:>{value}`, {
				desc: descMock,
			})
		)
	)
	.addSubFn(
		...COLOR_SCHEMAS.transform(([, schema]) =>
			SubCmdSvc.buildFn(`(colorSchema)<=>(${schema})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...COLOR_SCHEMAS.transform(([, schema]) =>
			SubCmdSvc.buildFn(`(colorSchema)<:>(${schema})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...ACCESSIBILITIES.transform(([, accessibility]) =>
			SubCmdSvc.buildFn(`(contrast)<=>(${accessibility})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...ACCESSIBILITIES.transform(([, accessibility]) =>
			SubCmdSvc.buildFn(`(contrast)<:>(${accessibility})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...ACCESSIBILITIES.transform(([, accessibility]) =>
			SubCmdSvc.buildFn(`(motionReduce)<=>(${accessibility})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...ACCESSIBILITIES.transform(([, accessibility]) =>
			SubCmdSvc.buildFn(`(motionReduce)<:>(${accessibility})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...ICON_THEMES.transform(([, theme]) =>
			SubCmdSvc.buildFn(`(iconTheme)<=>(${theme})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		...ICON_THEMES.transform(([, theme]) =>
			SubCmdSvc.buildFn(`(iconTheme)<:>(${theme})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.addSubFn(
		SubCmdSvc.buildFn('(history)<=>{|value|}', {
			desc: descMock,
			fn: noop,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('(history)<:>{|value|}', {
			desc: descMock,
			fn: noop,
		})
	)
	.done()

const START_CMD = CmdSvc.buildFn('st[art]', {
	desc: descMock,
	fn: noop,
})
	.addSubFn(
		SubCmdSvc.buildFn('{difficulty}', {
			desc: descMock,
		})
	)
	.addSubFn(
		...Difficulty.KINDS.transform(([difficulty]) =>
			SubCmdSvc.buildFn(`(${difficulty})`, {
				desc: descMock,
				fn: noop,
			})
		)
	)
	.done()
const PAUSE_CMD = CmdSvc.buildFn('pa[use]', {
	desc: descMock,
	fn: noop,
}).done()

const WRITE_CMD = CmdSvc.buildFn('w[rite]', {
	desc: descMock,
	fn: noop,
}).done()

const RESUME_CMD = CmdSvc.buildFn('re[sume]', {
	desc: [descMock, descMock],
	fn: noop,
}).done()

const QUIT_CMD = CmdSvc.buildFn('q[uit]', {
	desc: descMock,
	fn: noop,
}).done()

const WQUIT_CMD = CmdSvc.buildFn('wq[uit]', {
	desc: descMock,
	fn: noop,
}).done()

const XIT_CMD = CmdSvc.buildFn('x[it]', {
	desc: descMock,
	fn: noop,
}).done()

const EXIT_CMD = CmdSvc.buildFn('exi[t]', {
	desc: descMock,
	fn: noop,
}).done()

const HELP_CMD = CmdSvc.buildFn('h[elp]', {
	desc: descMock,
	// TODO: fn() {},
})
	.addSubFn(
		SubCmdSvc.buildFn('{subject}', {
			desc: descMock,
			// TODO: fn() {},
		})
	)
	.addSubFn(
		...['set', 'start', 'pause', 'write', 'resume', 'quit', 'wquit', 'xit', 'exit', 'help'].map(cmd =>
			SubCmdSvc.buildFn(`<:>(${cmd})`, {
				desc: descMock,
				// TODO: fn() {},
			})
		)
	)
	.done()

export const cmdListMock = CmdListSvc.buildFn(createHeader)
	.addCmdFn(SET_CMD)
	.addCmdFn(START_CMD)
	.addCmdFn(PAUSE_CMD)
	.addCmdFn(WRITE_CMD)
	.addCmdFn(RESUME_CMD)
	.addCmdFn(QUIT_CMD)
	.addCmdFn(WQUIT_CMD)
	.addCmdFn(XIT_CMD)
	.addCmdFn(EXIT_CMD)
	.addCmdFn(HELP_CMD)
	.done()

// 	new Sugg({
// 		cmdStr: 'q[uit]<!>',
// 		descriptions: 'Close without save, also when the current game has changes.',
// 		id: 'quit-unsave',
// 	}),
