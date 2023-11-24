<script lang="ts">
	import { Form } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { prefState } from '$cmd/infra/stores/svelte'
	import { PrefActions, preferencesFormSchema } from '$pref/domain/models'
	import { PreferencesService } from '$pref/domain/services'
</script>

<Form
	defaultValues={PreferencesService.DEFAULT_DATA}
	initialValues={prefState.data}
	schema={preferencesFormSchema}
	on:submit={({ detail }) => {
		mediator.dispatch(PrefActions.Save, { type: 'all', replace: detail })
	}}
/>
