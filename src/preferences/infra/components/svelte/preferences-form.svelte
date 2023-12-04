<script>
	import { Form } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { i18nState, prefsState } from '$cmd/infra/stores/svelte'
	import { PrefActions, prefsFormSchema } from '$pref/domain/models'
	import { PrefsSvc } from '$pref/domain/services'
</script>

<Form
	defaultValues={PrefsSvc.DEFAULT_DATA}
	initialValues={prefsState.data}
	labels={{
		sudoku: {
			fallback: fb => $i18nState.get('prefs-groups-sudoku', fb),
			names: {
				autoNoteDeletion: fb => $i18nState.get('prefs-names-autoNoteDeletion', fb),
				autoValidation: fb => $i18nState.get('prefs-names-autoValidation', fb),
				markRelatedNumbers: fb => $i18nState.get('prefs-names-markRelatedNumbers', fb),
				remainingNumbers: fb => $i18nState.get('prefs-names-remainingNumbers', fb),
			},
		},
		user: {
			fallback: fb => $i18nState.get('prefs-groups-user', fb),
			names: {
				colorTheme: fb => $i18nState.get('prefs-names-colorTheme', fb),
				colorSchema: fb => $i18nState.get('prefs-names-colorSchema', fb),
				language: fb => $i18nState.get('prefs-names-language', fb),
				motionReduce: fb => $i18nState.get('prefs-names-motionReduce', fb),
				timer: fb => $i18nState.get('prefs-names-timer', fb),
			},
		},
		vim: {
			fallback: fb => $i18nState.get('prefs-groups-vim', fb),
			names: {
				history: fb => $i18nState.get('prefs-names-history', fb),
				numbers: fb => $i18nState.get('prefs-names-numbers', fb),
				relativeNumbers: fb => $i18nState.get('prefs-names-relativeNumbers', fb),
			},
		},
	}}
	schema={prefsFormSchema}
	on:submit={({ detail }) => {
		med.dispatch(PrefActions.Save, { type: 'all', replace: detail })
	}}
/>
