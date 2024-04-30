<script lang="ts">
	import { ToggleInput } from '~/share/infra/components/svelte/forms/inputs'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { Modal } from '$page/domain/entities'
	import { pageState } from '$page/infra/stores/svelte'

	import PreferencesTable from './preferences-table.svelte'

	let showDiff: boolean = false

	$: if (Modal.Pref.is($pageState.modal) && !Modal.Pref.is($pageState.modal, Modal.PrefType.edit))
		showDiff = Modal.Pref.is($pageState.modal, Modal.PrefType.showDiffer)

	/**
	 * Toggle show pref, change handler.
	 * @param ev Change Event
	 */
	function toggleHandler({ currentTarget: t }: Event) {
		if (t instanceof HTMLInputElement)
			med.dispatch(SCREEN_ACTIONS.openModal, {
				modal: new Modal.Pref(t.checked ? Modal.PrefType.showDiffer : Modal.PrefType.showAll),
			})
	}
</script>

<article>
	<PreferencesTable group="sudoku" {showDiff} />
	<PreferencesTable group="user" {showDiff} />
	<PreferencesTable group="vim" {showDiff} />
	<div class="toggle-show">
		<ToggleInput
			name="show-all-pref"
			checked={showDiff}
			label="{$i18nState.ns('share').prefs_showToggle('Show only that differ from default value')}:"
			offMsg={$i18nState.ns('share').prefs_toggle_false('off')}
			onMsg={$i18nState.ns('share').prefs_toggle_true('on')}
			settings={{ default: false }}
			on:change={toggleHandler}
		/>
	</div>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.toggle-show {
		max-width: max-content;
	}
</style>
