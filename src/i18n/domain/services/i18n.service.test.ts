import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest'

import type { PagesKeys } from '~/locales'
import { mockSingleton } from '~/share/utils'
import { Route } from '$page/domain/entities'

import { Lang } from '../const'
import { type I18n, IDLE_I18N } from '../entities'
import { I18nSvc } from './i18n.service'
import { I18nObs } from './i18n-obs.service'

interface I18nTestCtx {
	findNSMock: Mock<[lang: Lang, page: PagesKeys], Promise<I18n['ns']>>
	i18nObsMock: I18nObs
	i18nSvc: I18nSvc
}

beforeEach<I18nTestCtx>(ctx => {
	ctx.i18nObsMock = mockSingleton(I18nObs, () => {
		const mock = new I18nObs()

		Object.defineProperties(mock, {
			add: { value: vi.fn(mock.add) },
			remove: { value: vi.fn(mock.remove) },
			set: { value: vi.fn(mock.set) },
			update: { value: vi.fn(mock.update) },
		})

		return mock
	})

	ctx.findNSMock = vi.fn(async (lang: Lang, page: PagesKeys) => await Promise.resolve(IDLE_I18N.ns))
	ctx.i18nSvc = new I18nSvc(ctx.findNSMock)
	return () => vi.clearAllMocks()
})

describe.concurrent('I18nSvc', () => {
	test<I18nTestCtx>('Should call the findNamespace with the default language and home page.', async ({
		findNSMock,
		i18nSvc,
	}) => {
		await i18nSvc.setDefaultLanguage(Lang.EN).setRoute(new Route.Home()).save()

		expect(findNSMock).toBeCalledTimes(1)
		expect(findNSMock).toBeCalledWith(Lang.EN, 'pages/home')
		expect(findNSMock).toReturnWith(IDLE_I18N.ns)
	})

	test<I18nTestCtx>('Should call the findNamespace with the language "English" and the game page.', async ({
		findNSMock,
		i18nSvc,
	}) => {
		await i18nSvc.setLang(Lang.ES).setRoute(new Route.Game('easy')).save()

		expect(findNSMock).toBeCalledTimes(1)
		expect(findNSMock).toBeCalledWith(Lang.ES, 'pages/game')
		expect(findNSMock).toReturnWith(IDLE_I18N.ns)
	})

	test<I18nTestCtx>('Should not call the findNamespace if it is not called with a language or there is no default language.', async ({
		findNSMock,
		i18nSvc,
	}) => {
		await i18nSvc.setRoute(new Route.Home()).save()

		expect(findNSMock).not.toHaveBeenCalled()
	})

	test<I18nTestCtx>('Should not call the findNamespace if it is not called with a page or a previous page does not exist.', async ({
		findNSMock,
		i18nSvc,
	}) => {
		await i18nSvc.setLang(Lang.EN).save()

		expect(findNSMock).not.toHaveBeenCalled()
	})
})

describe.concurrent('I18nObs', () => {
	test<I18nTestCtx>('Should call the observer with the default language.', async ({ i18nObsMock, i18nSvc }) => {
		await i18nSvc.setDefaultLanguage(Lang.EN).setRoute(new Route.Home()).save()

		expect(i18nObsMock.set).toBeCalledTimes(1)
		expect(i18nObsMock.set).toBeCalledWith({ lang: Lang.EN, ns: IDLE_I18N.ns })
	})

	test<I18nTestCtx>('Should call the observer with the language "English".', async ({ i18nObsMock, i18nSvc }) => {
		await i18nSvc.setLang(Lang.ES).setRoute(new Route.Game('easy')).save()

		expect(i18nObsMock.set).toBeCalledTimes(1)
		expect(i18nObsMock.set).toBeCalledWith({ lang: Lang.ES, ns: IDLE_I18N.ns })
	})

	test<I18nTestCtx>('Should not call the observer if it is not called with a language or there is no default language.', async ({
		i18nObsMock,
		i18nSvc,
	}) => {
		await i18nSvc.setRoute(new Route.Home()).save()

		expect(i18nObsMock.set).not.toBeCalled()
	})

	test<I18nTestCtx>('Should call the observer if set Lang.', async ({ i18nObsMock, i18nSvc }) => {
		await i18nSvc.setLang(Lang.EN).save()

		expect(i18nObsMock.set).toBeCalledTimes(1)
	})

	test<I18nTestCtx>('Should only call the observer once if they are the same arguments.', async ({
		i18nObsMock,
		i18nSvc,
	}) => {
		await i18nSvc.setLang(Lang.ES).setRoute(new Route.Game('easy')).save()
		await i18nSvc.setLang(Lang.ES).setRoute(new Route.Game('easy')).save()

		expect(i18nObsMock.set).toBeCalledTimes(1)
		expect(i18nObsMock.set).toBeCalledWith({ lang: Lang.ES, ns: IDLE_I18N.ns })
	})

	test<I18nTestCtx>('Should only call the observer two times if they are the same arguments.', async ({
		i18nObsMock,
		i18nSvc,
	}) => {
		await i18nSvc.setLang(Lang.ES).setRoute(new Route.Game('easy')).save()
		await i18nSvc.setLang(Lang.EN).save()
		await i18nSvc.setRoute(new Route.Game('easy')).save()

		expect(i18nObsMock.set).toBeCalledTimes(2)
		expect(i18nObsMock.set).toBeCalledWith({ lang: Lang.ES, ns: IDLE_I18N.ns })
		expect(i18nObsMock.set).toBeCalledWith({ lang: Lang.EN, ns: IDLE_I18N.ns })
	})
})
