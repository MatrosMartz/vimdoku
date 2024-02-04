<script>
	import { Form } from '~/share/infra/components/svelte'
	import { PREFS_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { IDLE_PREFS_GROUPS, prefsFormSchema } from '$pref/domain/models'
	import { PrefsSvc } from '$pref/domain/services'
	import { prefsState } from '$pref/infra/stores/svelte'
</script>

<Form
	defaultValues={IDLE_PREFS_GROUPS}
	initialValues={PrefsSvc.getGroups(prefsState.data)}
	labels={{
		groups: {
			sudoku: fb => $i18nState.get('prefs-groups-sudoku', fb),
			user: fb => $i18nState.get('prefs-groups-user', fb),
			vim: fb => $i18nState.get('prefs-groups-vim', fb),
		},
		names: {
			autoNoteDeletion: fb => $i18nState.get('prefs-names-autoNoteDeletion', fb),
			autoValidation: fb => $i18nState.get('prefs-names-autoValidation', fb),
			autoSave: fb => $i18nState.get('prefs-names-autoSave', fb),
			timer: fb => $i18nState.get('prefs-names-timer', fb),
			contrast: fb => $i18nState.get('prefs-names-contrast', fb),
			iconTheme: fb => $i18nState.get('prefs-names-iconTheme', fb),
			markRelatedNumbers: fb => $i18nState.get('prefs-names-markRelatedNumbers', fb),
			remainingNumbers: fb => $i18nState.get('prefs-names-remainingNumbers', fb),
			colorTheme: fb => $i18nState.get('prefs-names-colorTheme', fb),
			colorSchema: fb => $i18nState.get('prefs-names-colorSchema', fb),
			language: fb => $i18nState.get('prefs-names-language', fb),
			motionReduce: fb => $i18nState.get('prefs-names-motionReduce', fb),
			history: fb => $i18nState.get('prefs-names-history', fb),
			numbers: fb => $i18nState.get('prefs-names-numbers', fb),
			relativeNumbers: fb => $i18nState.get('prefs-names-relativeNumbers', fb),
			cursorBox: fb => $i18nState.get('prefs-names-cursorBox', fb),
			cursorCol: fb => $i18nState.get('prefs-names-cursorCol', fb),
			cursorRow: fb => $i18nState.get('prefs-names-cursorRow', fb),
		},
	}}
	schema={prefsFormSchema}
	on:submit={({ detail: { sudoku, user, vim } }) => {
		med.dispatch(PREFS_ACTIONS.set, { type: 'all', prefs: { ...sudoku, ...user, ...vim } })
	}}
/>
