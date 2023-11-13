<script lang="ts">
	import { derived } from 'svelte/store'

	import { Dialog, DialogClose } from '~/share/infra/components/svelte/dialog'
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'
	import { mediator } from '$cmd/infra/services'
	import { screenSvelte } from '$cmd/infra/stores/svelte'
	import { PreferencesDisplay, PreferencesForm } from '$pref/infra/components/svelte'
	import { DialogKinds, PrefDialogTypes, ScreenActions } from '$screen/domain/models'

	const dialogState = derived(screenSvelte, ({ dialog }) => dialog.kind === DialogKinds.Pref)
	const tabState = derived<typeof screenSvelte, string>(screenSvelte, ({ dialog }, set) => {
		if (dialog.kind !== DialogKinds.Pref) return
		set(dialog.opts.type === PrefDialogTypes.edit ? 'edit' : 'show')
	})

	function createTabHandler(type: PrefDialogTypes) {
		return () => {
			mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Pref, opts: { type } })
		}
	}
</script>

<Dialog {dialogState} type="modal">
	<div class="content">
		<TabGroup {tabState}>
			<TabList>
				<Tab key="show" on:click={createTabHandler(PrefDialogTypes.all)}>Show</Tab>
				<Tab key="edit" on:click={createTabHandler(PrefDialogTypes.edit)}>Edit</Tab>
				<li class="close">
					<DialogClose />
				</li>
			</TabList>
			<TabPanel key="show">
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

	.close {
		position: absolute;
		right: 0;
		height: 100%;
		aspect-ratio: 1 / 1;
		border-top-right-radius: 8px;
	}
</style>
