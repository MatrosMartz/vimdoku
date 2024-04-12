import { IDLE_LANG } from '$i18n/domain/const'
import type { I18nRepo } from '$i18n/domain/repositories'
import { I18nSvc } from '$i18n/domain/services'
import { IDLE_PREFS } from '$pref/domain/models'
import type { PrefsRepo } from '$pref/domain/repositories'
import { PrefsSvc } from '$pref/domain/services'
import { RouteBase } from '$screen/domain/entities'
import type { PageRepo } from '$screen/domain/repositories'
import { ScreenSvc } from '$screen/domain/services'
import { DifficultyKind, GET_DIFFICULTY_NAME } from '$sudoku/domain/const'
import { Solution } from '$sudoku/domain/entities'
import type { SudokuRepos } from '$sudoku/domain/repositories'
import { SudokuSvc } from '$sudoku/domain/services'

import type { Action, DataAction, IMed, State } from '../models'

export interface Repos {
	readonly i18n: I18nRepo
	readonly page: PageRepo
	readonly prefs: PrefsRepo
	readonly sudoku: SudokuRepos.All
}

/** Represent a Mediator Service. */
export class MedSvc implements IMed {
	#internalUnload?: () => Promise<void>
	#prev: Promise<void> | null = null
	readonly #repos
	readonly #state: State

	/**
	 * Creates an instance of the MedSvc class.
	 * @param repos An object contains necessary repos.
	 */
	constructor(repos: Repos) {
		this.#state = {
			i18n: I18nSvc.create(repos.i18n),
			prefs: PrefsSvc.create(repos.prefs),
			screen: ScreenSvc.create(repos.page),
			sudoku: SudokuSvc.create(repos.sudoku),
		}
		this.#repos = repos
	}

	dispatch<const Data extends DataAction | never>(action: Action<Data>, data?: Data) {
		const promise = async () => {
			await action({ ...this.#state }, data!)
			this.#prev = null
		}

		this.#prev = this.#prev != null ? this.#prev.then(promise) : promise()

		return this
	}

	async load() {
		if (this.#internalUnload != null) return

		const [page, prefs, acceptLang, { board, info, setts }] = await Promise.all([
			this.#repos.page.get(),
			this.#repos.prefs.get(),
			this.#repos.i18n.getLang(),
			this.#repos.sudoku.get(),
		])

		await this.#state.i18n.setDefaultLanguage(acceptLang ?? IDLE_LANG).set(page.unwrap())
		this.#state.sudoku.setData({ board, info, setts })

		if (RouteBase.isGame(page.route)) {
			if (board != null && info != null && setts != null) {
				this.#state.sudoku.resume(prefs?.timer ?? IDLE_PREFS.timer)
				this.#state.screen.setRoute(RouteBase.createGame(GET_DIFFICULTY_NAME[setts.difficulty]))
			} else {
				await this.#state.sudoku
					.start(
						{ difficulty: DifficultyKind[page.route.subRoute], solution: Solution.create() },
						prefs?.timer ?? IDLE_PREFS.timer
					)
					.save()
			}
		}
		this.#internalUnload = this.#repos.page.subscribe(async ({ lang, route }) => {
			if (!this.#state.screen.data.route.equals(route)) this.#state.screen.setRoute(route)
			if (this.#state.screen.lang !== lang) this.#state.screen.setLang(lang)
			if (this.#state.i18n.data.lang !== lang) await this.#state.i18n.set({ lang: lang ?? acceptLang! })
		})
	}

	async unload() {
		await this.#internalUnload?.()
	}
}
