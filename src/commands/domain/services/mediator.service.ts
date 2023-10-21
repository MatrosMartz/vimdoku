import type { Observer, RemoveObserver, SubscriberData } from '~/share/domain/models'
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
	type MediatorObservers,
	type MediatorSubscribers,
	type SubscribersKeys,
} from '../models'

interface MediatorArgs {
	game: IGame
	preferences: IPreferences
	screen: IScreen
}

function createSubscribers(): MediatorSubscribers {
	return { board: new Observable(), modes: new Observable(), preferences: new Observable(), screen: new Observable() }
}

export class MediatorService implements IMediator {
	#game
	#hasLoaded = false
	#pref
	#screen
	#subscribers = createSubscribers()

	constructor({ game, preferences, screen }: MediatorArgs) {
		this.#game = game
		this.#pref = preferences
		this.#screen = screen
	}

	dispatch<Action extends DispatchUnDataActions>(action: Action): void
	dispatch<Action extends DispatchActions>(action: Action, data: MediatorDispatch[Action]): void
	dispatch(action: unknown, data?: any) {
		if (action === ScreenActions.Exit) this.#dExitScreen()
		else if (action === ScreenActions.OpenDialog) this.#dOpenDialog(data)
		else if (action === ScreenActions.OpenScreen) this.#dOpenScreen(data)
		else if (action === SudokuActions.ChangeMode) this.#dChangeMode(data)
		else if (action === SudokuActions.Erase) this.#dCellErase()
		else if (action === SudokuActions.Move) this.#dGameMove(data)
		else if (action === SudokuActions.End) this.#dGameEnd()
		else if (action === SudokuActions.Save) this.#dGameSave()
		else if (action === SudokuActions.Start) this.#dGameStart(data)
		else if (action === SudokuActions.Write) this.#dGameWrite(data)
		else if (action === PrefActions.Reset) this.#dPrefReset(data)
		else if (action === PrefActions.Save) this.#dPrefSave(data)
	}

	get<S extends SubscribersKeys>(subscriber: S): SubscriberData<MediatorSubscribers[S]>
	get(subscriber: string) {
		if (subscriber === 'board') return !this.#game.isStarted ? null : this.#game.board
		if (subscriber === 'modes') return !this.#game.isStarted ? null : this.#game.mode
		if (subscriber === 'preferences') return this.#pref.data
		if (subscriber === 'preferences') return this.#pref.data
		if (subscriber === 'screen') return this.#screen.data
	}

	async load() {
		if (this.#hasLoaded) return

		await Promise.all([this.#pref.load()])
		this.#subscribers.preferences.update(this.#pref.data)
		this.#hasLoaded = true
	}

	subscribe<S extends SubscribersKeys>(subscriber: S, observer: MediatorObservers[S]): RemoveObserver
	subscribe(subscriber: string, observer: Observer<any>) {
		if (subscriber === 'board') return this.#subscribeInternal(subscriber, observer)
		if (subscriber === 'modes') return this.#subscribeInternal(subscriber, observer)
		if (subscriber === 'preferences') return this.#subscribeInternal(subscriber, observer)
		if (subscriber === 'screen') return this.#subscribeInternal(subscriber, observer)
	}

	#dCellErase() {
		if (this.#game.isStarted) {
			this.#game.clear()
			this.#update('board')
		}
	}

	#dChangeMode(data: SudokuData.ChangeMode) {
		if (this.#game.isStarted) {
			this.#game.changeMode(data.mode)
			this.#update('modes')
		}
	}

	#dExitScreen() {
		this.#screen.close()
		this.#update('screen')
	}

	#dGameEnd() {
		runAsync(async () => {
			if (this.#game.isStarted) this.#game = await this.#game.end()
			this.#update('board')
		})
	}

	#dGameMove(data: SudokuData.Move) {
		if (this.#game.isStarted) {
			if (data.type === 'down') this.#game.moveDown(data.times)
			if (data.type === 'left') this.#game.moveLeft(data.times)
			if (data.type === 'right') this.#game.moveRight(data.times)
			if (data.type === 'up') this.#game.moveUp(data.times)
			if (data.type === 'set') this.#game.changePos(data.position)
			this.#update('board')
		}
	}

	#dGameSave() {
		runAsync(async () => {
			if (this.#game.isStarted) await this.#game.save()
		})
	}

	#dGameStart(data: Partial<GameOpts>) {
		runAsync(async () => {
			if (!this.#game.isStarted) this.#game = await this.#game.start(data)
			this.#update('board')
		})
	}

	#dGameWrite(data: SudokuData.Write) {
		if (this.#game.isStarted) {
			if (data.value === 0) this.#game.clear()
			else this.#game.write(data.value)
			this.#update('board')
		}
	}

	#dOpenDialog(data: DialogData) {
		this.#screen.setDialog(data)
		this.#update('screen')
	}

	#dOpenScreen(data: ScreenData.OpenScreen) {
		this.#screen.setMain(data.screen)
		this.#update('screen')
	}

	#dPrefReset(data: PrefData.Reset) {
		runAsync(async () => {
			if (data.type === 'all') await this.#pref.resetAll().save()
			else await this.#pref.resetByKey(data.key).save()
		})
	}

	#dPrefSave(data: PrefData.Save) {
		runAsync(async () => {
			if (data.type === 'all') await this.#pref.setAll(data.replace).save()
			else await this.#pref.setByKey(data.key, data.replace).save()
			this.#update('preferences')
		})
	}

	#subscribeInternal(subscriber: SubscribersKeys, observer: Observer<any>) {
		this.#subscribers[subscriber].add(observer)
		observer(this.get(subscriber))
		return () => this.#subscribers[subscriber].remove(observer)
	}

	#update(key: SubscribersKeys) {
		this.#subscribers[key].update(this.get(key))
	}
}
