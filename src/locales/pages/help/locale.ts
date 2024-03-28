import type { LocaleValue } from '~/locales/types'

export interface MainHelpLocale extends MoveAround, CloseThisPage, GetSpecificHelp, SearchForHelp {
	about: LocaleValue
	title: LocaleValue
}

interface MoveAround {
	moveAround_desc: LocaleValue
	moveAround_title: LocaleValue
}

interface CloseThisPage {
	closeThisPage_desc: LocaleValue
	closeThisPage_title: LocaleValue
}

interface GetSpecificHelp extends GetSpecificHelpTable {
	getSpecificHelp_desc: LocaleValue
	getSpecificHelp_helpContext: LocaleValue
	getSpecificHelp_helpSummary: LocaleValue
	getSpecificHelp_helpSyntax: LocaleValue
	getSpecificHelp_title: LocaleValue
}

interface GetSpecificHelpTable extends GetSpecificHelpTableRows {
	getSpecificHelp_table_head_example: LocaleValue
	getSpecificHelp_table_head_prepend: LocaleValue
	getSpecificHelp_table_head_what: LocaleValue
}

interface GetSpecificHelpTableRows {
	getSpecificHelp_table_cmdLineMode_example: LocaleValue
	getSpecificHelp_table_cmdLineMode_prepend: LocaleValue
	getSpecificHelp_table_cmdLineMode_what: LocaleValue
	getSpecificHelp_table_insertMode_example: LocaleValue
	getSpecificHelp_table_insertMode_what: LocaleValue
	getSpecificHelp_table_normalMode_example: LocaleValue
	getSpecificHelp_table_normalMode_what: LocaleValue
	getSpecificHelp_table_notesMode_example: LocaleValue
	getSpecificHelp_table_notesMode_what: LocaleValue
	getSpecificHelp_table_preference_example: LocaleValue
	getSpecificHelp_table_preference_what: LocaleValue
	getSpecificHelp_table_visualMode_example: LocaleValue
	getSpecificHelp_table_visualMode_what: LocaleValue
}

interface SearchForHelp {
	searchForHelp_desc: LocaleValue
	searchForHelp_title: LocaleValue
}
