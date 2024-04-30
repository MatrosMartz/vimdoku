import { IDLE_LANG } from '$i18n/domain/const'
import type { I18nRepo } from '$i18n/domain/repositories'
import { I18nSvc } from '$i18n/domain/services'
import { Route } from '$page/domain/entities'
import type { PageRepo } from '$page/domain/repositories'
import { PageSvc } from '$page/domain/services'
import { IDLE_PREFS } from '$pref/domain/models'
import type { PrefsRepo } from '$pref/domain/repositories'
import { PrefsSvc } from '$pref/domain/services'
import { Difficulty } from '$sudoku/domain/const'
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
			page: PageSvc.create(repos.page),
			prefs: PrefsSvc.create(repos.prefs),
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

		await this.#state.i18n
			.setDefaultLanguage(acceptLang ?? IDLE_LANG)
			.setLang(page.lang)
			.setRoute(page.route)
			.save()
		this.#state.sudoku.setData({ board, info, setts })

		if (Route.Game.is(page.route)) {
			if (board != null && info != null && setts != null) {
				this.#state.sudoku.resume(prefs?.timer ?? IDLE_PREFS.timer)
				this.#state.page.setRoute(new Route.Game(Difficulty.KINDS.keyByValue(setts.difficulty)))
			} else {
				await this.#state.sudoku
					.start(
						{ difficulty: Difficulty.KINDS.valueByKey(page.route.subRoute), solution: Solution.create() },
						prefs?.timer ?? IDLE_PREFS.timer
					)
					.save()
			}
		}
		this.#internalUnload = this.#repos.page.subscribe(async ({ lang, route }) => {
			if (!route.equals(this.#state.page.data.route)) this.#state.page.setRoute(route)
			if (this.#state.page.data.lang !== lang) this.#state.page.setLang(lang)
			if (this.#state.i18n.data.lang !== lang) await this.#state.i18n.setLang(lang ?? acceptLang!).save()
		})
	}

	async unload() {
		await this.#internalUnload?.()
	}
}
