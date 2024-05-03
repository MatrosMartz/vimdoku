import { BuildMatcher, Case } from '~/share/utils'
import { CmdTokenKind, type SubToken, SubTokenKind } from '$cmd/domain/entities'
import { CmdListSvc, CmdSvc, type CreateHeader, SubCmdSvc } from '$cmd/domain/services'
import { I18N_ACTIONS, PREFS_ACTIONS, SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services/actions.service'
import { LANGS } from '$i18n/domain/const'
import { Modal, Route } from '$page/domain/entities'
import { PREFS_FIELDS, vimFields } from '$pref/domain/models'
import { ACCESSIBILITIES, COLOR_SCHEMAS, ICON_THEMES } from '$pref/domain/models/user.model'
import { Difficulty } from '$sudoku/domain/const'

import { med } from './mediator.service'

const firstCase = Case.array([
	Case.object({
		preference: Case.equalTo('contrast', 'motionReduce'),
		value: new Case(ACCESSIBILITIES.containsValue),
	})
		.union(Case.object({ preference: Case.equalTo('colorSchema'), value: new Case(COLOR_SCHEMAS.containsValue) }))
		.union(Case.object({ preference: Case.equalTo('iconTheme'), value: new Case(ICON_THEMES.containsValue) })),
])

const setNonToggleFn = new BuildMatcher<[Record<'preference' | 'value', string>], void>()
	.addCase(firstCase, ({ preference, value }) =>
		med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: preference, value })
	)
	.addCase(Case.array([Case.object({ preference: Case.equalTo('history') })]), ({ preference, value }) => {
		const num = Number(value)
		if (!Number.isNaN(num) && Case.range(vimFields.history).assert(num))
			med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: preference, value })
	})
	.done()

/**
 * Create a DOM span element with the specified text and optional CSS class.
 * @param className Optional CSS class to apply to the span element.
 * @param text The text content of the span element.
 * @returns Span element
 */
function createSpan(className: string, text?: string) {
	const span = document.createElement('span')
	span.classList.add(className)
	if (text != null) span.textContent = text

	return span
}

const subKindCase = <K extends SubTokenKind>(...kinds: K[]) =>
	new Case((val): val is { kind: K } => {
		if (typeof val !== 'object' || val == null) return false
		return kinds.includes(Reflect.get(val, 'kind'))
	})

const createSubTokenElement = new BuildMatcher<[SubToken], HTMLSpanElement | Text>()
	.addCase(Case.array([subKindCase(SubTokenKind.HOLDER, SubTokenKind.VARIABLE)]), ({ value }) =>
		createSpan('holder', value)
	)
	.addCase(Case.array([subKindCase(SubTokenKind.SYMBOL, SubTokenKind.VALUE)]), ({ kind, value }) =>
		createSpan(kind, value)
	)
	.default(({ value }) => document.createTextNode(value))
	.done()

export const createHeader: CreateHeader<HTMLHeadingElement> = ([cmdToken, subTokens]) => {
	const heading = document.createElement('h3')
	heading.classList.add('monospace', 'highlight')

	const cmdSpan = createSpan('command')
	for (const { kind, value } of cmdToken.tokens) {
		const child = kind === CmdTokenKind.OPTIONAL ? createSpan('optional', value) : document.createTextNode(value)
		cmdSpan.appendChild(child)
	}

	const fragment = document.createDocumentFragment()
	for (const tokens of subTokens.tokens) fragment.appendChild(createSubTokenElement(tokens))

	heading.append(cmdSpan, ' ', fragment)

	return heading
}

