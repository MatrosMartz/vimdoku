<script lang="ts">
	import { MainScreenKind } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'
	import { SudokuGame } from '$sudoku/infra/components/svelte'

	import { StartScreen } from './start-screen'
	$: console.log($screenState)
</script>

<main>
	{#if $screenState.main === MainScreenKind.Start}
		<StartScreen />
	{:else if $screenState.main === MainScreenKind.Game}
		<SudokuGame />
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		align-items: center;
		justify-content: center;
		margin-bottom: calc(var(--icon-size) + 1.6rem);
	}
</style>
