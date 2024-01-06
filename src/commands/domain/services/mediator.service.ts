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
import { type IGame, SudokuAction, type SudokuData } from '$sudoku/domain/models'
import { SolutionSvc } from '$sudoku/domain/services'

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
		match(action, {
			[ScreenAction.Exit]: () => this.#dExitScreen(),
			[ScreenAction.OpenDialog]: () => this.#dOpenDialog(data),
			[ScreenAction.OpenScreen]: () => this.#dOpenScreen(data),
			[SudokuAction.ChangeMode]: () => this.#dChangeMode(data),
			[SudokuAction.Check]: () => this.#dSudokuCheck(),
			[SudokuAction.Erase]: () => this.#dCellErase(),
			[SudokuAction.Move]: () => this.#dSudokuMove(data),
			[SudokuAction.End]: () => {
				void this.#dSudokuEnd()
			},
			[SudokuAction.Redo]: () => this.#dRedo(),
			[SudokuAction.Resume]: () => {
				void this.#dSudokuResume()
			},
			[SudokuAction.Save]: () => {
				void this.#dSudokuSave()
			},
			[SudokuAction.Start]: () => {
				void this.#dSudokuStart(data)
			},
			[SudokuAction.Undo]: () => this.#dUndo(),
			[SudokuAction.Write]: () => this.#dSudokuWrite(data),
			[PrefAction.Reset]: () => {
				void this.#dPrefReset(data)
			},
			[PrefAction.Save]: () => {
				void this.#dPrefSave(data)
			},
		})

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
		this.#screen.close()
		if (this.#screen.data.main === MainScreenKind.Game && this.#screen.data.dialog.kind === DialogKind.None)
			this.#game.timerStart()
		if (this.#screen.data.main !== MainScreenKind.Game) this.#game.timerReset()
	}

	#dOpenDialog(data: DialogData) {
		this.#screen.setDialog(data)
		if (this.#screen.data.main === MainScreenKind.Game && this.#screen.data.dialog.kind !== DialogKind.None)
			this.#game.timerPause()
	}

	#dOpenScreen(data: ScreenData.OpenScreen) {
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

	async #dSudokuStart({ difficulty, solution = SolutionSvc.create() }: SudokuData.Start) {
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
