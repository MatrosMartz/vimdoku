<script lang="ts">
	import { Dialog, DialogClose } from '~/share/infra/components/svelte/dialog'
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'
	import { inArray } from '~/share/utils'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { PreferencesDisplay, PreferencesForm } from '$pref/infra/components/svelte'
	import { DialogKind, type DialogPref, dialogPref } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	$: show = inArray(dialogPref, $screenState.dialog.kind)
	$: tabState = ((kind): 'edit' | 'show' => {
		if (inArray(dialogPref, kind)) return kind === DialogKind.PrefEdit ? 'edit' : 'show'
		return tabState ?? 'edit'
	})($screenState.dialog.kind)

	/**
	 * Create click handler for open dialog with a selected kind.
	 * @param kind Dialog preference kind.
	 * @returns the click handler.
	 */
	function createTabHandler(kind: DialogPref): () => void {
		return () => med.dispatch(SCREEN_ACTIONS.openDialog, { kind })
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
				<div slot="close" class="close">
					<DialogClose />
				</div>
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
		width: 90vw;
		max-width: 600px;
		height: 93vh;
		overflow: hidden;
		border-radius: 16px;
	}

	.close {
		position: absolute;
		inset: 0.4rem 0.4rem auto auto;
	}
</style>
