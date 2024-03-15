<script>
	import { Fieldset, OptionsInput, TextInput, ToggleInput } from '~/share/infra/components/svelte'
	import NumberInput from '~/share/infra/components/svelte/forms/inputs/number-input.svelte'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { sudokuFields, userFields, vimFields } from '$pref/domain/models'
	import { prefsState } from '$pref/infra/stores/svelte'
</script>

<form action="dialog">
	<Fieldset legend={$i18nState.get('prefs-groups-sudoku', 'Sudoku')}>
		<ToggleInput
			name="autoNoteDetection"
			checked={$prefsState.autoNoteDeletion}
			label={$i18nState.get('prefs-names-autoNoteDeletion', 'Auto note deletion')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={sudokuFields.autoNoteDeletion}
		/>
		<ToggleInput
			name="autoSave"
			checked={$prefsState.autoSave}
			label={$i18nState.get('prefs-names-autoSave', 'Auto save')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={sudokuFields.autoSave}
		/>
		<ToggleInput
			name="autoValidation"
			checked={$prefsState.autoValidation}
			label={$i18nState.get('prefs-names-autoValidation', 'Auto validation')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={sudokuFields.autoValidation}
		/>
		<ToggleInput
			name="markRelatedNumbers"
			checked={$prefsState.markRelatedNumbers}
			label={$i18nState.get('prefs-names-autoNoteDeletion', 'Auto note deletion')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={sudokuFields.markRelatedNumbers}
		/>
		<ToggleInput
			name="remainingNumbers"
			checked={$prefsState.remainingNumbers}
			label={$i18nState.get('prefs-names-remainingNumbers', 'Remaining numbers')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={sudokuFields.remainingNumbers}
		/>
		<ToggleInput
			name="timer"
			label={$i18nState.get('prefs-names-timer', 'Timer')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={sudokuFields.timer}
		/>
	</Fieldset>
	<Fieldset legend={$i18nState.get('prefs-groups-user', 'User')}>
		<OptionsInput
			name="colorSchema"
			value={$prefsState.colorSchema}
			i18n={{
				system: $i18nState.get('prefs-schema-system', 'System'),
				dark: $i18nState.get('prefs-schema-dark', 'Dark'),
				light: $i18nState.get('prefs-schema-light', 'Light'),
			}}
			icons={{
				system: { id: 'device' },
				dark: { id: 'moon' },
				light: { id: 'sun' },
			}}
			label={$i18nState.get('prefs-names-colorSchema', 'Color schema')}
			settings={userFields.colorSchema}
		/>
		<TextInput
			name="colorTheme"
			value={$prefsState.colorTheme}
			label={$i18nState.get('prefs-names-colorTheme', 'Color theme')}
			settings={userFields.colorTheme}
		/>
		<OptionsInput
			name="contrast"
			value={$prefsState.contrast}
			i18n={{
				system: $i18nState.get('prefs-accessibility-system', 'System'),
				less: $i18nState.get('prefs-accessibility-less', 'Less'),
				more: $i18nState.get('prefs-accessibility-more', 'More'),
			}}
			icons={{
				system: { id: 'device' },
				less: { id: 'contrast-off' },
				more: { id: 'contrast' },
			}}
			label={$i18nState.get('prefs-names-contrast', 'Contrast')}
			settings={userFields.contrast}
		/>
		<OptionsInput
			name="iconTheme"
			value={$prefsState.iconTheme}
			icons={{
				heroicons: { type: 'logo', id: 'heroicons' },
				iconoir: { type: 'logo', id: 'iconoir' },
				lucide: { type: 'logo', id: 'lucide' },
				tabler: { type: 'logo', id: 'tabler' },
			}}
			label={$i18nState.get('prefs-names-iconTheme', 'Icon Theme')}
			settings={userFields.iconTheme}
		/>
		<OptionsInput
			name="language"
			value={$prefsState.language}
			i18n={{
				en: 'English',
				es: 'Español',
			}}
			icons={{
				en: { type: 'flag', id: 'en' },
				es: { type: 'flag', id: 'es' },
			}}
			label={$i18nState.get('prefs-names-language', 'Language')}
			settings={userFields.language}
		/>
		<OptionsInput
			name="motionReduce"
			value={$prefsState.motionReduce}
			i18n={{
				system: $i18nState.get('prefs-accessibility-system', 'System'),
				less: $i18nState.get('prefs-accessibility-less', 'Less'),
				more: $i18nState.get('prefs-accessibility-more', 'More'),
			}}
			label={$i18nState.get('prefs-names-motionReduce', 'Motion reduce')}
			settings={userFields.motionReduce}
		/>
	</Fieldset>
	<Fieldset legend={$i18nState.get('prefs-groups-vim', 'Vim')}>
		<ToggleInput
			name="cursorBox"
			checked={$prefsState.cursorBox}
			label={$i18nState.get('prefs-names-cursorBox', 'Cursor box')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={vimFields.cursorBox}
		/>
		<ToggleInput
			name="cursorCol"
			checked={$prefsState.cursorCol}
			label={$i18nState.get('prefs-names-cursorCol', 'Cursor column')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={vimFields.cursorCol}
		/>
		<ToggleInput
			name="cursorRow"
			checked={$prefsState.cursorRow}
			label={$i18nState.get('prefs-names-cursorRow', 'Cursor row')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={vimFields.cursorRow}
		/>
		<NumberInput name="history" value={$prefsState.history} settings={vimFields.history} />
		<ToggleInput
			name="numbers"
			checked={$prefsState.numbers}
			label={$i18nState.get('prefs-names-numbers', 'Numbers')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={vimFields.numbers}
		/>
		<ToggleInput
			name="relativeNumbers"
			checked={$prefsState.relativeNumbers}
			label={$i18nState.get('prefs-names-relativeNumbers', 'Relative numbers')}
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
			settings={vimFields.relativeNumbers}
		/>
	</Fieldset>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
