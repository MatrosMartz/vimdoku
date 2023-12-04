import { match } from '~/share/utils'
import type { II18n } from '$i18n/domain/models'
import { type IPrefs, type Langs, PrefActions, type PrefData } from '$pref/domain/models'
import { type DialogData, type IScreen, MainScreenKinds, ScreenActions, type ScreenData } from '$screen/domain/models'
import { type GameOpts, type IGame, SudokuActions, type SudokuData } from '$sudoku/domain/models'

import type { IMed, Med } from '../models'

interface MediatorDeps {
	game: IGame
	i18n: II18n
	prefs: IPrefs
	screen: IScreen
	state: Med.State
}

/** Represent a Mediator Service. */
export class MedSvc implements IMed {
	#game
	#hasLoaded = false
	readonly #i18n
	#intervalId: ReturnType<typeof setInterval> | null = null
	readonly #prefs
	readonly #screen
	readonly #state

	/**
	 * Creates an instance of the MedSvc class.
	 * @param deps An Object contains deps that the state manages.
	 */
	constructor({ game, i18n, prefs, screen, state }: MediatorDeps) {
		this.#game = game
		this.#i18n = i18n
		this.#prefs = prefs
		this.#screen = screen
		this.#state = state
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
			[SudokuActions.End]: async () => await this.#dSudokuEnd(),
			[SudokuActions.Resume]: async () => await this.#dSudokuResume(),
			[SudokuActions.Save]: async () => await this.#dSudokuSave(),
			[SudokuActions.Start]: async () => await this.#dSudokuStart(data),
			[SudokuActions.Write]: () => this.#dSudokuWrite(data),
			[PrefActions.Reset]: async () => await this.#dPrefReset(data),
			[PrefActions.Save]: async () => await this.#dPrefSave(data),
		})

		return this
	}

	async load() {
		if (this.#hasLoaded) return
		await Promise.all([this.#prefs.load(), this.#game.load()])
		this.#notify('boardSaved')
		this.#notify('prefs')
		await this.#changeLang(this.#prefs.data.user.language)
		this.#hasLoaded = true
	}

	async #changeLang(lang: Langs) {
		if (this.#i18n.actualLang === lang) return

		await this.#i18n.changeLang(lang)

		this.#notify('i18n')
	}

	#dCellErase() {
		this.#game.clear()
		this.#notify('board')
	}

	#dChangeMode(data: SudokuData.ChangeMode) {
		this.#game.changeMode(data.mode)
		this.#notify('mode')
	}

	#dExitScreen() {
		this.#screen.close()
		this.#notify('screen')
	}

	#dOpenDialog(data: DialogData) {
		this.#screen.setDialog(data)
		this.#notify('screen')
	}

	#dOpenScreen(data: ScreenData.OpenScreen) {
		this.#screen.setMain(data.screen)
		this.#notify('screen')
	}

	async #dPrefReset(data: PrefData.Reset) {
		if (data.type === 'all') await this.#prefs.resetAll().save()
		else await this.#prefs.resetByKey(data.key).save()
		this.#notify('prefs')
		await this.#changeLang(this.#prefs.data.user.language)
	}

	async #dPrefSave(data: PrefData.Save) {
		if (data.type === 'all') await this.#prefs.setAll(data.replace).save()
		else await this.#prefs.setByKey(data.key, data.replace).save()
		this.#notify('prefs')
		await this.#changeLang(this.#prefs.data.user.language)
	}

	#dSudokuCheck() {}

	async #dSudokuEnd() {
		this.#game = await this.#game.end()
		this.#notify('board')
		clearInterval(this.#intervalId ?? 0)
		this.#intervalId = null
	}

	#dSudokuMove(data: SudokuData.Move) {
		if (data.type === 'down') this.#game.moveDown(data.times)
		if (data.type === 'left') this.#game.moveLeft(data.times)
		if (data.type === 'right') this.#game.moveRight(data.times)
		if (data.type === 'up') this.#game.moveUp(data.times)
		if (data.type === 'set') this.#game.changePos(data.position)
		this.#notify('pos')
	}

	async #dSudokuResume() {
		const newGame = await this.#game.resume()
		if (newGame != null) {
			this.#game = newGame
			this.#notify('board')
			this.#screen.setMain(MainScreenKinds.Game)
			this.#notify('screen')
		}
	}

	async #dSudokuSave() {
		await this.#game.save()
	}

	async #dSudokuStart(data: Partial<GameOpts>) {
		this.#screen.setMain(MainScreenKinds.Game)
		this.#notify('screen')
		this.#game = await this.#game.start(data)
		this.#notify('board')

		if (this.#prefs.user.timer) {
			this.#intervalId = setInterval(() => {
				this.#game.timerInc()
				this.#notify('timer')
			}, 1000)
		}
	}

	#dSudokuWrite(data: SudokuData.Write) {
		if (data.value === 0) this.#game.clear()
		else this.#game.write(data.value)
		this.#notify('board')
	}

	/**
	 * Updates the specified key in the observables with the current value from the state.
	 * @param key The key to update in the observables.
	 */
	#notify<K extends Med.Keys>(key: K) {
		match<Med.Keys>(key, {
			board: () => this.#state.board.update(this.#game.board),
			boardSaved: () => this.#state.boardSaved.update(this.#game.isASaved),
			i18n: () => this.#state.i18n.update(this.#i18n.data),
			mode: () => this.#state.mode.update(this.#game.mode),
			pos: () => this.#state.pos.update(this.#game.pos),
			prefs: () => this.#state.prefs.update(this.#prefs.data),
			screen: () => this.#state.screen.update(this.#screen.data),
			timer: () => this.#state.timer.update(this.#game.timer),
		})
	}
}
