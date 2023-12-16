import { match } from '~/share/utils'
import type { II18n } from '$i18n/domain/models'
import { type IPrefs, type Langs, PrefActions, type PrefData } from '$pref/domain/models'
import {
	type DialogData,
	DialogKinds,
	type IScreen,
	MainScreenKinds,
	ScreenActions,
	type ScreenData,
} from '$screen/domain/models'
import { type GameOpts, type IGame, SudokuActions, type SudokuData } from '$sudoku/domain/models'

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
			[ScreenActions.Exit]: () => this.#dExitScreen(),
			[ScreenActions.OpenDialog]: () => this.#dOpenDialog(data),
			[ScreenActions.OpenScreen]: () => this.#dOpenScreen(data),
			[SudokuActions.ChangeMode]: () => this.#dChangeMode(data),
			[SudokuActions.Check]: () => this.#dSudokuCheck(),
			[SudokuActions.Erase]: () => this.#dCellErase(),
			[SudokuActions.Move]: () => this.#dSudokuMove(data),
			[SudokuActions.End]: () => {
				void this.#dSudokuEnd()
			},
			[SudokuActions.Resume]: () => {
				void this.#dSudokuResume()
			},
			[SudokuActions.Save]: () => {
				void this.#dSudokuSave()
			},
			[SudokuActions.Start]: () => {
				void this.#dSudokuStart(data)
			},
			[SudokuActions.Write]: () => this.#dSudokuWrite(data),
			[PrefActions.Reset]: () => {
				void this.#dPrefReset(data)
			},
			[PrefActions.Save]: () => {
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

	async #changeLang(lang: Langs) {
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
		if (this.#screen.data.main === MainScreenKinds.Game && this.#screen.data.dialog.kind === DialogKinds.None)
			this.#game.timerStart()
		if (this.#screen.data.main !== MainScreenKinds.Game) this.#game.timerReset()
	}

	#dOpenDialog(data: DialogData) {
		this.#screen.setDialog(data)
		if (this.#screen.data.main === MainScreenKinds.Game && this.#screen.data.dialog.kind !== DialogKinds.None)
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
		this.#screen.setMain(MainScreenKinds.Game)
		if (this.#prefs.data.timer) this.#game.timerStart()
	}

	async #dSudokuSave() {
		await this.#game.save()
	}

	async #dSudokuStart(data: Partial<GameOpts>) {
		this.#screen.setMain(MainScreenKinds.Game)
		this.#game = await this.#game.start(data)
		if (this.#prefs.data.timer) this.#game.timerStart()
	}

	#dSudokuWrite(data: SudokuData.Write) {
		if (data.value === 0) this.#game.clear()
		else this.#game.write(data.value, this.#prefs.data.autoNoteDeletion, this.#prefs.data.autoValidation)

		if (this.#game.hasWin) {
			this.#screen.setDialog({ kind: DialogKinds.Win })
			this.#game.timerPause()
		}
	}
}
