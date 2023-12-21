<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte/buttons'
	import { capitalCase } from '~/share/utils'
	import { med } from '$cmd/infra/services'
	import type { I18nData } from '$i18n/domain/models'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import {
		type Accessibility,
		ACCESSIBILITY_FIELDS,
		prefsGroupEntries,
		type PrefsNamesEntries,
		type Schema,
	} from '$pref/domain/models'
	import { prefsState } from '$pref/infra/stores/svelte'
	import { DialogKind, ScreenAction } from '$screen/domain/models'
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

	function getA<E extends PrefsNamesEntries>(i18n: I18nData, [key, field]: E, value: unknown) {
		if (field.type === 'toggle') return i18n.get(`prefs-toggle-${value as boolean}`, String(value))
		if (key === 'colorSchema') return i18n.get(`prefs-schema-${value as Schema}`, value as string)
		if (key === 'language') return i18n.get('langName', value as string)
		if (ACCESSIBILITY_FIELDS.includes(key))
			return i18n.get(`prefs-accessibility-${value as Accessibility}`, value as string)
		return value as string
	}

	function allHandler() {
		med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.PrefAll })
	}
	function diffHandler() {
		med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.PrefDiff })
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
						<td class="monospace value {field[1].type}">{getA($i18nState, field, $prefsState[field[0]])}</td>
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
		background-color: var(--editor-background);
		border-radius: 8px;
		box-shadow: 0 4px 16px var(--card-head-shadow);
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
		background-color: var(--card-head-background);
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
		color: var(--special-color);
	}

	.text::before,
	.text::after {
		font-weight: 600;
		color: var(--key-color);
		content: '"';
	}

	.number {
		color: var(--number-color);
	}

	.toggle {
		font-style: italic;
		color: var(--boolean-color);
	}

	.options {
		color: var(--notes-color);
	}
</style>
