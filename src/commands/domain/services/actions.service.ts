import { type Pos } from '~/share/domain/entities'
import type { OptionalKeys } from '~/share/types'
import type { Lang, Prefs, ToggleNames } from '$pref/domain/models'
import { type DialogData, DialogKind, MainScreenKind } from '$screen/domain/models'
import { Solution, type ValidNumbers } from '$sudoku/domain/entities'
import { type ModeKind, type SudokuSetts } from '$sudoku/domain/models'

import type { ActionUnData, ActionWithData, DataAction } from '../models'

// i18n Actions.
const changeLang: ActionWithData<{ lang: Lang }> = async (state, { lang }) => await state.i18n.changeLang(lang)

export const I18N_ACTIONS = { changeLang }

// Pref actions.
interface SetPrefByKey<K extends keyof Prefs = keyof Prefs> {
	key: K
	type: 'by-key'
	value: Prefs[K]
}

type SetPrefData = { prefs: Prefs; type: 'all' } | SetPrefByKey

const setPref: ActionWithData<SetPrefData & DataAction> = async (state, data) => {
	if (data.type === 'all') await state.prefs.setAll(data.prefs).save()
	else await state.prefs.setByKey(data.key, data.value).save()

	await state.i18n.changeLang(state.prefs.data.language)
}

type ResetPrefData = { type: 'all' } | { key: keyof Prefs; type: 'by-key' }

const resetPref: ActionWithData<ResetPrefData> = async (state, data) => {
	if (data.type === 'all') await state.prefs.resetAll().save()
	else await state.prefs.resetByKey(data.key).save()

	await state.i18n.changeLang(state.prefs.data.language)
}

const invertPref: ActionWithData<{ pref: ToggleNames }> = async (state, data) =>
	await state.prefs.setByKey(data.pref, !state.prefs.data[data.pref]).save()

export const PREFS_ACTIONS = { set: setPref, reset: resetPref, invert: invertPref }

// Screen Actions.
const closeScreen: ActionUnData = async state => {
	const isGameScreen = state.screen.mainScreen === MainScreenKind.Game
	const isNoneDialog = state.screen.dialog.kind === DialogKind.None
	if (isGameScreen && isNoneDialog && !state.sudoku.isASaved) {
		state.screen.setDialog({ kind: DialogKind.Warn, opts: { type: 'unsave' } })
		return
	}

	state.screen.close()

	if (isGameScreen && !isNoneDialog) state.sudoku.continue()
	else await state.sudoku.load()
}

const openDialog: ActionWithData<DialogData> = async (state, data) => state.screen.setDialog(data)

const openMain: ActionWithData<{ mainScreen: MainScreenKind }> = async (state, data) => {
	const isGameScreen = state.screen.mainScreen === MainScreenKind.Game
	const nextIsGameScreen = data.mainScreen === MainScreenKind.Game
	if (!nextIsGameScreen && isGameScreen && !state.sudoku.isASaved) {
		state.screen.setDialog({ kind: DialogKind.Warn, opts: { type: 'unsave' } })
		return
	}

	state.screen.setMain(data.mainScreen)
}

export const SCREEN_ACTIONS = { close: closeScreen, openDialog, openMain }

// Sudoku actions.
const clearCell: ActionUnData = async state => {
	state.sudoku.clear()
}

const writeCell: ActionWithData<{ value: ValidNumbers | 0 }> = async (state, data) => {
	if (data.value === 0) return await clearCell(state)

	const { autoNoteDeletion: removeNotes, autoValidation: validate } = state.prefs.data
	state.sudoku.write(data.value, { removeNotes, validate })

	if (state.sudoku.hasWin) state.screen.setDialog({ kind: DialogKind.Win })
}

const verifyBoard: ActionUnData = async state => {
	state.sudoku.verify()
}

interface MoveDir {
	times: number
	type: 'Down' | 'Left' | 'Right' | 'Up'
}
interface MoveSet {
	pos: Pos
	type: 'set'
}

type MoveSelectionData = MoveDir | MoveSet

const moveSelection: ActionWithData<MoveSelectionData & DataAction> = async (state, data) => {
	if (data.type === 'set') state.sudoku.moveTo(data.pos)
	else state.sudoku.move(data.type, data.times)
}

const changeMode: ActionWithData<{ mode: ModeKind }> = async (state, data) => {
	state.sudoku.changeMode(data.mode)
}

const redoGame: ActionUnData = async state => {
	state.sudoku.redo()
}
const undoGame: ActionUnData = async state => {
	state.sudoku.undo()
}

const sudokuEnd: ActionUnData = async state => await state.sudoku.end()

const sudokuResume: ActionUnData = async state => {
	const isGameScreen = state.screen.mainScreen === MainScreenKind.Game
	if (state.sudoku.isASaved && !isGameScreen) {
		await state.sudoku.resume(state.prefs.data.timer)
		state.screen.setMain(MainScreenKind.Game)
	} else state.sudoku.continue()
}

const sudokuSave: ActionUnData = async state => await state.sudoku.save()

const sudokuStart: ActionWithData<OptionalKeys<SudokuSetts, 'solution'> & DataAction> = async (
	state,
	{ difficulty, solution = Solution.create() }
) => {
	await state.sudoku.start({ difficulty, solution }, state.prefs.data.timer)
	state.screen.setMain(MainScreenKind.Game)
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
