<script lang="ts">
	import { Form } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { prefCtx } from '$cmd/infra/stores'
	import { PrefActions, preferencesFormSchema } from '$pref/domain/models'
	import { PreferencesService } from '$pref/domain/services'
</script>

<Form
	schema={preferencesFormSchema}
	defaultValues={PreferencesService.DEFAULT_DATA}
	initialValues={prefCtx.data}
	on:submit={({ detail }) => {
		mediator.dispatch(PrefActions.Save, { type: 'all', replace: detail })
	}}
/>
