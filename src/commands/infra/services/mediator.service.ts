import { MedSvc } from '$cmd/domain/services'
import { browserI18nRepo } from '$i18n/infra/repositories'
import { browserPrefsRepo } from '$pref/infra/repositories'
import { browserPageRepo } from '$screen/infra/repositories'
import { browserSudokuRepo } from '$sudoku/infra/repositories'

export const med = new MedSvc({
	i18n: browserI18nRepo,
	page: browserPageRepo,
	prefs: browserPrefsRepo,
	sudoku: browserSudokuRepo,
})
