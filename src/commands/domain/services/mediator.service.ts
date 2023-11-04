import type { RemoveObserver } from '~/share/domain/models'
import { Observable } from '~/share/domain/services'
import { runAsync } from '~/share/utils'
import { type IPreferences, PrefActions, type PrefData } from '$pref/domain/models'
import { type DialogData, type IScreen, ScreenActions, type ScreenData } from '$screen/domain/models'
import { type GameOpts, type IGame, SudokuActions, type SudokuData } from '$sudoku/domain/models'

import type { IMediator, Mediator } from '../models'

interface MediatorDeps {
	game: IGame
	preferences: IPreferences
	screen: IScreen
}

function createObservables(): Mediator.Observables {
	return {
		board: new Observable(),
		modes: new Observable(),
		position: new Observable(),
		timer: new Observable(),
		preferences: new Observable(),
		screen: new Observable(),
	}
}

/** Represent a Mediator Service. */
export class MediatorService implements IMediator {
	#game
	#hasLoaded = false
	#intervalId: ReturnType<typeof setInterval> | null = null
	#observables = createObservables()
	#pref
	#screen

	/**
	 * Creates an instance of the MediatorService class.
	 * @param deps An Object contains deps that the state manages.
	 */
	constructor(deps: MediatorDeps)
	constructor({ game, preferences, screen }: MediatorDeps) {
		this.#game = game
		this.#pref = preferences
		this.#screen = screen
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

	get<K extends Mediator.Keys>(key: K): Mediator.State[K]
	get<K extends Mediator.Keys>(key: K) {
		if (key === 'board') return this.#game.board
		if (key === 'modes') return this.#game.mode
		if (key === 'position') return this.#game.position
		if (key === 'preferences') return this.#pref.data
		if (key === 'screen') return this.#screen.data
		if (key === 'timer') return this.#game.timer
	}

	async load() {
		if (this.#hasLoaded) return

		await Promise.all([this.#pref.load()])
		this.#observables.preferences.update(this.#pref.data)
		this.#hasLoaded = true
	}

	subscribe<K extends Mediator.Keys>(key: K, observer: Mediator.Observers[K]): RemoveObserver {
		this.#observables[key].add(observer)
		observer(this.get(key))
		return () => this.#observables[key].remove(observer)
	}

	#dCellErase() {
		this.#game.clear()
		this.#notify('board')
	}

	#dChangeMode(data: SudokuData.ChangeMode) {
		this.#game.changeMode(data.mode)
		this.#notify('modes')
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
		this.#notify('board')
	}

	async #dGameResume() {
		await this.#game.resume()
	}

	async #dGameSave() {
		await this.#game.save()
	}

	async #dGameStart(data: Partial<GameOpts>) {
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
		this.#observables[key].update(this.get(key))
	}
}
