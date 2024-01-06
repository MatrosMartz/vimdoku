import { med } from '$cmd/infra/services'
import { DialogKind, MainScreenKind, ScreenAction, type VimScreen } from '$screen/domain/models'
import { screenState } from '$screen/infra/stores/svelte'
import { ModeKind, SudokuAction, type ValidNumbers } from '$sudoku/domain/models'
import { modeState } from '$sudoku/infra/stores/svelte'

let moves = 0

function movePosition(key: string) {
	// move with arrow keys
	if (key === 'ArrowDown') med.dispatch(SudokuAction.Move, { type: 'down', times: 1 })
	if (key === 'ArrowLeft') med.dispatch(SudokuAction.Move, { type: 'left', times: 1 })
	if (key === 'ArrowRight') med.dispatch(SudokuAction.Move, { type: 'right', times: 1 })
	if (key === 'ArrowUp') med.dispatch(SudokuAction.Move, { type: 'up', times: 1 })

	// move with vim shortcuts
	if (['j', 'h', 'k', 'l', 'J', 'H', 'K', 'L'].includes(key)) {
		const times = moves === 0 ? 1 : moves
		if (['j', 'J'].includes(key)) med.dispatch(SudokuAction.Move, { type: 'down', times })
		if (['h', 'h'].includes(key)) med.dispatch(SudokuAction.Move, { type: 'left', times })
		if (['l', 'L'].includes(key)) med.dispatch(SudokuAction.Move, { type: 'right', times })
		if (['k', 'K'].includes(key)) med.dispatch(SudokuAction.Move, { type: 'up', times })
	}
}

function changeMode(key: string) {
	if (modeState.data === ModeKind.X) {
		if (['n', 'N'].includes(key)) med.dispatch(SudokuAction.ChangeMode, { mode: ModeKind.N })
		if (['i', 'I'].includes(key)) med.dispatch(SudokuAction.ChangeMode, { mode: ModeKind.I })
		if (['v', 'V'].includes(key)) med.dispatch(SudokuAction.ChangeMode, { mode: ModeKind.V })
	} else if (key === 'Escape') med.dispatch(SudokuAction.ChangeMode, { mode: ModeKind.X })
}

function pressNum(value: ValidNumbers) {
	if (Number.isNaN(value)) moves = 0
	else if ([ModeKind.N, ModeKind.I].includes(modeState.data)) {
		med.dispatch(SudokuAction.Write, { value })
		moves = 0
	} else moves = moves * 10 + value
}

function sudoku(ev: KeyboardEvent) {
	movePosition(ev.key)
	changeMode(ev.key)

	pressNum(Number(ev.key) as ValidNumbers)

	if (ev.ctrlKey && ['z', 'Z'].includes(ev.key)) med.dispatch(SudokuAction.Undo)
	if (ev.ctrlKey && ['y', 'Y'].includes(ev.key)) med.dispatch(SudokuAction.Redo)
}

function isGameScreen(screen: VimScreen) {
	return screen.main === MainScreenKind.Game && screen.dialog.kind === DialogKind.None
}

export function keydownHandler(ev: KeyboardEvent) {
	if (ev.key === ':' && screenState.data.dialog.kind !== DialogKind.Cmd) {
		ev.preventDefault()
		med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.Cmd })
	}
	if (ev.key === 'Escape') {
		if (screenState.data.dialog.kind !== DialogKind.None) ev.preventDefault()
		med.dispatch(ScreenAction.Exit)
	}
	if (ev.key === ' ' && screenState.data.dialog.kind === DialogKind.None) {
		med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.Pause })
	}

	if (isGameScreen(screenState.data)) sudoku(ev)
}
