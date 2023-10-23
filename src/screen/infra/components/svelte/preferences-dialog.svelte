<script lang="ts">
	import { derived } from 'svelte/store'

	import { Dialog, DialogClose } from '~/share/infra/components/svelte/dialog'
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'
	import { screenSvelte } from '$cmd/infra/stores/svelte/screen.store'
	import { PreferencesDisplay, PreferencesForm } from '$preferences/infra/components/svelte'
	import { DialogKinds } from '$screen/domain/models'

	let selected = 'all'

	const dialogState = derived(screenSvelte, ({ dialog }) => dialog.kind === DialogKinds.Pref)
</script>

<Dialog {dialogState}>
	<TabGroup bind:selected>
		<TabList>
			<Tab key="all">Show</Tab>
			<Tab key="edit">Edit</Tab>
			<DialogClose />
		</TabList>
		<TabPanel key="all">
			<PreferencesDisplay />
		</TabPanel>
		<TabPanel key="edit">
			<PreferencesForm />
		</TabPanel>
	</TabGroup>
</Dialog>
