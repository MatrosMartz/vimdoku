import { Modes } from '$cmd/domain/const'
import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
import { med } from '$cmd/infra/services'
import { Modal, type Page, Route } from '$page/domain/entities'
import { pageState } from '$page/infra/stores/svelte'
import type { ValidNumbers } from '$sudoku/domain/entities'
import { modeState } from '$sudoku/infra/stores/svelte'

let moves = 0

/**
 * Sudoku move controller.
 * @param key The key string value.
 */
function movePosition(key: string) {
	// move with arrow keys
	if (key === 'ArrowDown') med.dispatch(SUDOKU_ACTIONS.move, { type: 'Down', times: 1 })
	if (key === 'ArrowLeft') med.dispatch(SUDOKU_ACTIONS.move, { type: 'Left', times: 1 })
	if (key === 'ArrowRight') med.dispatch(SUDOKU_ACTIONS.move, { type: 'Right', times: 1 })
	if (key === 'ArrowUp') med.dispatch(SUDOKU_ACTIONS.move, { type: 'Up', times: 1 })

	// move with vim shortcuts
	if (['j', 'h', 'k', 'l', 'J', 'H', 'K', 'L'].includes(key)) {
		const times = moves === 0 ? 1 : moves
		if (['j', 'J'].includes(key)) med.dispatch(SUDOKU_ACTIONS.move, { type: 'Down', times })
		if (['h', 'h'].includes(key)) med.dispatch(SUDOKU_ACTIONS.move, { type: 'Left', times })
		if (['l', 'L'].includes(key)) med.dispatch(SUDOKU_ACTIONS.move, { type: 'Right', times })
		if (['k', 'K'].includes(key)) med.dispatch(SUDOKU_ACTIONS.move, { type: 'Up', times })
	}
}

/**
 * Sudoku change mode controller.
 * @param key The key string value.
 */
function changeMode(key: string) {
	if (modeState.data === Modes.Kind.X) {
		if (['n', 'N'].includes(key)) med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: Modes.Kind.N })
		if (['i', 'I'].includes(key)) med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: Modes.Kind.I })
		if (['v', 'V'].includes(key)) med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: Modes.Kind.V })
	} else if (key === 'Escape') med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: Modes.Kind.X })
}

/**
 * Sudoku press num controller.
 * @param value The sudoku valid number.
 */
function pressNum(value: ValidNumbers) {
	if (Number.isNaN(value)) moves = 0
	else if ([Modes.Kind.N, Modes.Kind.I].includes(modeState.data)) {
		med.dispatch(SUDOKU_ACTIONS.write, { value })
		moves = 0
	} else moves = moves * 10 + value
}

/**
 * Sudoku move controller.
 * @param ev The keyboard event.
 */
function sudoku(ev: KeyboardEvent) {
	ev.preventDefault()
	movePosition(ev.key)
	changeMode(ev.key)

	pressNum(Number(ev.key) as ValidNumbers)

	if (ev.ctrlKey && ['z', 'Z'].includes(ev.key)) med.dispatch(SUDOKU_ACTIONS.undo)
	if (ev.ctrlKey && ['y', 'Y'].includes(ev.key)) med.dispatch(SUDOKU_ACTIONS.redo)
}

/**
 * Get if the page is Game without some dialog.
 * @param page The page.
 * @returns True if page is Game without some dialog, false if not.
 */
function isGamePage(page: Page.Page) {
	return Route.Game.is(page.route) && Modal.None.is(page.modal)
}

/**
 * keyboard controller, keydown handler.
 * @param ev The keyboard event.
 */
export function keydownHandler(ev: KeyboardEvent) {
	const t = ev.target
	const main = document.getElementsByTagName('main')[0]
	if (ev.key === ':' && !Modal.Cmd.is(pageState.data.modal)) {
		ev.preventDefault()
		med.dispatch(SCREEN_ACTIONS.openModal, { modal: new Modal.Cmd() })
	}
	if (ev.key === 'Escape') {
		if (Modal.None.is(pageState.data.modal)) ev.preventDefault()
		if (!(t instanceof HTMLElement && t.classList.contains('combobox') && t.ariaExpanded === 'true'))
			med.dispatch(SCREEN_ACTIONS.back)
	}

	if (t instanceof HTMLElement && main.contains(t)) {
		if (ev.key === ' ' && Modal.None.is(pageState.data.modal)) {
			med.dispatch(SCREEN_ACTIONS.openModal, { modal: new Modal.Pause() })
		}

		if (isGamePage(pageState.data)) sudoku(ev)
	}
}
