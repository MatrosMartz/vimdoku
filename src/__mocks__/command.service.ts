import { vi } from 'vitest'

import { CmdSvc, type CreateHeader, ShellSvc, SubCmdSvc } from '$cmd/domain/services'

export const createHeader: CreateHeader<[string, string]> = ([cmdToken, subTokens]) => [
	cmdToken.join('/'),
	subTokens.join('/'),
]

/**
 * Get command description mock function
 * @returns mock description.
 */
const descMock = vi.fn(() => '')

const SET_CMD = CmdSvc.buildCmdFn('se[t]', {
	desc: descMock,
	fn: vi.fn(),
})
	.addSubFn(
		SubCmdSvc.buildFn('{|preference|}', {
			desc: [descMock, descMock],
			fn: vi.fn(),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{|preference|}<?>', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{|preference|}<&>', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<no>{|preference|}', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{|preference|}<!>', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<inv>{|preference|}', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{|preference|}<=>{|value|}', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('{|preference|}<:>{|value|}', {
			desc: descMock,
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<all>', {
			desc: descMock,
			fn: vi.fn(),
		})
	)
	.addSubFn(
		SubCmdSvc.buildFn('<all><&>', {
			desc: descMock,
			fn: vi.fn(),
		})
	)
	.done()

const START_CMD = CmdSvc.buildCmdFn('st[art]', {
	desc: descMock,
	fn: vi.fn(),
})
	.addSubFn(
		SubCmdSvc.buildFn('{|difficulty|}', {
			desc: descMock,
			fn: vi.fn(),
		})
	)
	.done()
const PAUSE_CMD = CmdSvc.buildCmdFn('pa[use]', {
	desc: descMock,
	fn: vi.fn(),
}).done()

const WRITE_CMD = CmdSvc.buildCmdFn('w[rite]', {
	desc: descMock,
	fn: vi.fn(),
}).done()

const RESUME_CMD = CmdSvc.buildCmdFn('re[sume]', {
	desc: [descMock, descMock],
	fn: vi.fn(),
}).done()

const QUIT_CMD = CmdSvc.buildCmdFn('q[uit]', {
	desc: descMock,
	fn: vi.fn(),
}).done()

const WQUIT_CMD = CmdSvc.buildCmdFn('wq[uit]', {
	desc: descMock,
	fn: vi.fn(),
}).done()

const XIT_CMD = CmdSvc.buildCmdFn('x[it]', {
	desc: descMock,
	fn: vi.fn(),
}).done()

const EXIT_CMD = CmdSvc.buildCmdFn('exi[t]', {
	desc: descMock,
	fn: vi.fn(),
}).done()

const HELP_CMD = CmdSvc.buildCmdFn('h[elp]', {
	desc: descMock,
	fn: vi.fn(),
})
	.addSubFn(
		SubCmdSvc.buildFn('{|subject|}', {
			desc: descMock,
			fn: vi.fn(),
		})
	)
	.done()

export const cmdListMock = ShellSvc.buildFn(createHeader)
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
