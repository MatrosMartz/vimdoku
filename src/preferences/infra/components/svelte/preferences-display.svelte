<script lang="ts">
	import { ToggleInput } from '~/share/infra/components/svelte/forms/inputs'
	import { capitalCase, inArray } from '~/share/utils'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import type { I18n } from '$i18n/domain/entities'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { type Prefs, prefsGroupEntries, type PrefsNamesEntries } from '$pref/domain/models'
	import { type Accessibility, ACCESSIBILITY_FIELDS, type ColorSchema } from '$pref/domain/models/user.model'
	import { prefsState } from '$pref/infra/stores/svelte'
	import { Modal } from '$screen/domain/entities'
	import { screenState } from '$screen/infra/stores/svelte'

	let showDiff: boolean = false

	$: if (Modal.isPref($screenState.modal) && !Modal.isPref($screenState.modal, 'edit'))
		showDiff = Modal.isPref($screenState.modal, 'show-differ')

	/**
	 * Gets the translated value of the preference.
	 * @param i18n the object of internationalization.
	 * @param fieldEntries the entries in the preference scheme.
	 * @param prefs The current preferences.
	 * @returns The translated value of the preference.
	 */
	function getPrefText<E extends PrefsNamesEntries>(i18n: I18n, fieldEntries: E, prefs: Prefs): string
	function getPrefText<E extends PrefsNamesEntries>(i18n: I18n, [key, field]: E, prefs: Prefs) {
		if (field.type === 'toggle') return i18n.get(`prefs-toggle-${prefs[key] as boolean}`, String(prefs[key]))
		if (key === 'colorSchema') return i18n.get(`prefs-schema-${prefs[key] as ColorSchema}`, prefs[key])
		if (inArray(ACCESSIBILITY_FIELDS, key))
			return i18n.get(`prefs-accessibility-${prefs[key] as Accessibility}`, prefs[key])
		return prefs[key]
	}

	/**
	 * Toggle show pref, change handler.
	 * @param ev Change Event
	 */
	function toggleHandler({ currentTarget: t }: Event) {
		if (t instanceof HTMLInputElement)
			med.dispatch(SCREEN_ACTIONS.openModal, { modal: Modal.createPref(t.checked ? 'show-differ' : 'show-all') })
	}
</script>

<article>
	{#each prefsGroupEntries as [group, fields] (group)}
		<table class="preferences">
			<thead>
				<tr><th colspan="2">{$i18nState.get(`prefs-groups-${group}`, capitalCase(group))}</th> </tr>
			</thead>
			<tbody>
				{#each fields as field (field[0])}
					<tr class="field highlight" class:strike={showDiff && $prefsState[field[0]] === field[1].default}>
						<th class="bold secondary">{$i18nState.get(`prefs-names-${field[0]}`, capitalCase(field[0]))}</th>
						<td class="monospace value {field[1].type}">{getPrefText($i18nState, field, $prefsState)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
	<div class="toggle-show">
		<ToggleInput
			name="show-all-pref"
			checked={showDiff}
			label="{$i18nState.get('prefs-showToggle', 'Show only that differ from default value')}:"
			offMsg={$i18nState.get('prefs-toggle-false', 'off')}
			onMsg={$i18nState.get('prefs-toggle-true', 'on')}
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

	.preferences {
		position: relative;
		padding-block: 1.5rem 1rem;
		padding-inline: 1rem;
		background-color: rgb(var(--editor-background));
		border-radius: 8px;
		box-shadow: 0 4px 16px rgb(var(--card-head-shadow));
	}

	.preferences:not(:first-of-type) {
		margin-top: 1rem;
	}

	thead th {
		position: absolute;
		top: 0;
		left: -2rem;
		width: calc(25% + 2rem);
		min-width: max-content;
		max-width: 12rem;
		padding: 4px 2rem;
		text-align: start;
		background-color: rgb(var(--card-head-background));
		border-radius: 0 8px 8px 0;
		transform: translateY(-50%);
	}

	tbody {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: min(100%, 40ch);
		margin-inline: auto;
		list-style: none;
	}

	.field {
		display: flex;
		gap: 1ch;
		align-items: center;
		justify-content: space-between;
	}

	.field * {
		transition: opacity 200ms;
	}

	.strike * {
		font-style: italic;
		text-decoration: line-through 2px;
		opacity: 0.3;
	}

	.toggle-show {
		max-width: max-content;
	}
</style>
