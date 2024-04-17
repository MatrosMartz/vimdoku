<script lang="ts">
	import type { LocaleType, ShareLocale, TextGetter } from '~/locales'
	import { ToggleInput } from '~/share/infra/components/svelte/forms/inputs'
	import { capitalCase, inArray } from '~/share/utils'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { type Prefs, prefsGroupEntries, type PrefsNamesEntries } from '$pref/domain/models'
	import { type Accessibility, ACCESSIBILITY_FIELDS, type ColorSchema } from '$pref/domain/models/user.model'
	import { prefsState } from '$pref/infra/stores/svelte'
	import { Modal } from '$page/domain/entities'
	import { pageState } from '$page/infra/stores/svelte'

	let showDiff: boolean = false

	$: if (Modal.Pref.is($pageState.modal) && !Modal.Pref.is($pageState.modal, Modal.PrefType.edit))
		showDiff = Modal.Pref.is($pageState.modal, Modal.PrefType.showDiffer)

	$: locale = $i18nState.ns('share')

	/**
	 * Gets the translated value of the preference.
	 * @param locale the object of internationalization.
	 * @param fieldEntries the entries in the preference scheme.
	 * @param prefs The current preferences.
	 * @returns The translated value of the preference.
	 */
	function getPrefText<E extends PrefsNamesEntries>(
		locale: TextGetter<ShareLocale & LocaleType>,
		[key, field]: E,
		prefs: Prefs
	) {
		if (field.type === 'toggle') return locale[`prefs_toggle_${prefs[key] as boolean}`](String(prefs[key]))
		if (key === 'colorSchema') return locale[`prefs_schema_${prefs[key] as ColorSchema}`](prefs[key])
		if (inArray(ACCESSIBILITY_FIELDS, key))
			return locale[`prefs_accessibility_${prefs[key] as Accessibility}`](prefs[key])
		return prefs[key]
	}

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
	{#each prefsGroupEntries as [group, fields] (group)}
		<table class="preferences">
			<thead>
				<tr><th colspan="2">{locale[`prefs_groups_${group}`](capitalCase(group))}</th> </tr>
			</thead>
			<tbody>
				{#each fields as field (field[0])}
					<tr class="field highlight" class:strike={showDiff && $prefsState[field[0]] === field[1].default}>
						<th class="bold secondary">{locale[`prefs_names_${field[0]}`](capitalCase(field[0]))}</th>
						<td class="monospace value {field[1].type}">{getPrefText(locale, field, $prefsState)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
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
