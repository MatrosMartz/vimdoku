<script lang="ts">
	import { Form } from '~/share/infra/components/svelte'
	import { preferencesFormSchema } from '$preferences/domain/models'
	import { PreferencesService } from '$preferences/domain/services'
	import { preferencesService } from '$preferences/infra/stores'
</script>

<Form
	schema={preferencesFormSchema}
	defaultValues={PreferencesService.DEFAULT_VALUE}
	initialValues={preferencesService.value}
	on:submit={async ({ detail }) => {
		await preferencesService.setAll(detail).save()
	}}
/>
