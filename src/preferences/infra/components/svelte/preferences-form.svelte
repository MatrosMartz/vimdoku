<script lang="ts">
	import { Form } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { prefsState } from '$cmd/infra/stores/svelte'
	import { PrefActions, prefsFormSchema } from '$pref/domain/models'
	import { PrefsSvc } from '$pref/domain/services'
</script>

<Form
	defaultValues={PrefsSvc.DEFAULT_DATA}
	initialValues={prefsState.data}
	schema={prefsFormSchema}
	on:submit={({ detail }) => {
		med.dispatch(PrefActions.Save, { type: 'all', replace: detail })
	}}
/>
