import type { Pos } from '~/share/domain/entities'
import type { OptionalKeys } from '~/share/types'
import type { Lang } from '$i18n/domain/const'
import { Modal, Route } from '$page/domain/entities'
import type { Prefs, PREFS_FIELDS } from '$pref/domain/models'
import { Difficulty } from '$sudoku/domain/const'
import { Solution, type ValidNumbers } from '$sudoku/domain/entities'
import { type SudokuSetts } from '$sudoku/domain/models'

import type { Modes } from '../const'
import type { ActionUnData, ActionWithData, DataAction } from '../models'

// i18n Actions.
const changeLang: ActionWithData<{ lang: Lang }> = async ({ i18n, page: screen }, { lang }) => {
	await Promise.all([screen.setLang(lang).save(), i18n.setLang(lang).save()])
}

export const I18N_ACTIONS = { changeLang }

// Pref actions.
interface SetPrefByKey<K extends keyof Prefs = keyof Prefs> {
	key: K
	type: 'by-key'
	value: Prefs[K]
}

type SetPrefData = { prefs: Prefs; type: 'all' } | SetPrefByKey

const setPref: ActionWithData<SetPrefData & DataAction> = async ({ i18n, prefs, page: screen }, data) => {
	if (data.type === 'all') await prefs.setAll(data.prefs).save()
	else await prefs.setByKey(data.key, data.value).save()
}

type ResetPrefData = { type: 'all' } | { key: keyof Prefs; type: 'by-key' }

const resetPref: ActionWithData<ResetPrefData> = async ({ i18n, prefs, page: screen }, data) => {
	if (data.type === 'all') await prefs.resetAll().save()
	else await prefs.resetByKey(data.key).save()
}

const invertPref: ActionWithData<{ pref: PREFS_FIELDS.subs.TOGGLE.Key }> = async ({ prefs }, data) =>
	await prefs.setByKey(data.pref, !prefs.data[data.pref]).save()

export const PREFS_ACTIONS = { set: setPref, reset: resetPref, invert: invertPref }

// Screen Actions.
const backScreen: ActionUnData = async ({ i18n, page: screen, sudoku }) => {
	const isGameRoute = Route.Game.is(screen.data.route)
	const isNoneDialog = Modal.None.is(screen.data.modal)
	if (isGameRoute && isNoneDialog && !sudoku.isASaved) {
		screen.setModal(new Modal.Warn(Modal.WarnType.unsave))
		return
	}

	await screen.back()
	await i18n.setRoute(screen.data.route).save()

	if (isGameRoute && !isNoneDialog) sudoku.continue()
	else await sudoku.end()
}

const openModal: ActionWithData<{ modal: Modal.Modal }> = async ({ page: screen }, data) => {
	screen.setModal(data.modal)
}

const goTo: ActionWithData<{ route: Route.Route }> = async ({ i18n, page: screen, sudoku }, { route }) => {
	if (!Route.Game.is(screen.data.route) && Route.Game.is(route) && !sudoku.isASaved) {
		screen.setModal(new Modal.Warn(Modal.WarnType.unsave))
		return
	}

	await Promise.all([screen.setRoute(route).save(), i18n.setRoute(route).save()])
}

export const SCREEN_ACTIONS = { back: backScreen, openModal, goTo }

// Sudoku actions.
const clearCell: ActionUnData = async ({ sudoku }) => {
	sudoku.clear()
}

const writeCell: ActionWithData<{ value: ValidNumbers | 0 }> = async (state, data) => {
	if (data.value === 0) return await clearCell(state)

	const { autoNoteDeletion: removeNotes, autoValidation: validate } = state.prefs.data
	state.sudoku.write(data.value, { removeNotes, validate })

	if (state.sudoku.hasWin) state.page.setModal(new Modal.Win())
}

const verifyBoard: ActionUnData = async ({ sudoku }) => {
	sudoku.verify()
}

interface MoveDir {
	times: number
	type: 'Down' | 'Left' | 'Right' | 'Up'
}
interface MoveSet {
	pos: Pos.Pos
	type: 'set'
}

type MoveSelectionData = MoveDir | MoveSet

const moveSelection: ActionWithData<MoveSelectionData & DataAction> = async ({ sudoku }, data) => {
	if (data.type === 'set') sudoku.moveTo(data.pos)
	else sudoku.move(data.type, data.times)
}

const changeMode: ActionWithData<{ mode: Modes.Kind }> = async ({ sudoku }, data) => {
	sudoku.changeMode(data.mode)
}

const redoGame: ActionUnData = async ({ sudoku }) => {
	sudoku.redo()
}
const undoGame: ActionUnData = async ({ sudoku }) => {
	sudoku.undo()
}

const sudokuEnd: ActionUnData = async ({ sudoku }) => await sudoku.end()

const sudokuResume: ActionUnData = async ({ prefs, page: screen, sudoku }) => {
	if (sudoku.isASaved && !Route.Game.is(screen.data.route)) {
		sudoku.resume(prefs.data.timer)
		await screen.setRoute(new Route.Game(Difficulty.KINDS.keyByValue(sudoku.setts!.difficulty))).save()
	} else sudoku.continue()
}

const sudokuSave: ActionUnData = async ({ sudoku }) => await sudoku.save()

const sudokuStart: ActionWithData<OptionalKeys<SudokuSetts, 'solution'> & DataAction> = async (
	{ prefs, page: screen, sudoku },
	{ difficulty, solution = Solution.create() }
) => {
	await Promise.all([
		sudoku.start({ difficulty, solution }, prefs.data.timer).save(),
		screen.setRoute(new Route.Game(Difficulty.KINDS.keyByValue(difficulty))).save(),
	])
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