const SET_CMD = CmdSvc.buildFn('se[t]', {
	desc: locale => locale.cmdDesc_set_showAll('Show all preferences that differ from their default value.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.openModal, { modal: new Modal.Pref(Modal.PrefType.showDiffer) }),
})
	.addSubFn(
		SubCmdSvc.buildFn('{|preference|}', {
			desc: [
				locale => locale.cmdDesc_set_suggest1('Toggle preference: Set, switch it on preference.'),
				locale => locale.cmdDesc_set_suggest2('String or Number preference: Show value of preference'),
			],
			fn({ preference }) {
				if (PREFS_FIELDS.subs.TOGGLE.containsKey(preference))
					med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: preference, value: true })
				// if (PREFS_FIELDS.subs.NON_TOGGLE.containsKey(preference)) med.dispatch(SCREEN_ACTIONS.openModal, { modal: ... })
			},
		}),
		SubCmdSvc.buildFn('{|preference|}<?>', {
			desc: locale => locale.cmdDesc_set_showSuggest('Show value of {preference}.'),
			// fn({ preference }) {
			// 	if (!PREFS_FIELDS.containsKey(preference)) return
			// 	med.dispatch(SCREEN_ACTIONS.openModal, { modal: ... })
			// },
		}),
		SubCmdSvc.buildFn('{|preference|}<&>', {
			desc: locale => locale.cmdDesc_set_resetSuggest("Reset option to it's default value."),
			fn({ preference }) {
				if (!PREFS_FIELDS.containsKey(preference)) return
				med.dispatch(PREFS_ACTIONS.reset, { type: 'by-key', key: preference })
			},
		}),
		SubCmdSvc.buildFn('<no>{|preference|}', {
			desc: locale => locale.cmdDesc_set_toggleInvSuggest('Toggle preference: Set, switch it off.'),
			fn({ preference }) {
				if (!PREFS_FIELDS.subs.TOGGLE.containsKey(preference)) return
				med.dispatch(PREFS_ACTIONS.set, { type: 'by-key', key: preference, value: false })
			},
		}),
		SubCmdSvc.buildFn('{|preference|}<!>', {
			desc: locale => locale.cmdDesc_set_toggleInvSuggest('Toggle preference: Set, Invert value.'),
			fn({ preference }) {
				if (!PREFS_FIELDS.subs.TOGGLE.containsKey(preference)) return
				med.dispatch(PREFS_ACTIONS.invert, { pref: preference })
			},
		}),
		SubCmdSvc.buildFn('<inv>{|preference|}', {
			desc: locale => locale.cmdDesc_set_toggleInvSuggest('Toggle preference: Set, Invert value.'),
			fn({ preference }) {
				if (!PREFS_FIELDS.subs.TOGGLE.containsKey(preference)) return
				med.dispatch(PREFS_ACTIONS.invert, { pref: preference })
			},
		}),
		SubCmdSvc.buildFn('{|preference|}<=>{|value|}', {
			desc: locale =>
				locale.cmdDesc_set_setNonToggleSuggest('String or Number preference: Assign to {preference} the {value}.'),
			fn: setNonToggleFn,
		}),
		SubCmdSvc.buildFn('{|preference|}<:>{|value|}', {
			desc: locale =>
				locale.cmdDesc_set_setNonToggleSuggest('String or Number preference: Assign to {preference} the {value}.'),
			fn: setNonToggleFn,
		}),
		SubCmdSvc.buildFn('<all>', {
			desc: locale => locale.cmdDesc_set_showAll('Show all preferences.'),
			fn: () => med.dispatch(SCREEN_ACTIONS.openModal, { modal: new Modal.Pref(Modal.PrefType.showAll) }),
		}),
		SubCmdSvc.buildFn('<all><&>', {
			desc: locale => locale.cmdDesc_set_resetAll('Reset all preferences.'),
			fn: () => med.dispatch(PREFS_ACTIONS.reset, { type: 'all' }),
		})
	)
	.done()

const START_CMD = CmdSvc.buildFn('st[art]', {
	desc: locale =>
		locale.cmdDesc_start_difficulty('Start new game with the {|difficulty|} difficulty.', { difficulty: 'Easy' }),
	fn: () => med.dispatch(SUDOKU_ACTIONS.start, { difficulty: Difficulty.Kind.easy }),
})
	.addSubFn(
		SubCmdSvc.buildFn('{|difficulty|}', {
			desc: locale => locale.cmdDesc_start_subject('Start new game with the selected difficulty.'),
			fn({ difficulty }) {
				if (!Difficulty.KINDS.containsKey(difficulty)) return
				med.dispatch(SUDOKU_ACTIONS.start, { difficulty: Difficulty.Kind[difficulty] })
			},
		})
	)
	.done()

