<script lang="ts">
	import { Dialog, DialogClose } from '~/share/infra/components/svelte/dialog'
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { PreferencesDisplay, PreferencesForm } from '$pref/infra/components/svelte'
	import { Modal } from '$page/domain/entities'
	import { pageState } from '$page/infra/stores/svelte'

	$: tabState = ((modal): 'edit' | 'show' => {
		if (Modal.Pref.is(modal)) return Modal.Pref.is(modal, Modal.PrefType.edit) ? 'edit' : 'show'
		return tabState ?? 'edit'
	})($pageState.modal)

	/**
	 * Create click handler for open dialog with a selected kind.
	 * @param type Dialog preference kind.
	 * @returns the click handler.
	 */
	function createTabHandler(type: Modal.PrefType): () => void {
		return () => med.dispatch(SCREEN_ACTIONS.openModal, { modal: new Modal.Pref(type) })
	}
</script>

<Dialog type="modal" show={Modal.Pref.is($pageState.modal)}>
	<div class="content">
		<TabGroup {tabState}>
			<TabList>
				<Tab key="show" on:click={createTabHandler(Modal.PrefType.showAll)}
					>{$i18nState.ns('share').prefs_tabs_show('Show')}</Tab
				>
				<Tab key="edit" on:click={createTabHandler(Modal.PrefType.edit)}
					>{$i18nState.ns('share').prefs_tabs_edit('Edit')}</Tab
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
