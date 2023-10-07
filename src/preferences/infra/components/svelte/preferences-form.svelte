<script lang="ts">
	import { Form } from '~/share/infra/components/svelte'
	import { preferencesFormSchema } from '$preferences/domain/models'
	import { PreferencesService } from '$preferences/domain/services'
	import { preferencesService } from '$preferences/infra/stores'
</script>

<Form
	name="Edit Preferences"
	schema={preferencesFormSchema}
	defaultValues={PreferencesService.DEFAULT_VALUE}
	on:submit={async ({ detail }) => {
		await preferencesService.setAll(detail).save()
	}}
/>
