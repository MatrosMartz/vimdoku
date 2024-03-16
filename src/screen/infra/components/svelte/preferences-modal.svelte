<script lang="ts">
	import { Dialog, DialogClose } from '~/share/infra/components/svelte/dialog'
	import { Tab, TabGroup, TabList, TabPanel } from '~/share/infra/components/svelte/tab'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { PreferencesDisplay, PreferencesForm } from '$pref/infra/components/svelte'
	import { ModalEntity, type PrefModalType } from '$screen/domain/entities'
	import { screenState } from '$screen/infra/stores/svelte'

	$: tabState = ((modal): 'edit' | 'show' => {
		if (ModalEntity.isPref(modal)) return ModalEntity.isPref(modal, 'edit') ? 'edit' : 'show'
		return tabState ?? 'edit'
	})($screenState.modal)

	/**
	 * Create click handler for open dialog with a selected kind.
	 * @param type Dialog preference kind.
	 * @returns the click handler.
	 */
	function createTabHandler(type: PrefModalType): () => void {
		return () => med.dispatch(SCREEN_ACTIONS.openModal, { modal: ModalEntity.createPref(type) })
	}
</script>

<Dialog type="modal" show={ModalEntity.isPref($screenState.modal)}>
	<div class="content">
		<TabGroup {tabState}>
			<TabList>
				<Tab key="show" on:click={createTabHandler('show-all')}>{$i18nState.get('prefs-tabs-show', 'Show')}</Tab>
				<Tab key="edit" on:click={createTabHandler('edit')}>{$i18nState.get('prefs-tabs-edit', 'Edit')}</Tab>
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
