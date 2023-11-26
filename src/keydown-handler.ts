import { med } from '$cmd/infra/services'
import { modeState, screenState } from '$cmd/infra/stores/svelte'
import { DialogKinds, MainScreenKinds, ScreenActions, type VimScreen } from '$screen/domain/models'
import { ModeKinds, SudokuActions, type ValidNumbers } from '$sudoku/domain/models'

let moves = 0

function movePosition(key: string) {
	// move with arrow keys
	if (key === 'ArrowDown') med.dispatch(SudokuActions.Move, { type: 'down', times: 1 })
	if (key === 'ArrowLeft') med.dispatch(SudokuActions.Move, { type: 'left', times: 1 })
	if (key === 'ArrowRight') med.dispatch(SudokuActions.Move, { type: 'right', times: 1 })
	if (key === 'ArrowUp') med.dispatch(SudokuActions.Move, { type: 'up', times: 1 })

	// move with vim shortcuts
	if (['j', 'h', 'k', 'l', 'J', 'H', 'K', 'L'].includes(key)) {
		const times = moves === 0 ? 1 : moves
		if (['j', 'J'].includes(key)) med.dispatch(SudokuActions.Move, { type: 'down', times })
		if (['h', 'h'].includes(key)) med.dispatch(SudokuActions.Move, { type: 'left', times })
		if (['l', 'L'].includes(key)) med.dispatch(SudokuActions.Move, { type: 'right', times })
		if (['k', 'K'].includes(key)) med.dispatch(SudokuActions.Move, { type: 'up', times })
	}
}

function changeMode(key: string) {
	if (modeState.data === ModeKinds.X) {
		if (['a', 'A'].includes(key)) med.dispatch(SudokuActions.ChangeMode, { mode: ModeKinds.A })
		if (['i', 'I'].includes(key)) med.dispatch(SudokuActions.ChangeMode, { mode: ModeKinds.I })
	} else if (key === 'Escape') med.dispatch(SudokuActions.ChangeMode, { mode: ModeKinds.X })
}

function pressNum(value: ValidNumbers) {
	if (Number.isNaN(value)) moves = 0
	else if ([ModeKinds.A, ModeKinds.I].includes(modeState.data)) {
		med.dispatch(SudokuActions.Write, { value })
		moves = 0
	} else moves = moves * 10 + value
}

function sudoku(key: string) {
	movePosition(key)
	if (isGameScreen(screenState.data)) changeMode(key)

	pressNum(Number(key) as ValidNumbers)
}

function isGameScreen(screen: VimScreen) {
	return screen.main === MainScreenKinds.Game && screen.dialog.kind === DialogKinds.None
}

export function keydownHandler(ev: KeyboardEvent) {
	if (ev.key === ':' && screenState.data.dialog.kind !== DialogKinds.Cmd) {
		ev.preventDefault()
		med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd })
	}
	if (ev.key === 'Escape') {
		if (screenState.data.dialog.kind !== DialogKinds.None) ev.preventDefault()
		if (!isGameScreen(screenState.data)) med.dispatch(ScreenActions.Exit)
	}

	if (isGameScreen(screenState.data)) sudoku(ev.key)
}
