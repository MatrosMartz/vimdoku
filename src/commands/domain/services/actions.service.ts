import { type Pos } from '~/share/domain/entities'
import type { OptionalKeys } from '~/share/types'
import type { Lang, Prefs, ToggleNames } from '$pref/domain/models'
import { Page } from '$screen/domain/entities'
import { type DialogData, DialogKind } from '$screen/domain/models'
import { Solution, type ValidNumbers } from '$sudoku/domain/entities'
import { type ModeKind, type SudokuSetts } from '$sudoku/domain/models'

import type { ActionUnData, ActionWithData, DataAction } from '../models'

// i18n Actions.
const changeLang: ActionWithData<{ lang: Lang }> = async ({ i18n, screen }, { lang }) => {
	screen.setLang(lang)
	await i18n.changeLang(lang)
}

export const I18N_ACTIONS = { changeLang }

// Pref actions.
interface SetPrefByKey<K extends keyof Prefs = keyof Prefs> {
	key: K
	type: 'by-key'
	value: Prefs[K]
}

type SetPrefData = { prefs: Prefs; type: 'all' } | SetPrefByKey

const setPref: ActionWithData<SetPrefData & DataAction> = async ({ i18n, prefs, screen }, data) => {
	if (data.type === 'all') await prefs.setAll(data.prefs).save()
	else await prefs.setByKey(data.key, data.value).save()

	screen.setLang(prefs.get('language'))
	await i18n.changeLang(prefs.get('language'))
}

type ResetPrefData = { type: 'all' } | { key: keyof Prefs; type: 'by-key' }

const resetPref: ActionWithData<ResetPrefData> = async ({ i18n, prefs, screen }, data) => {
	if (data.type === 'all') await prefs.resetAll().save()
	else await prefs.resetByKey(data.key).save()

	screen.setLang(prefs.get('language'))
	await i18n.changeLang(prefs.get('language'))
}

const invertPref: ActionWithData<{ pref: ToggleNames }> = async ({ prefs }, data) =>
	await prefs.setByKey(data.pref, !prefs.get(data.pref)).save()

export const PREFS_ACTIONS = { set: setPref, reset: resetPref, invert: invertPref }

// Screen Actions.
const closeScreen: ActionUnData = async ({ screen, sudoku }) => {
	const isGameRoute = Page.isGame(screen.route)
	const isNoneDialog = screen.dialog.kind === DialogKind.None
	if (isGameRoute && isNoneDialog && !sudoku.isASaved) {
		screen.setDialog({ kind: DialogKind.Warn, opts: { type: 'unsave' } })
		return
	}

	screen.close()

	if (isGameRoute && !isNoneDialog) sudoku.continue()
	else await sudoku.load()
}

const openDialog: ActionWithData<DialogData> = async ({ screen }, data) => screen.setDialog(data)

const goTo: ActionWithData<{ route: Page }> = async ({ screen, sudoku }, data) => {
	if (!Page.isGame(screen.route) && Page.isGame(data.route) && !sudoku.isASaved) {
		screen.setDialog({ kind: DialogKind.Warn, opts: { type: 'unsave' } })
		return
	}

	screen.gotTo(data.route)
}

export const SCREEN_ACTIONS = { close: closeScreen, openDialog, goTo }

// Sudoku actions.
const clearCell: ActionUnData = async ({ sudoku }) => {
	sudoku.clear()
}

const writeCell: ActionWithData<{ value: ValidNumbers | 0 }> = async (state, data) => {
	if (data.value === 0) return await clearCell(state)

	const { autoNoteDeletion: removeNotes, autoValidation: validate } = state.prefs.data
	state.sudoku.write(data.value, { removeNotes, validate })

	if (state.sudoku.hasWin) state.screen.setDialog({ kind: DialogKind.Win })
}

const verifyBoard: ActionUnData = async ({ sudoku }) => {
	sudoku.verify()
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

const moveSelection: ActionWithData<MoveSelectionData & DataAction> = async ({ sudoku }, data) => {
	if (data.type === 'set') sudoku.moveTo(data.pos)
	else sudoku.move(data.type, data.times)
}

const changeMode: ActionWithData<{ mode: ModeKind }> = async ({ sudoku }, data) => {
	sudoku.changeMode(data.mode)
}

const redoGame: ActionUnData = async ({ sudoku }) => {
	sudoku.redo()
}
const undoGame: ActionUnData = async ({ sudoku }) => {
	sudoku.undo()
}

const sudokuEnd: ActionUnData = async ({ sudoku }) => await sudoku.end()

const sudokuResume: ActionUnData = async ({ prefs, screen, sudoku }) => {
	if (sudoku.isASaved && !Page.isGame(screen.route)) {
		await sudoku.resume(prefs.get('timer'))
		screen.gotTo(Page.createGame(sudoku.difficulty!))
	} else sudoku.continue()
}

const sudokuSave: ActionUnData = async ({ sudoku }) => await sudoku.save()

const sudokuStart: ActionWithData<OptionalKeys<SudokuSetts, 'solution'> & DataAction> = async (
	{ prefs, screen, sudoku },
	{ difficulty, solution = Solution.create() }
) => {
	await sudoku.start({ difficulty, solution }, prefs.data.timer)
	screen.gotTo(Page.createGame(difficulty))
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
