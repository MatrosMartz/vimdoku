<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte/buttons'
	import { capitalCase, inArray } from '~/share/utils'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import type { I18n } from '$i18n/domain/entities'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { type Prefs, prefsGroupEntries, type PrefsNamesEntries } from '$pref/domain/models'
	import { type Accessibility, ACCESSIBILITY_FIELDS, type ColorSchema } from '$pref/domain/models/user.model'
	import { prefsState } from '$pref/infra/stores/svelte'
	import { DialogKind } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	$: allTooltip = {
		id: 'all-disabled-describe',
		text: $i18nState.get('prefs-btn-showAll-disabledReason', 'All preferences are being displayed.'),
	}
	$: diffTooltip = {
		id: 'diff-disabled-describe',
		text: $i18nState.get(
			'prefs-btn-showDiffer-disabledReason',
			'Only preferences with values different from the default values are being displayed.'
		),
	}

	$: showAll = $screenState.dialog.kind === DialogKind.PrefAll

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
		if (key === 'language') return i18n.get('langName', prefs[key])
		if (inArray(ACCESSIBILITY_FIELDS, key))
			return i18n.get(`prefs-accessibility-${prefs[key] as Accessibility}`, prefs[key])
		return prefs[key]
	}

	/**
	 * Change dialog with preferences all kind.
	 */
	function allHandler() {
		med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.PrefAll })
	}
	/**
	 * Change dialog with preferences differ kind.
	 */
	function diffHandler() {
		med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.PrefDiff })
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
					<tr class="field" class:strike={!showAll && $prefsState[field[0]] === field[1].default}>
						<th class="key secondary">{$i18nState.get(`prefs-names-${field[0]}`, capitalCase(field[0]))}</th>
						<td class="monospace value {field[1].type}">{getPrefText($i18nState, field, $prefsState)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
	<ButtonMenu direction="auto">
		<Button disabled={showAll} tooltipProps={allTooltip} on:click={allHandler}
			>{$i18nState.get('prefs-btn-showAll-text', 'Show all')}</Button
		>
		<Button disabled={!showAll} tooltipProps={diffTooltip} on:click={diffHandler}
			>{$i18nState.get('prefs-btn-showDiffer-text', 'Show different from default values')}</Button
		>
	</ButtonMenu>
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

	.key {
		overflow: hidden;
		font-weight: 500;
		text-align: left;
	}

	.key::after {
		content: ':';
	}

	.text {
		color: rgb(var(--string-color));
	}

	.text::before,
	.text::after {
		font-weight: 600;
		color: rgb(var(--key-color));
		content: '"';
	}

	.number {
		color: rgb(var(--number-color));
	}

	.toggle {
		font-style: italic;
		color: rgb(var(--boolean-color));
	}

	.options {
		color: rgb(var(--notes-color));
	}
</style>
