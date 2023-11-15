<script lang="ts">
	import { screenSvelte } from '$cmd/infra/stores'
	import { MainScreenKinds } from '$screen/domain/models'
	import { SudokuBoard } from '$sudoku/infra/components/svelte'

	import { StartScreen } from './start-screen'
</script>

<main>
	{#if $screenSvelte.main === MainScreenKinds.Start}
		<StartScreen />
	{:else if $screenSvelte.main === MainScreenKinds.Game}
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
