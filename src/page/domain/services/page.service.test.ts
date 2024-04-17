import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest'

import { mockSingleton } from '~/share/utils'
import { LANGS } from '$i18n/domain/const'

import { Modal, Page, Route } from '../entities'
import { PageSvc } from './page.service'
import { PageObs } from './page-obs.service'

interface PageTestCxt {
	goMock: Mock<[], Promise<Page.Page>>
	pageSvc: PageSvc
	saveMock: Mock<[Page.Page], Promise<void>>
}

const randomModal = () => {
	const name = Modal.NAMES.difference(['None'] as const).random()

	if (name === 'Pref') return new Modal[name](Modal.PREF_TYPE.ALL.random())
	if (name === 'Warn') return new Modal[name](Modal.WARN_TYPE.random())
	return new Modal[name]()
}

const randomRoute = () => {
	const name = Route.NAMES.difference(['Home'] as const).random()

	if (name === 'Game') return new Route[name]('basic')
	if (name === 'Help') return new Route[name](Route.HELP_SUB.random())
	return new Route[name]('foo')
}

beforeEach<PageTestCxt>(ctx => {
	mockSingleton(PageObs, () => {
		const mock = new PageObs()

		Object.defineProperties(mock, {
			add: { value: vi.fn(mock.add) },
			remove: { value: vi.fn(mock.remove) },
			set: { value: vi.fn(mock.set) },
			update: { value: vi.fn(mock.update) },
		})
		return mock
	})
	if (ctx.goMock == null) ctx.goMock = vi.fn(async () => Page.IDLE)
	if (ctx.saveMock == null) ctx.saveMock = vi.fn()
	ctx.pageSvc = new PageSvc(ctx.goMock, ctx.saveMock)

	return () => vi.clearAllMocks()
})

describe.concurrent('pageSvc', () => {
	test<PageTestCxt>('Should call the saveMock if set to any language.', async ({ pageSvc, saveMock }) => {
		await pageSvc.setLang(LANGS.random()).save()

		expect(saveMock).toHaveBeenCalledTimes(1)
		expect(saveMock).toBeCalledWith(
			expect.objectContaining({ lang: expect.any(String), modal: Modal.IDLE, route: Route.IDLE })
		)
	})

	test<PageTestCxt>('Should call the saveMock if the set route its different from the initial.', async ({
		pageSvc,
		saveMock,
	}) => {
		await pageSvc.setRoute(randomRoute()).save()

		expect(saveMock).toBeCalledTimes(1)
		expect(saveMock).toBeCalledWith(
			expect.objectContaining({ lang: undefined, modal: Modal.IDLE, route: expect.any(Route.Help) })
		)
	})

	test<PageTestCxt>('Should not call the saveMock if the set route its the initial.', async ({ pageSvc, saveMock }) => {
		await pageSvc.setRoute(Route.IDLE).save()

		expect(saveMock).not.toBeCalled()
	})

	test<PageTestCxt>('Should not call the saveMock if the set modal its the initial.', async ({ pageSvc, saveMock }) => {
		await pageSvc.setModal(Modal.IDLE).save()

		expect(saveMock).not.toBeCalled()
	})

	test<PageTestCxt>('Should not call the saveMock even if modal is set.', async ({ pageSvc, saveMock }) => {
		await pageSvc.setModal(randomModal()).save()

		expect(saveMock).not.toBeCalled()
	})
})
