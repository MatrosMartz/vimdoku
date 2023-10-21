import type { RemoveObserver } from '~/share/domain/models'
import { Observable } from '~/share/domain/services'
import { runAsync } from '~/share/utils'
import { type IPreferences, PrefActions, type PrefData } from '$preferences/domain/models'
import { type DialogData, type IScreen, ScreenActions, type ScreenData } from '$screen/domain/models'
import { type GameOpts, type IGame, SudokuActions, type SudokuData } from '$sudoku/domain/models'

import {
	type DispatchActions,
	type DispatchUnDataActions,
	type IMediator,
	type MediatorDispatch,
	type MediatorObservables,
	type MediatorObservers,
	type MediatorState,
	type StateKeys,
} from '../models'

interface MediatorArgs {
	game: IGame
	preferences: IPreferences
	screen: IScreen
}

function createObservables(): MediatorObservables {
	return { board: new Observable(), modes: new Observable(), preferences: new Observable(), screen: new Observable() }
}

export class MediatorService implements IMediator {
	#game
	#hasLoaded = false
	#observables = createObservables()
	#pref
	#screen

	constructor({ game, preferences, screen }: MediatorArgs) {
		this.#game = game
		this.#pref = preferences
		this.#screen = screen
	}

	dispatch<Action extends DispatchUnDataActions>(action: Action): void
	dispatch<Action extends DispatchActions>(action: Action, data: MediatorDispatch[Action]): void
	dispatch(action: unknown, data?: any) {
		runAsync(async () => {
			if (action === ScreenActions.Exit) this.#dExitScreen()
			else if (action === ScreenActions.OpenDialog) this.#dOpenDialog(data)
			else if (action === ScreenActions.OpenScreen) this.#dOpenScreen(data)
			else if (action === SudokuActions.ChangeMode) this.#dChangeMode(data)
			else if (action === SudokuActions.Erase) this.#dCellErase()
			else if (action === SudokuActions.Move) this.#dGameMove(data)
			else if (action === SudokuActions.End) await this.#dGameEnd()
			else if (action === SudokuActions.Save) await this.#dGameSave()
			else if (action === SudokuActions.Start) await this.#dGameStart(data)
			else if (action === SudokuActions.Write) this.#dGameWrite(data)
			else if (action === PrefActions.Reset) await this.#dPrefReset(data)
			else if (action === PrefActions.Save) await this.#dPrefSave(data)
		})
	}

	get<K extends StateKeys>(key: K): MediatorState[K]
	get(key: string) {
		if (key === 'board') return !this.#game.isStarted ? null : this.#game.board
		if (key === 'modes') return !this.#game.isStarted ? null : this.#game.mode
		if (key === 'preferences') return this.#pref.data
		if (key === 'preferences') return this.#pref.data
		if (key === 'screen') return this.#screen.data
	}

	async load() {
		if (this.#hasLoaded) return

		await Promise.all([this.#pref.load()])
		this.#observables.preferences.update(this.#pref.data)
		this.#hasLoaded = true
	}

	subscribe<K extends StateKeys>(key: K, observer: MediatorObservers[K]): RemoveObserver {
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
	}

	#dGameMove(data: SudokuData.Move) {
		if (data.type === 'down') this.#game.moveDown(data.times)
		if (data.type === 'left') this.#game.moveLeft(data.times)
		if (data.type === 'right') this.#game.moveRight(data.times)
		if (data.type === 'up') this.#game.moveUp(data.times)
		if (data.type === 'set') this.#game.changePos(data.position)
		this.#notify('board')
	}

	async #dGameSave() {
		await this.#game.save()
	}

	async #dGameStart(data: Partial<GameOpts>) {
		this.#game = await this.#game.start(data)
		this.#notify('board')
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
	 * Update subscribers of an observable.
	 * @param key The key of the observable to be updated.
	 */
	#notify<K extends StateKeys>(key: K) {
		this.#observables[key].update(this.get(key))
	}
}
