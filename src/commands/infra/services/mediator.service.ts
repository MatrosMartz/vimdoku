import { MedSvc } from '$cmd/domain/services'
import { i18n } from '$i18n/infra/services'
import { prefs } from '$pref/infra/services'
import { vimScreen } from '$screen/infra/services'
import { game } from '$sudoku/infra/services'

export const med = new MedSvc({ game, i18n, prefs, screen: vimScreen })
