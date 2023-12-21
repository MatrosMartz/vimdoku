<script lang="ts">
	import { Dialog, DialogClose } from '~/share/infra/components/svelte/dialog'
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { PreferencesDisplay, PreferencesForm } from '$pref/infra/components/svelte'
	import { DialogKind, type DialogPref, dialogPref, ScreenAction } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	$: show = dialogPref.includes($screenState.dialog.kind)
	$: tabState = ((kind): 'edit' | 'show' => {
		if (dialogPref.includes(kind)) return kind === DialogKind.PrefEdit ? 'edit' : 'show'
		return tabState ?? 'edit'
	})($screenState.dialog.kind)

	function createTabHandler(kind: DialogPref) {
		return () => {
			med.dispatch(ScreenAction.OpenDialog, { kind })
		}
	}
</script>

<Dialog type="modal" {show}>
	<div class="content">
		<TabGroup {tabState}>
			<TabList>
				<Tab key="show" on:click={createTabHandler(DialogKind.PrefAll)}>{$i18nState.get('prefs-tabs-show', 'Show')}</Tab
				>
				<Tab key="edit" on:click={createTabHandler(DialogKind.PrefEdit)}
					>{$i18nState.get('prefs-tabs-edit', 'Edit')}</Tab
				>
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
		background-color: var(--dialog-background);
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
