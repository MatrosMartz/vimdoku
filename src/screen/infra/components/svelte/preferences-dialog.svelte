<script lang="ts">
	import { derived } from 'svelte/store'

	import { Dialog, DialogClose } from '~/share/infra/components/svelte/dialog'
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'
	import { screenSvelte } from '$cmd/infra/stores/svelte'
	import { PreferencesDisplay, PreferencesForm } from '$preferences/infra/components/svelte'
	import { DialogKinds } from '$screen/domain/models'

	let selected = 'all'

	const dialogState = derived(screenSvelte, ({ dialog }) => dialog.kind === DialogKinds.Pref)
</script>

<Dialog {dialogState}>
	<div class="content">
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
	</div>
</Dialog>

<style>
	.content {
		display: flex;
		flex-direction: column;
		width: 80vw;
		max-width: 600px;
		height: 90vh;
		overflow: hidden;
		background-color: hsl(280deg 17% 14%);
		border-radius: 8px;
	}
</style>
