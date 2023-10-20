import type { IObservable, RemoveObserver } from '~/share/domain/models'
import { Observable } from '~/share/domain/services'
import { runAsync } from '~/share/utils'
import { type IPreferences, type Preferences, PreferencesActions } from '$preferences/domain/models'
import { type IScreen, ScreenActions, type VimScreen } from '$screen/domain/models'
import { type Board, GameActions, type IGame, type ModeKinds } from '$sudoku/domain/models'

import { type DispatchArgs, type IVimMediator, type SubscriberArgs } from '../models'

interface MediatorArgs {
	game: IGame
	preferences: IPreferences
	screen: IScreen
}

interface MediatorSubscribers {
	board: IObservable<Board | null | undefined>
	modes: IObservable<ModeKinds | null | undefined>
	preferences: IObservable<Preferences>
	screen: IObservable<VimScreen>
}

export class MediatorService implements IVimMediator {
	#game
	#hasLoaded = false
	#pref
	#screen
	#subscribers = this.#initSubscribers()

	constructor({ game, preferences, screen }: MediatorArgs) {
		this.#game = game
		this.#pref = preferences
		this.#screen = screen
	}

	dispatch(args: DispatchArgs): void {
		switch (args.action) {
			case ScreenActions.ExitScreen:
				this.#screen.close()
				this.#subscribers.screen.update(this.#screen.data)
				break
			case ScreenActions.OpenDialog:
				this.#screen.setDialog(args.data)
				this.#subscribers.screen.update(this.#screen.data)
				break
			case ScreenActions.OpenScreen:
				this.#screen.setMain(args.data.screen)
				this.#subscribers.screen.update(this.#screen.data)
				break
			case GameActions.ChangeMode:
				if (this.#game.isStarted) {
					this.#game.changeMode(args.data.mode)
					this.#subscribers.board.update(this.#game.board)
				}
				break
			case GameActions.Erase:
				if (this.#game.isStarted) {
					this.#game.clear()
					this.#subscribers.board.update(this.#game.board)
				}
				break
			case GameActions.Move:
				if (this.#game.isStarted) {
					if (args.data.type === 'down') this.#game.moveDown(args.data.times)
					if (args.data.type === 'left') this.#game.moveLeft(args.data.times)
					if (args.data.type === 'right') this.#game.moveRight(args.data.times)
					if (args.data.type === 'up') this.#game.moveUp(args.data.times)
					if (args.data.type === 'set') this.#game.changePos(args.data.position)
					this.#subscribers.board.update(this.#game.board)
				}
				break
			case GameActions.RemoveGame:
				runAsync(async () => {
					if (this.#game.isStarted) this.#game = await this.#game.end()
					this.#subscribers.board.update(null)
				})
				break
			case GameActions.SaveGame:
				runAsync(async () => {
					if (this.#game.isStarted) await this.#game.save()
				})
				break
			case GameActions.StartGame:
				runAsync(async () => {
					if (!this.#game.isStarted) this.#game = await this.#game.start(args.data)
					this.#subscribers.board.update(this.#game.board)
				})
				break
			case GameActions.Write:
				if (this.#game.isStarted) {
					if (args.data.value === 0) this.#game.clear()
					else this.#game.write(args.data.value)
					this.#subscribers.board.update(this.#game.board)
				}

				break
			case PreferencesActions.ResetPref:
				runAsync(async () => {
					if (args.data.type === 'all') await this.#pref.resetAll().save()
					else await this.#pref.resetByKey(args.data.key).save()
				})
				break
			case PreferencesActions.SavePref:
				runAsync(async () => {
					if (args.data.type === 'all') await this.#pref.setAll(args.data.replace).save()
					else await this.#pref.setByKey(args.data.key, args.data.replace).save()
					this.#subscribers.preferences.update(this.#pref.data)
				})
				break
		}
	}

	async load() {
		await Promise.all([this.#pref.load()])
		this.#subscribers.preferences.update(this.#pref.data)
	}

	subscribe(args: SubscriberArgs): RemoveObserver {
		if (args.on === 'board') {
			this.#subscribers.board.add(args.observer)
			return () => this.#subscribers.board.remove(args.observer)
		}

		if (args.on === 'modes') {
			this.#subscribers.modes.add(args.observer)
			return () => this.#subscribers.modes.remove(args.observer)
		}

		if (args.on === 'preferences') {
			this.#subscribers.preferences.add(args.observer)
			args.observer(this.#pref.data)
			return () => this.#subscribers.preferences.remove(args.observer)
		}

		this.#subscribers.screen.add(args.observer)
		return () => this.#subscribers.screen.remove(args.observer)
	}

	#initSubscribers(): MediatorSubscribers {
		return { board: new Observable(), modes: new Observable(), preferences: new Observable(), screen: new Observable() }
	}
}