const PAUSE_CMD = CmdSvc.buildFn('pa[use]', {
	desc: locale => locale.cmdDesc_pause('Pause current game.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.openModal, { modal: new Modal.Pause() }),
}).done()

const WRITE_CMD = CmdSvc.buildFn('w[rite]', {
	desc: locale => locale.cmdDesc_write('Save current game.'),
	fn: () => med.dispatch(SUDOKU_ACTIONS.save),
}).done()

const RESUME_CMD = CmdSvc.buildFn('re[sume]', {
	desc: [
		locale => locale.cmdDesc_resume1('Resume the current game.'),
		locale => locale.cmdDesc_resume2('Resume the saved game only if no game active.'),
	],
	fn: () => med.dispatch(SUDOKU_ACTIONS.resume),
}).done()

const QUIT_CMD = CmdSvc.buildFn('q[uit]', {
	desc: locale => locale.cmdDesc_quit('Close the current windows.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.back),
}).done()

const WQUIT_CMD = CmdSvc.buildFn('wq[uit]', {
	desc: locale => locale.cmdDesc_write('Save the current game and close the windows.'),
	fn: () => med.dispatch(SUDOKU_ACTIONS.save).dispatch(SCREEN_ACTIONS.back),
}).done()

const XIT_CMD = CmdSvc.buildFn('x[it]', {
	desc: locale => locale.cmdDesc_writeLike('Like ":wq", but save only when changes have been made.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.back),
}).done()

const EXIT_CMD = CmdSvc.buildFn('exi[t]', {
	desc: locale => locale.cmdDesc_writeLike('Like ":wq", but save only when changes have been made.'),
	fn: () => med.dispatch(SCREEN_ACTIONS.back),
}).done()

const LANGUAGE_CMD = CmdSvc.buildFn('lan[guage]', {
	desc: locale => locale.cmdDesc_language_show('Show the current value of language.'),
})
	.addSubFn(
		SubCmdSvc.buildFn('{|lang|}', {
			desc: locale => locale.cmdDesc_language_set('Sets the current language to {lang}.'),
			fn({ lang }) {
				if (!LANGS.containsValue(lang)) return
				med.dispatch(I18N_ACTIONS.changeLang, { lang })
			},
		})
	)
	.done()

const HELP_CMD = CmdSvc.buildFn('h[elp]', {
	desc: locale => locale.cmdDesc_help_main('Open dialog and display the help file in read-only mode.'),
	// TODO: fn() {},
})
	.addSubFn(
		SubCmdSvc.buildFn('{subject}', {
			desc: locale => locale.cmdDesc_help_suggest('Like ":help", additionally jump to the tag {subject}.'),
			// fn() {},
		}),
		SubCmdSvc.buildFn('<:>{|command|}', {
			desc: locale => locale.cmdDesc_help_withArg('Show help for selected {|subject|}.', { subject: 'command' }),
			fn({ command }) {
				const helpPath = `command/${command}`
				if (!Route.HELP_SUB.containsValue(helpPath)) return
				med.dispatch(SCREEN_ACTIONS.goTo, { route: new Route.Help(helpPath) })
			},
		}),
		SubCmdSvc.buildFn("<'>{|preference|}<'>", {
			desc: locale => locale.cmdDesc_help_withArg('Show help for selected {|subject|}.', { subject: 'preference' }),
			fn({ preference }) {
				const helpPath = `preference#${preference}`
				if (!Route.HELP_SUB.containsValue(helpPath)) return
				med.dispatch(SCREEN_ACTIONS.goTo, { route: new Route.Help(helpPath) })
			},
		})
	)
	.done()

export const cmdList = CmdListSvc.buildFn(createHeader)
	.addCmdFn(SET_CMD)
	.addCmdFn(START_CMD)
	.addCmdFn(PAUSE_CMD)
	.addCmdFn(WRITE_CMD)
	.addCmdFn(RESUME_CMD)
	.addCmdFn(QUIT_CMD)
	.addCmdFn(WQUIT_CMD)
	.addCmdFn(XIT_CMD)
	.addCmdFn(EXIT_CMD)
	.addCmdFn(LANGUAGE_CMD)
	.addCmdFn(HELP_CMD)
	.done()

// 	new Sugg({
// 		cmdStr: 'q[uit]<!>',
// 		descriptions: 'Close without save, also when the current game has changes.',
// 		id: 'quit-unsave',
// 	}),
