import { IDLE_POS } from '~/share/domain/entities'
import { match } from '~/share/utils'
import type { II18n } from '$i18n/domain/models'
import { type IPrefs, type Lang, PrefAction, type PrefData } from '$pref/domain/models'
import {
	type DialogData,
	DialogKind,
	type IScreen,
	MainScreenKind,
	ScreenAction,
	type ScreenData,
} from '$screen/domain/models'
import { Solution } from '$sudoku/domain/entities'
import { type IGame, ModeKind, SudokuAction, type SudokuData } from '$sudoku/domain/models'

import type { IMed, Med } from '../models'

interface MediatorDeps {
	game: IGame
	i18n: II18n
	prefs: IPrefs
	screen: IScreen
}

/** Represent a Mediator Service. */
export class MedSvc implements IMed {
	#game
	#hasLoaded = false
	readonly #i18n
	readonly #prefs
	readonly #screen

	/**
	 * Creates an instance of the MedSvc class.
	 * @param deps An Object contains deps that the state manages.
	 */
	constructor(deps: MediatorDeps)
	constructor({ game, i18n, prefs, screen }: MediatorDeps) {
		this.#game = game
		this.#i18n = i18n
		this.#prefs = prefs
		this.#screen = screen
		void this.load()
	}

	dispatch<Action extends Med.UnDataActions>(action: Action): this
	dispatch<Action extends Med.DataActions>(action: Action, data: Med.DataDispatch[Action]): this
	dispatch(action: Med.Actions, data?: any) {
		match(action)
			.case([ScreenAction.Exit], () => this.#dExitScreen())
			.case([ScreenAction.OpenDialog], () => this.#dOpenDialog(data))
			.case([ScreenAction.OpenScreen], () => this.#dOpenScreen(data))
			.case([SudokuAction.ChangeMode], () => this.#dChangeMode(data))
			.case([SudokuAction.Check], () => this.#dSudokuCheck())
			.case([SudokuAction.Erase], () => this.#dCellErase())
			.case([SudokuAction.Move], () => this.#dSudokuMove(data))
			.case([SudokuAction.End], () => {
				void this.#dSudokuEnd()
			})
			.case([SudokuAction.Redo], () => this.#dRedo())
			.case([SudokuAction.Resume], () => {
				void this.#dSudokuResume()
			})
			.case([SudokuAction.Save], () => {
				void this.#dSudokuSave()
			})
			.case([SudokuAction.Start], () => {
				void this.#dSudokuStart(data)
			})
			.case([SudokuAction.Undo], () => this.#dUndo())
			.case([SudokuAction.Write], () => this.#dSudokuWrite(data))
			.case([PrefAction.Reset], () => {
				void this.#dPrefReset(data)
			})
			.case([PrefAction.Save], () => {
				void this.#dPrefSave(data)
			})
			.done()

		return this
	}

	async load() {
		if (this.#hasLoaded) return
		await Promise.all([this.#prefs.load(), this.#game.load()])
		await this.#changeLang(this.#prefs.data.language)
		this.#hasLoaded = true
	}

	async #changeLang(lang: Lang) {
		if (this.#i18n.actualLang === lang) return
		await this.#i18n.changeLang(lang)
	}

	#dCellErase() {
		this.#game.clear()
	}

	#dChangeMode(data: SudokuData.ChangeMode) {
		this.#game.changeMode(data.mode)
	}

	#dExitScreen() {
		if (
			this.#screen.data.main === MainScreenKind.Game &&
			this.#screen.data.dialog.kind === DialogKind.None &&
			!this.#game.isASaved
		) {
			this.#screen.setDialog({ kind: DialogKind.Warn, opts: { type: 'unsave' } })
			return
		}

		this.#screen.close()
		if (this.#screen.data.main === MainScreenKind.Game && this.#screen.data.dialog.kind === DialogKind.None) {
			this.#game.timerStart()
		} else if (this.#screen.data.main === MainScreenKind.Game || this.#screen.data.dialog.kind !== DialogKind.None) {
			this.#game.timerPause()
		} else {
			this.#game.timerPause().timerReset().changeMode(ModeKind.X).changePos(IDLE_POS)
		}
	}

	#dOpenDialog(data: DialogData) {
		this.#screen.setDialog(data)
		if (this.#screen.data.main === MainScreenKind.Game && this.#screen.data.dialog.kind !== DialogKind.None)
			this.#game.timerPause()
	}

	#dOpenScreen(data: ScreenData.OpenScreen) {
		if (this.#screen.data.main === MainScreenKind.Game && !this.#game.isASaved) {
			this.#screen.setDialog({ kind: DialogKind.Warn, opts: { type: 'unsave' } })
			return
		}
		this.#screen.setMain(data.screen)
	}

	async #dPrefReset(data: PrefData.Reset) {
		if (data.type === 'all') await this.#prefs.resetAll().save()
		else await this.#prefs.resetByKey(data.key).save()
		await this.#changeLang(this.#prefs.data.language)
	}

	async #dPrefSave(data: PrefData.Save) {
		if (data.type === 'all') await this.#prefs.setAll(data.replace).save()
		else await this.#prefs.setByKey(data.key, data.replace).save()
		await this.#changeLang(this.#prefs.data.language)
	}

	#dRedo() {
		this.#game.redo()
	}

	#dSudokuCheck() {
		this.#game.verify()
	}

	async #dSudokuEnd() {
		this.#game = await this.#game.end()
		this.#game.timerPause()
	}

	#dSudokuMove(data: SudokuData.Move) {
		if (data.type === 'down') this.#game.moveDown(data.times)
		if (data.type === 'left') this.#game.moveLeft(data.times)
		if (data.type === 'right') this.#game.moveRight(data.times)
		if (data.type === 'up') this.#game.moveUp(data.times)
		if (data.type === 'set') this.#game.changePos(data.position)
	}

	async #dSudokuResume() {
		const newGame = await this.#game.resume()
		if (newGame == null) return
		this.#game = newGame
		this.#screen.setMain(MainScreenKind.Game)
		if (this.#prefs.data.timer) this.#game.timerStart()
	}

	async #dSudokuSave() {
		await this.#game.save()
	}

	async #dSudokuStart({ difficulty, solution = Solution.create() }: SudokuData.Start) {
		this.#screen.setMain(MainScreenKind.Game)
		this.#game = await this.#game.start({ difficulty, solution })
		if (this.#prefs.data.timer) this.#game.timerStart()
	}

	#dSudokuWrite(data: SudokuData.Write) {
		if (data.value === 0) this.#game.clear()
		else {
			const { autoNoteDeletion: removeNotes, autoValidation: validate } = this.#prefs.data
			this.#game.write(data.value, { removeNotes, validate })
		}

		if (this.#game.hasWin) {
			this.#screen.setDialog({ kind: DialogKind.Win })
			this.#game.timerPause()
		}
	}

	#dUndo() {
		this.#game.undo()
	}
}
