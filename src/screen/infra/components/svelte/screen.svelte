<script lang="ts">
	import { screenState } from '$cmd/infra/stores/svelte'
	import { MainScreenKinds } from '$screen/domain/models'
	import { SudokuBoard } from '$sudoku/infra/components/svelte'

	import { StartScreen } from './start-screen'
</script>

<main>
	{#if $screenState.main === MainScreenKinds.Start}
		<StartScreen />
	{:else if $screenState.main === MainScreenKinds.Game}
		<SudokuBoard />
	{/if}
</main>

<style>
	main {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
