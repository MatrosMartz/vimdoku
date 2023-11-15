<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte/buttons'
	import { capitalCase } from '~/share/utils'
	import { mediator } from '$cmd/infra/services'
	import { prefSvelte, screenSvelte } from '$cmd/infra/stores'
	import { PreferencesService } from '$pref/domain/services'
	import { DialogKinds, type DialogPref, ScreenActions } from '$screen/domain/models'

	$: showAll = $screenSvelte.dialog.kind === DialogKinds.PrefAll

	$: actualPreferences = PreferencesService.entries($prefSvelte)

	function createBtnHandler(kind: DialogPref) {
		return () => {
			mediator.dispatch(ScreenActions.OpenDialog, { kind })
		}
	}
</script>

<article>
	{#each actualPreferences as [group, fields]}
		<table class="preferences">
			<thead>
				<tr>
					<th colspan="2">{capitalCase(group)}</th>
				</tr>
			</thead>
			<tbody>
				{#each fields as [name, value]}
					<tr class="field" class:strike={!showAll && value !== PreferencesService.getDefaultValue(name)}>
						<th class="key secondary">{capitalCase(name)}</th>
						<td
							class="monospace value"
							class:str={typeof value === 'string'}
							class:num={typeof value === 'number'}
							class:bool={typeof value === 'boolean'}
						>
							{value}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
	<ButtonMenu>
		<Button on:click={createBtnHandler(DialogKinds.PrefAll)}>Show all.</Button>
		<Button on:click={createBtnHandler(DialogKinds.PrefDiff)}>Show different from default values.</Button>
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
		box-shadow: 0 4px 16px rgb(19 15 24 / 50%);
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
		background-color: rgb(19 15 24);
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

	.value {
		flex-grow: 2;
		text-align: right;
	}

	.str {
		color: var(--special-color);
	}

	.str::before,
	.str::after {
		font-weight: 600;
		color: var(--key-color);
		content: '"';
	}

	.num {
		color: var(--number-color);
	}

	.bool {
		font-style: italic;
		color: var(--boolean-color);
	}
</style>
