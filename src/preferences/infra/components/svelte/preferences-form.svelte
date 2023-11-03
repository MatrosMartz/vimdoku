<script lang="ts">
	import { Form } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { PrefActions, preferencesFormSchema } from '$preferences/domain/models'
	import { PreferencesService } from '$preferences/domain/services'
</script>

<Form
	schema={preferencesFormSchema}
	defaultValues={PreferencesService.DEFAULT_DATA}
	initialValues={mediator.get('preferences')}
	on:submit={({ detail }) => {
		mediator.dispatch(PrefActions.Save, { type: 'all', replace: detail })
	}}
/>
