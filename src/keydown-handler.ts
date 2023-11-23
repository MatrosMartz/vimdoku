import { mediator } from '$cmd/infra/services'
import { modeState, screenState } from '$cmd/infra/stores/svelte'
import { DialogKinds, MainScreenKinds, ScreenActions, type VimScreen } from '$screen/domain/models'
import { ModeKinds, SudokuActions, type ValidNumbers } from '$sudoku/domain/models'

let moves = 0

function sudoku(key: string) {
	if (key === 'ArrowDown') mediator.dispatch(SudokuActions.Move, { type: 'down', times: 1 })
	if (key === 'ArrowLeft') mediator.dispatch(SudokuActions.Move, { type: 'left', times: 1 })
	if (key === 'ArrowRight') mediator.dispatch(SudokuActions.Move, { type: 'right', times: 1 })
	if (key === 'ArrowUp') mediator.dispatch(SudokuActions.Move, { type: 'up', times: 1 })

	if (['j', 'h', 'k', 'l', 'J', 'H', 'K', 'L'].includes(key)) {
		const times = moves === 0 ? 1 : moves
		if (['j', 'J'].includes(key)) mediator.dispatch(SudokuActions.Move, { type: 'down', times })
		if (['h', 'h'].includes(key)) mediator.dispatch(SudokuActions.Move, { type: 'left', times })
		if (['l', 'L'].includes(key)) mediator.dispatch(SudokuActions.Move, { type: 'right', times })
		if (['k', 'K'].includes(key)) mediator.dispatch(SudokuActions.Move, { type: 'up', times })
	}

	const value = Number(key) as ValidNumbers
	if (Number.isNaN(value)) moves = 0
	else if ([ModeKinds.A, ModeKinds.I].includes(modeState.data)) {
		mediator.dispatch(SudokuActions.Write, { value })
		moves = 0
	} else moves = moves * 10 + value
}

function isGameScreen(screen: VimScreen) {
	return screen.main === MainScreenKinds.Game && screen.dialog.kind === DialogKinds.None
}

export function keydownHandler(ev: KeyboardEvent) {
	if (ev.key === ':' && screenState.data.dialog.kind !== DialogKinds.Cmd) {
		ev.preventDefault()
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd })
	}
	if (ev.key === 'Escape') {
		if (screenState.data.dialog.kind !== DialogKinds.None) ev.preventDefault()
		mediator.dispatch(ScreenActions.Exit)
	}

	if (isGameScreen(screenState.data)) sudoku(ev.key)
}
