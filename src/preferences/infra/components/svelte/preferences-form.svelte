<script>
	import { onDestroy } from 'svelte'

	import { Button, ButtonMenu, Fieldset, OptionsInput, TextInput, ToggleInput } from '~/share/infra/components/svelte'
	import NumberInput from '~/share/infra/components/svelte/forms/inputs/number-input.svelte'
	import { PREFS_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { sudokuFields, userFields, vimFields } from '$pref/domain/models'
	import { prefsState } from '$pref/infra/stores/svelte'

	let values = { ...$prefsState }

	const unSubscriber = prefsState.subscribe(data => (values = { ...data }))

	$: locale = $i18nState.ns('share')

	/** Preferences form Submit handler. */
	function submitHandler() {
		med.dispatch(PREFS_ACTIONS.set, { type: 'all', prefs: values })
	}

	/** Preferences form Reset handler. */
	function resetHandler() {
		med.dispatch(PREFS_ACTIONS.reset, { type: 'all' })
	}

	onDestroy(unSubscriber)
</script>

<form action="dialog" on:submit|preventDefault={submitHandler} on:reset={resetHandler}>
	<Fieldset legend={locale.prefs_groups_sudoku('Sudoku')}>
		<ToggleInput
			name="autoNoteDetection"
			label={locale.prefs_names_autoNoteDeletion('Auto note deletion')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={sudokuFields.autoNoteDeletion}
			bind:checked={values.autoNoteDeletion}
		/>
		<ToggleInput
			name="autoSave"
			label={locale.prefs_names_autoSave('Auto save')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={sudokuFields.autoSave}
			bind:checked={values.autoSave}
		/>
		<ToggleInput
			name="autoValidation"
			label={locale.prefs_names_autoValidation('Auto validation')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={sudokuFields.autoValidation}
			bind:checked={values.autoValidation}
		/>
		<ToggleInput
			name="markRelatedNumbers"
			label={locale.prefs_names_autoNoteDeletion('Auto note deletion')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={sudokuFields.markRelatedNumbers}
			bind:checked={values.markRelatedNumbers}
		/>
		<ToggleInput
			name="remainingNumbers"
			label={locale.prefs_names_remainingNumbers('Remaining numbers')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={sudokuFields.remainingNumbers}
			bind:checked={values.remainingNumbers}
		/>
		<ToggleInput
			name="timer"
			label={locale.prefs_names_timer('Timer')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={sudokuFields.timer}
			bind:checked={values.timer}
		/>
	</Fieldset>
	<Fieldset legend={locale.prefs_groups_user('User')}>
		<OptionsInput
			name="colorSchema"
			i18n={{
				system: locale.prefs_schema_system('System'),
				dark: locale.prefs_schema_dark('Dark'),
				light: locale.prefs_schema_light('Light'),
			}}
			icons={{
				system: { id: 'device' },
				dark: { id: 'moon' },
				light: { id: 'sun' },
			}}
			label={locale.prefs_names_colorSchema('Color schema')}
			settings={userFields.colorSchema}
			bind:value={values.colorSchema}
		/>
		<TextInput
			name="colorTheme"
			label={locale.prefs_names_colorTheme('Color theme')}
			settings={userFields.colorTheme}
			bind:value={values.colorTheme}
		/>
		<OptionsInput
			name="contrast"
			i18n={{
				system: locale.prefs_accessibility_system('System'),
				less: locale.prefs_accessibility_less('Less'),
				more: locale.prefs_accessibility_more('More'),
			}}
			icons={{
				system: { id: 'device' },
				less: { id: 'contrast-off' },
				more: { id: 'contrast' },
			}}
			label={locale.prefs_names_contrast('Contrast')}
			settings={userFields.contrast}
			bind:value={values.contrast}
		/>
		<OptionsInput
			name="iconTheme"
			icons={{
				Heroicons: { type: 'logo', id: 'Heroicons' },
				Iconoir: { type: 'logo', id: 'Iconoir' },
				Lucide: { type: 'logo', id: 'Lucide' },
				Tabler: { type: 'logo', id: 'Tabler' },
			}}
			label={locale.prefs_names_iconTheme('Icon Theme')}
			settings={userFields.iconTheme}
			bind:value={values.iconTheme}
		/>
		<!-- <OptionsInput
			name="language"
			i18n={{
				en: 'English',
				es: 'Español',
			}}
			icons={{
				en: { type: 'flag', id: 'en' },
				es: { type: 'flag', id: 'es' },
			}}
			label={i18n.prefs_names_language('Language')}
			settings={userFields.language}
			bind:value={values.language}
		/> -->
		<OptionsInput
			name="motionReduce"
			i18n={{
				system: locale.prefs_accessibility_system('System'),
				less: locale.prefs_accessibility_less('Less'),
				more: locale.prefs_accessibility_more('More'),
			}}
			label={locale.prefs_names_motionReduce('Motion reduce')}
			settings={userFields.motionReduce}
			bind:value={values.motionReduce}
		/>
	</Fieldset>
	<Fieldset legend={locale.prefs_groups_vim('Vim')}>
		<ToggleInput
			name="cursorBox"
			label={locale.prefs_names_cursorBox('Cursor box')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={vimFields.cursorBox}
			bind:checked={values.cursorBox}
		/>
		<ToggleInput
			name="cursorCol"
			label={locale.prefs_names_cursorCol('Cursor column')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={vimFields.cursorCol}
			bind:checked={values.cursorCol}
		/>
		<ToggleInput
			name="cursorRow"
			label={locale.prefs_names_cursorRow('Cursor row')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={vimFields.cursorRow}
			bind:checked={values.cursorRow}
		/>
		<NumberInput name="history" settings={vimFields.history} bind:value={values.history} />
		<ToggleInput
			name="numbers"
			label={locale.prefs_names_numbers('Numbers')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={vimFields.numbers}
			bind:checked={values.numbers}
		/>
		<ToggleInput
			name="relativeNumbers"
			label={locale.prefs_names_relativeNumbers('Relative numbers')}
			offMsg={locale.prefs_toggle_false('off')}
			onMsg={locale.prefs_toggle_true('on')}
			settings={vimFields.relativeNumbers}
			bind:checked={values.relativeNumbers}
		/>
	</Fieldset>

	<ButtonMenu direction="auto">
		<Button type="reset">{locale.form_reset('Reset to default')}</Button>
		<Button type="submit">{locale.form_save('Save changes')}</Button>
	</ButtonMenu>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
