import { runAsync } from '~/share/utils'
import { type IPrefs, PrefActions, type PrefData } from '$pref/domain/models'
import { type DialogData, type IScreen, MainScreenKinds, ScreenActions, type ScreenData } from '$screen/domain/models'
import { type GameOpts, type IGame, SudokuActions, type SudokuData } from '$sudoku/domain/models'

import type { IMed, Med } from '../models'

interface MediatorDeps {
	game: IGame
	prefs: IPrefs
	screen: IScreen
	state: Med.State
}

/** Represent a Mediator Service. */
export class MedSvc implements IMed {
	#game
	#hasLoaded = false
	#intervalId: ReturnType<typeof setInterval> | null = null
	readonly #prefs
	readonly #screen
	readonly #state

	/**
	 * Creates an instance of the MedSvc class.
	 * @param deps An Object contains deps that the state manages.
	 */
	constructor(deps: MediatorDeps)
	constructor({ game, prefs, screen, state }: MediatorDeps) {
		this.#game = game
		this.#prefs = prefs
		this.#screen = screen
		this.#state = state
		void this.load()
	}

	dispatch<Action extends Med.UnDataActions>(action: Action): this
	dispatch<Action extends Med.DataActions>(action: Action, data: Med.DataDispatch[Action]): this
	dispatch(action: unknown, data?: any) {
		runAsync(async () => {
			if (action === ScreenActions.Exit) this.#dExitScreen()
			else if (action === ScreenActions.OpenDialog) this.#dOpenDialog(data)
			else if (action === ScreenActions.OpenScreen) this.#dOpenScreen(data)
			else if (action === SudokuActions.ChangeMode) this.#dChangeMode(data)
			else if (action === SudokuActions.Erase) this.#dCellErase()
			else if (action === SudokuActions.Move) this.#dGameMove(data)
			else if (action === SudokuActions.End) await this.#dGameEnd()
			else if (action === SudokuActions.Resume) await this.#dGameResume()
			else if (action === SudokuActions.Save) await this.#dGameSave()
			else if (action === SudokuActions.Start) await this.#dGameStart(data)
			else if (action === SudokuActions.Write) this.#dGameWrite(data)
			else if (action === PrefActions.Reset) await this.#dPrefReset(data)
			else if (action === PrefActions.Save) await this.#dPrefSave(data)
		})
		return this
	}

	async load() {
		if (this.#hasLoaded) return
		await Promise.all([this.#prefs.load(), this.#game.load()])
		this.#notify('boardSaved')
		this.#notify('prefs')
		this.#hasLoaded = true
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

	async #dGameEnd() {
		this.#game = await this.#game.end()
		this.#notify('board')
		clearInterval(this.#intervalId ?? 0)
		this.#intervalId = null
	}

	#dGameMove(data: SudokuData.Move) {
		if (data.type === 'down') this.#game.moveDown(data.times)
		if (data.type === 'left') this.#game.moveLeft(data.times)
		if (data.type === 'right') this.#game.moveRight(data.times)
		if (data.type === 'up') this.#game.moveUp(data.times)
		if (data.type === 'set') this.#game.changePos(data.position)
		this.#notify('pos')
	}

	async #dGameResume() {
		const newGame = await this.#game.resume()
		if (newGame != null) {
			this.#game = newGame
			this.#notify('board')
			this.#screen.setMain(MainScreenKinds.Game)
			this.#notify('screen')
		}
	}

	async #dGameSave() {
		await this.#game.save()
	}

	async #dGameStart(data: Partial<GameOpts>) {
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

	#dGameWrite(data: SudokuData.Write) {
		if (data.value === 0) this.#game.clear()
		else this.#game.write(data.value)
		this.#notify('board')
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
	}

	async #dPrefSave(data: PrefData.Save) {
		if (data.type === 'all') await this.#prefs.setAll(data.replace).save()
		else await this.#prefs.setByKey(data.key, data.replace).save()
		this.#notify('prefs')
	}

	/**
	 * Updates the specified key in the observables with the current value from the state.
	 * @param key The key to update in the observables.
	 */
	#notify<K extends Med.Keys>(key: K) {
		if (key === 'board') this.#state.board.update(this.#game.board)
		else if (key === 'boardSaved') this.#state.boardSaved.update(this.#game.isASaved)
		else if (key === 'mode') this.#state.mode.update(this.#game.mode)
		else if (key === 'pos') this.#state.pos.update(this.#game.pos)
		else if (key === 'prefs') this.#state.prefs.update(this.#prefs.data)
		else if (key === 'screen') this.#state.screen.update(this.#screen.data)
		else if (key === 'timer') this.#state.timer.update(this.#game.timer)
	}
}
