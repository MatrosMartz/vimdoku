import { runAsync } from '~/share/utils'
import { type IPrefs, PrefActions, type PrefData } from '$pref/domain/models'
import { type DialogData, type IScreen, MainScreenKinds, ScreenActions, type ScreenData } from '$screen/domain/models'
import { type GameOpts, type IGame, SudokuActions, type SudokuData } from '$sudoku/domain/models'

import type { IMediator, Mediator } from '../models'

interface MediatorDeps {
	game: IGame
	preferences: IPrefs
	screen: IScreen
	state: Mediator.State
}

/** Represent a Mediator Service. */
export class MediatorSvc implements IMediator {
	#game
	#hasLoaded = false
	#intervalId: ReturnType<typeof setInterval> | null = null
	readonly #pref
	readonly #screen
	readonly #state

	/**
	 * Creates an instance of the MediatorSvc class.
	 * @param deps An Object contains deps that the state manages.
	 */
	constructor(deps: MediatorDeps)
	constructor({ game, preferences, screen, state }: MediatorDeps) {
		this.#game = game
		this.#pref = preferences
		this.#screen = screen
		this.#state = state
		void this.load()
	}

	dispatch<Action extends Mediator.UnDataActions>(action: Action): this
	dispatch<Action extends Mediator.DataActions>(action: Action, data: Mediator.DataDispatch[Action]): this
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
		await Promise.all([this.#pref.load(), this.#game.load()])
		this.#notify('boardSaved')
		this.#notify('preferences')
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
		this.#notify('position')
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

		if (this.#pref.user.timer) {
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
		if (data.type === 'all') await this.#pref.resetAll().save()
		else await this.#pref.resetByKey(data.key).save()
	}

	async #dPrefSave(data: PrefData.Save) {
		if (data.type === 'all') await this.#pref.setAll(data.replace).save()
		else await this.#pref.setByKey(data.key, data.replace).save()
		this.#notify('preferences')
	}

	/**
	 * Updates the specified key in the observables with the current value from the state.
	 * @param key The key to update in the observables.
	 */
	#notify<K extends Mediator.Keys>(key: K) {
		if (key === 'board') this.#state.board.push(this.#game.board)
		else if (key === 'boardSaved') this.#state.boardSaved.push(this.#game.isASaved)
		else if (key === 'mode') this.#state.mode.push(this.#game.mode)
		else if (key === 'position') this.#state.position.push(this.#game.position)
		else if (key === 'preferences') this.#state.preferences.push(this.#pref.data)
		else if (key === 'screen') this.#state.screen.push(this.#screen.data)
		else if (key === 'timer') this.#state.timer.push(this.#game.timer)
	}
}
