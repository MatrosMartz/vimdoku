<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import { capitalCase, type Entries } from '~/share/utils'
	import type { Preferences, SudokuPreferences, UserPreferences, VimPreferences } from '$preferences/domain/models'
	import { PreferencesService } from '$preferences/domain/services'
	import { prefSvelte } from '$preferences/infra/stores'

	export let showAll = true

	type PrefEntries =
		| ['sudoku', Entries<SudokuPreferences>]
		| ['user', Entries<UserPreferences>]
		| ['vim', Entries<VimPreferences>]

	$: actualPreferences = Object.entries($prefSvelte).map<PrefEntries>(([group, fields]) => [
		group,
		Object.entries(fields),
	])

	function getDefaultValue(group: keyof Preferences, name: string) {
		return (PreferencesService.DEFAULT_VALUE[group] as Record<string, unknown>)[name]
	}

	function createHandleShow(setShow: boolean) {
		return () => (showAll = setShow)
	}
</script>

<article>
	<h3>Preferences Display</h3>
	{#each actualPreferences as [group, fields]}
		<table class="preferences">
			<thead>
				<tr>
					<th colspan="2">{capitalCase(group)}</th>
				</tr>
			</thead>
			<tbody>
				{#each fields as [name, value]}
					<tr class="field" class:strike={!showAll && value !== getDefaultValue(group, name)}>
						<th class="key">{capitalCase(name)}</th>
						<td
							class="value"
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
		<li><Button on:click={createHandleShow(true)}>Show all.</Button></li>
		<li><Button on:click={createHandleShow(false)}>Show different from default values.</Button></li>
	</ButtonMenu>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		height: 100%;
		padding: 1rem 2rem;
		overflow: hidden scroll;
	}

	h3 {
		padding-block: 0.5rem;
		text-align: center;
	}

	.preferences {
		position: relative;
		padding-block: 1.5rem 1rem;
		padding-inline: 1rem;
		backdrop-filter: brightness(120%) saturate(120%);
		border-radius: 8px;
		box-shadow: 0 4px 16px rgb(19 15 24 / 50%);
	}

	thead {
		position: absolute;
		top: 0;
		left: -2rem;
		width: calc(25% + 2rem);
		min-width: max-content;
		max-width: 12rem;
		padding: 4px 2rem;
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
		backdrop-filter: brightness(120%) saturate(120%);
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
		position: static;
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
		color: rgb(125 145 93);
	}

	.str::before,
	.str::after {
		font-weight: 600;
		color: rgb(121 170 151);
		content: '"';
	}

	.num {
		color: rgb(173 117 92);
	}

	.bool {
		font-weight: 600;
		color: rgb(156 95 105);
	}
</style>
