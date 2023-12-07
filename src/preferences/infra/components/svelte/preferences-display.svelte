<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte/buttons'
	import { capitalCase } from '~/share/utils'
	import { med } from '$cmd/infra/services'
	import { i18nState, prefsState, screenState } from '$cmd/infra/stores/svelte'
	import { prefsEntries } from '$pref/domain/models'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'

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

	$: showAll = $screenState.dialog.kind === DialogKinds.PrefAll

	function allHandler() {
		med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.PrefAll })
	}
	function diffHandler() {
		med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.PrefDiff })
	}
</script>

<article>
	{#each prefsEntries as [group, fields] (group)}
		<table class="preferences">
			<thead>
				<tr><th colspan="2">{$i18nState.get(`prefs-groups-${group}`, capitalCase(group))}</th> </tr>
			</thead>
			<tbody>
				{#each fields as [name, value] (name)}
					<tr class="field" class:strike={!showAll && $prefsState[name] === value.default}>
						<th class="key secondary">{$i18nState.get(`prefs-names-${name}`, capitalCase(name))}</th>
						<td class="monospace value {value.type}">{$prefsState[name]}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
	<ButtonMenu>
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
