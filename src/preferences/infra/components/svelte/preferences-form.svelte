<script lang="ts">
	import { Form } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { PreferencesActions, preferencesFormSchema } from '$preferences/domain/models'
	import { PreferencesService } from '$preferences/domain/services'
	import { preferences } from '$preferences/infra/services'
</script>

<Form
	schema={preferencesFormSchema}
	defaultValues={PreferencesService.DEFAULT_DATA}
	initialValues={preferences.data}
	on:submit={({ detail }) => {
		mediator.dispatch({ action: PreferencesActions.SavePref, data: { type: 'all', replace: detail } })
	}}
/>
