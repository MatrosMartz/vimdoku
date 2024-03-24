import type { LocaleValue } from './types'

export interface ShareLocale extends CmdDesc, Form, GameBtn, Modes, Prefs, StatusBar, Sync {}

interface CmdDesc extends CmdDescHelp, CmdDescLanguage, CmdDescResume, CmdDescSet, CmdDescStart, CmdDescWrite {
	cmdDesc_pause: LocaleValue
	cmdDesc_quit: LocaleValue
}

interface CmdDescHelp {
	cmdDesc_help_main: LocaleValue
	cmdDesc_help_suggest: LocaleValue
	cmdDesc_help_withArg: LocaleValue<['subject']>
}

interface CmdDescLanguage {
	cmdDesc_language_set: LocaleValue
	cmdDesc_language_setSuggest: LocaleValue<['lang']>
	cmdDesc_language_show: LocaleValue
}

interface CmdDescResume {
	cmdDesc_resume1: LocaleValue
	cmdDesc_resume2: LocaleValue
}

interface CmdDescSet {
	cmdDesc_set_resetAll: LocaleValue
	cmdDesc_set_resetPref: LocaleValue<['pref']>
	cmdDesc_set_resetSuggest: LocaleValue
	cmdDesc_set_setNonTogglePref: LocaleValue<['pref']>
	cmdDesc_set_setNonToggleSuggest: LocaleValue
	cmdDesc_set_showAll: LocaleValue
	cmdDesc_set_showDiffer: LocaleValue
	cmdDesc_set_showPref: LocaleValue<['pref']>
	cmdDesc_set_showSuggest: LocaleValue
	cmdDesc_set_suggest1: LocaleValue
	cmdDesc_set_suggest2: LocaleValue
	cmdDesc_set_toggleInvPref: LocaleValue<['pref']>
	cmdDesc_set_toggleInvSuggest: LocaleValue
	cmdDesc_set_toggleOffPref: LocaleValue<['pref']>
	cmdDesc_set_toggleOffSuggest: LocaleValue
	cmdDesc_set_toggleOnPref: LocaleValue<['pref']>
}

interface CmdDescStart {
	cmdDesc_start_difficulty: LocaleValue<['difficulty']>
	cmdDesc_start_subject: LocaleValue
}

interface CmdDescWrite {
	cmdDesc_write: LocaleValue
	cmdDesc_writeAndQuit: LocaleValue
	cmdDesc_writeLike: LocaleValue
}

interface Form {
	form_reset: LocaleValue
	form_save: LocaleValue
}

interface GameBtn {
	gameBtn_goBack: LocaleValue
	gameBtn_new_text: LocaleValue
	gameBtn_resume_disabledReason: LocaleValue
	gameBtn_resume_text: LocaleValue
	gameBtn_selectDifficulty: LocaleValue
	gameBtn_start: LocaleValue
}

interface Modes {
	modes_insert: LocaleValue
	modes_normal: LocaleValue
	modes_notes: LocaleValue
	modes_visual: LocaleValue
}

interface Prefs extends PrefsAccessibility, PrefsGroups, PrefsNames, PrefsSchema, PrefsToggle {
	prefs_tabs_edit: LocaleValue
	prefs_tabs_show: LocaleValue
}

interface PrefsAccessibility {
	prefs_accessibility_less: LocaleValue
	prefs_accessibility_more: LocaleValue
	prefs_accessibility_system: LocaleValue
}

interface PrefsGroups {
	prefs_groups_sudoku: LocaleValue
	prefs_groups_user: LocaleValue
	prefs_groups_vim: LocaleValue
}

interface PrefsNames {
	prefs_names_autoNoteDeletion: LocaleValue
	prefs_names_autoSave: LocaleValue
	prefs_names_autoValidation: LocaleValue
	prefs_names_colorSchema: LocaleValue
	prefs_names_colorTheme: LocaleValue
	prefs_names_contrast: LocaleValue
	prefs_names_cursorBox: LocaleValue
	prefs_names_cursorCol: LocaleValue
	prefs_names_cursorRow: LocaleValue
	prefs_names_highlight: LocaleValue
	prefs_names_history: LocaleValue
	prefs_names_iconTheme: LocaleValue
	prefs_names_markRelatedNumbers: LocaleValue
	prefs_names_motionReduce: LocaleValue
	prefs_names_numbers: LocaleValue
	prefs_names_relativeNumbers: LocaleValue
	prefs_names_remainingNumbers: LocaleValue
	prefs_names_timer: LocaleValue
}

interface PrefsSchema {
	prefs_schema_dark: LocaleValue
	prefs_schema_light: LocaleValue
	prefs_schema_system: LocaleValue
}

interface PrefsToggle {
	prefs_showToggle: LocaleValue
	prefs_toggle_false: LocaleValue
	prefs_toggle_true: LocaleValue
}

interface StatusBar {
	statusBar_modesDisabledReason: LocaleValue
	statusBar_posDesc: LocaleValue<['col', 'row']>
}

interface Sync {
	sync_false: LocaleValue
	sync_true: LocaleValue
}
