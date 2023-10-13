<script lang="ts">
	import { Dialog, DialogClose } from '~/share/infra/components/svelte/dialog'
	import { createDialogStore } from '~/share/infra/components/svelte/dialog/dialog.context'
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'

	import PreferencesDisplay from './preferences-display.svelte'
	import PreferencesForm from './preferences-form.svelte'

	let selected = 'all'

	const dialogState = createDialogStore(false)
</script>

<button on:click={() => dialogState.open()}>open</button>

<Dialog {dialogState}>
	<TabGroup bind:selected>
		<TabList>
			<Tab key="all">Show</Tab>
			<Tab key="edit">Edit.</Tab>
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
