<script lang="ts">
	import { MainScreenKinds } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'
	import { SudokuGame } from '$sudoku/infra/components/svelte'

	import { StartScreen } from './start-screen'
</script>

<main>
	{#if $screenState.main === MainScreenKinds.Start}
		<StartScreen />
	{:else if $screenState.main === MainScreenKinds.Game}
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
		margin-bottom: calc(44px + 0.5rem);
	}
</style>
