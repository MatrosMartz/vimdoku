import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
import { med } from '$cmd/infra/services'
import { DialogKind, MainScreenKind, type VimScreen } from '$screen/domain/models'
import { screenState } from '$screen/infra/stores/svelte'
import type { ValidNumbers } from '$sudoku/domain/entities'
import { ModeKind } from '$sudoku/domain/models'
import { modeState } from '$sudoku/infra/stores/svelte'

let moves = 0

/**
 *
 * @param key
 */
function movePosition(key: string) {
	// move with arrow keys
	if (key === 'ArrowDown') med.dispatch(SUDOKU_ACTIONS.move, { type: 'down', times: 1 })
	if (key === 'ArrowLeft') med.dispatch(SUDOKU_ACTIONS.move, { type: 'left', times: 1 })
	if (key === 'ArrowRight') med.dispatch(SUDOKU_ACTIONS.move, { type: 'right', times: 1 })
	if (key === 'ArrowUp') med.dispatch(SUDOKU_ACTIONS.move, { type: 'up', times: 1 })

	// move with vim shortcuts
	if (['j', 'h', 'k', 'l', 'J', 'H', 'K', 'L'].includes(key)) {
		const times = moves === 0 ? 1 : moves
		if (['j', 'J'].includes(key)) med.dispatch(SUDOKU_ACTIONS.move, { type: 'down', times })
		if (['h', 'h'].includes(key)) med.dispatch(SUDOKU_ACTIONS.move, { type: 'left', times })
		if (['l', 'L'].includes(key)) med.dispatch(SUDOKU_ACTIONS.move, { type: 'right', times })
		if (['k', 'K'].includes(key)) med.dispatch(SUDOKU_ACTIONS.move, { type: 'up', times })
	}
}

/**
 *
 * @param key
 */
function changeMode(key: string) {
	if (modeState.data === ModeKind.X) {
		if (['n', 'N'].includes(key)) med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: ModeKind.N })
		if (['i', 'I'].includes(key)) med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: ModeKind.I })
		if (['v', 'V'].includes(key)) med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: ModeKind.V })
	} else if (key === 'Escape') med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: ModeKind.X })
}

/**
 *
 * @param value
 */
function pressNum(value: ValidNumbers) {
	if (Number.isNaN(value)) moves = 0
	else if ([ModeKind.N, ModeKind.I].includes(modeState.data)) {
		med.dispatch(SUDOKU_ACTIONS.write, { value })
		moves = 0
	} else moves = moves * 10 + value
}

/**
 *
 * @param ev
 */
function sudoku(ev: KeyboardEvent) {
	movePosition(ev.key)
	changeMode(ev.key)

	pressNum(Number(ev.key) as ValidNumbers)

	if (ev.ctrlKey && ['z', 'Z'].includes(ev.key)) med.dispatch(SUDOKU_ACTIONS.undo)
	if (ev.ctrlKey && ['y', 'Y'].includes(ev.key)) med.dispatch(SUDOKU_ACTIONS.redo)
}

/**
 *
 * @param screen
 */
function isGameScreen(screen: VimScreen) {
	return screen.main === MainScreenKind.Game && screen.dialog.kind === DialogKind.None
}

/**
 *
 * @param ev
 */
export function keydownHandler(ev: KeyboardEvent) {
	if (ev.key === ':' && screenState.data.dialog.kind !== DialogKind.Cmd) {
		ev.preventDefault()
		med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.Cmd })
	}
	if (ev.key === 'Escape') {
		if (screenState.data.dialog.kind !== DialogKind.None) ev.preventDefault()
		med.dispatch(SCREEN_ACTIONS.close)
	}
	if (ev.key === ' ' && screenState.data.dialog.kind === DialogKind.None) {
		med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.Pause })
	}

	if (isGameScreen(screenState.data)) sudoku(ev)
}
