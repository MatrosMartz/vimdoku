<script>
	import { Fieldset, OptionsInput, TextInput, ToggleInput } from '~/share/infra/components/svelte'
	import NumberInput from '~/share/infra/components/svelte/forms/inputs/number-input.svelte'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { sudokuFields, userFields, vimFields } from '$pref/domain/models'
</script>

<form action="dialog">
	<Fieldset legend={$i18nState.get('prefs-groups-sudoku', 'Sudoku')}>
		<ToggleInput
			name="autoNoteDetection"
			label={$i18nState.get('prefs-names-autoNoteDeletion', 'Auto note deletion')}
			settings={sudokuFields.autoNoteDeletion}
		/>
		<ToggleInput
			name="autoSave"
			label={$i18nState.get('prefs-names-autoSave', 'Auto save')}
			settings={sudokuFields.autoSave}
		/>
		<ToggleInput
			name="autoValidation"
			label={$i18nState.get('prefs-names-autoValidation', 'Auto validation')}
			settings={sudokuFields.autoValidation}
		/>
		<ToggleInput
			name="markRelatedNumbers"
			label={$i18nState.get('prefs-names-autoNoteDeletion', 'Auto note deletion')}
			settings={sudokuFields.markRelatedNumbers}
		/>
		<ToggleInput
			name="remainingNumbers"
			label={$i18nState.get('prefs-names-remainingNumbers', 'Remaining numbers')}
			settings={sudokuFields.remainingNumbers}
		/>
		<ToggleInput name="timer" label={$i18nState.get('prefs-names-timer', 'Timer')} settings={sudokuFields.timer} />
	</Fieldset>
	<Fieldset legend={$i18nState.get('prefs-groups-user', 'User')}>
		<OptionsInput
			name="colorSchema"
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
			label={$i18nState.get('prefs-names-colorTheme', 'Color theme')}
			settings={userFields.colorTheme}
		/>
		<OptionsInput
			name="contrast"
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
			icons={{
				en: { type: 'flag', id: 'en' },
				es: { type: 'flag', id: 'es' },
			}}
			label={$i18nState.get('prefs-names-language', 'Language')}
			settings={userFields.language}
		/>
		<OptionsInput
			name="motionReduce"
			label={$i18nState.get('prefs-names-motionReduce', 'Motion reduce')}
			settings={userFields.motionReduce}
		/>
	</Fieldset>
	<Fieldset legend={$i18nState.get('prefs-groups-vim', 'Vim')}>
		<ToggleInput
			name="cursorBox"
			label={$i18nState.get('prefs-names-cursorBox', 'Cursor box')}
			settings={vimFields.cursorBox}
		/>
		<ToggleInput
			name="cursorCol"
			label={$i18nState.get('prefs-names-cursorCol', 'Cursor column')}
			settings={vimFields.cursorCol}
		/>
		<ToggleInput
			name="cursorRow"
			label={$i18nState.get('prefs-names-cursorRow', 'Cursor row')}
			settings={vimFields.cursorRow}
		/>
		<NumberInput name="history" settings={vimFields.history} />
		<ToggleInput name="numbers" label={$i18nState.get('prefs-names-numbers', 'Numbers')} settings={vimFields.numbers} />
		<ToggleInput
			name="relativeNumbers"
			label={$i18nState.get('prefs-names-relativeNumbers', 'Relative numbers')}
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
