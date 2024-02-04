import { IDLE_POS, type Pos } from '~/share/domain/entities'
import type { OptionalKeys } from '~/share/types'
import type { Lang, Prefs, ToggleNames } from '$pref/domain/models'
import { type DialogData, DialogKind, MainScreenKind } from '$screen/domain/models'
import { Solution, type ValidNumbers } from '$sudoku/domain/entities'
import { type GameOpts, ModeKind } from '$sudoku/domain/models'

import type { ActionUnData, ActionWithData, DataAction } from '../models'

// i18n Actions.
const changeLang: ActionWithData<{ lang: Lang }> = async (state, { lang }) => {
	await state.i18n.changeLang(lang)
	return state
}

export const I18N_ACTIONS = { changeLang }

// Pref actions.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type SetPrefByKey<K extends keyof Prefs = keyof Prefs> = {
	key: K
	type: 'by-key'
	value: Prefs[K]
}

type SetPrefData = { prefs: Prefs; type: 'all' } | SetPrefByKey

const setPref: ActionWithData<SetPrefData> = async (state, data) => {
	if (data.type === 'all') state.prefs.setAll(data.prefs)
	else state.prefs.setByKey(data.key, data.value)

	await state.i18n.changeLang(state.prefs.data.language)

	return state
}

type ResetPrefData = { type: 'all' } | { key: keyof Prefs; type: 'by-key' }

const resetPref: ActionWithData<ResetPrefData> = async (state, data) => {
	if (data.type === 'all') state.prefs.resetAll()
	else state.prefs.resetByKey(data.key)

	await state.i18n.changeLang(state.prefs.data.language)

	return state
}

const invertPref: ActionWithData<{ pref: ToggleNames }> = async (state, data) => {
	state.prefs.setByKey(data.pref, !state.prefs.data[data.pref])
	return state
}

export const PREFS_ACTIONS = { set: setPref, reset: resetPref, invert: invertPref }

// Screen Actions.
const closeScreen: ActionUnData = async state => {
	const isGameScreen = state.screen.mainScreen === MainScreenKind.Game
	const isNoneDialog = state.screen.dialog.kind === DialogKind.None
	if (isGameScreen && isNoneDialog && !state.game.isASaved)
		return await openDialog(state, { kind: DialogKind.Warn, opts: { type: 'unsave' } })

	state.screen.close()

	if (isGameScreen && isNoneDialog) {
		state.game.timerStart()
	} else if (isGameScreen) {
		state.game.timerPause()
	} else {
		state.game.timerPause().timerReset().changeMode(ModeKind.X).changePos(IDLE_POS)
	}

	return state
}

const openDialog: ActionWithData<DialogData> = async (state, data) => {
	state.screen.setDialog(data)
	return state
}

const openMain: ActionWithData<{ mainScreen: MainScreenKind }> = async (state, data) => {
	const isGameScreen = state.screen.mainScreen === MainScreenKind.Game
	const nextIsGameScreen = data.mainScreen === MainScreenKind.Game
	if (!nextIsGameScreen && isGameScreen && !state.game.isASaved)
		return await openDialog(state, { kind: DialogKind.Warn, opts: { type: 'unsave' } })

	state.screen.setMain(data.mainScreen)
	return state
}

export const SCREEN_ACTIONS = { close: closeScreen, openDialog, openMain }

// Sudoku actions.
const clearCell: ActionUnData = async state => {
	state.game.clear()

	return state
}

const writeCell: ActionWithData<{ value: ValidNumbers | 0 }> = async (state, data) => {
	if (data.value === 0) return await clearCell(state)

	const { autoNoteDeletion: removeNotes, autoValidation: validate } = state.prefs.data
	state.game.write(data.value, { removeNotes, validate })

	if (state.game.hasWin) return await openDialog(state, { kind: DialogKind.Win })

	return state
}

const verifyBoard: ActionUnData = async state => {
	state.game.verify()

	return state
}

interface MoveDir {
	times: number
	type: 'down' | 'left' | 'right' | 'up'
}
interface MoveSet {
	pos: Pos
	type: 'set'
}

type MoveSelectionData = MoveDir | MoveSet

const moveSelection: ActionWithData<MoveSelectionData & DataAction> = async (state, data) => {
	if (data.type === 'down') state.game.moveDown(data.times)
	if (data.type === 'left') state.game.moveLeft(data.times)
	if (data.type === 'right') state.game.moveRight(data.times)
	if (data.type === 'up') state.game.moveUp(data.times)
	if (data.type === 'set') state.game.changePos(data.pos)

	return state
}

const changeMode: ActionWithData<{ mode: ModeKind }> = async (state, data) => {
	state.game.changeMode(data.mode)
	return state
}

const redoGame: ActionUnData = async state => {
	state.game.redo()
	return state
}
const undoGame: ActionUnData = async state => {
	state.game.undo()
	return state
}

const sudokuEnd: ActionUnData = async state => {
	const game = await state.game.end()
	game.timerPause()

	return { ...state, game }
}

const sudokuResume: ActionUnData = async state => {
	const game = await state.game.resume()
	if (game == null) return state

	state.screen.setMain(MainScreenKind.Game)
	if (state.prefs.data.timer) game.timerStart()

	return { ...state, game }
}

const sudokuSave: ActionUnData = async state => {
	await state.game.save()

	return state
}

const sudokuStart: ActionWithData<OptionalKeys<GameOpts, 'solution'> & DataAction> = async (
	state,
	{ difficulty, solution = Solution.create() }
) => {
	state.screen.setMain(MainScreenKind.Game)
	const game = await state.game.start({ difficulty, solution })
	if (state.prefs.data.timer) game.timerStart()

	return { ...state, game }
}

export const SUDOKU_ACTIONS = {
	clear: clearCell,
	write: writeCell,
	verify: verifyBoard,
	move: moveSelection,
	changeMode,
	redo: redoGame,
	undo: undoGame,
	end: sudokuEnd,
	resume: sudokuResume,
	save: sudokuSave,
	start: sudokuStart,
}
