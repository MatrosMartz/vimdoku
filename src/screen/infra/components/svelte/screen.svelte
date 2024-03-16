<script lang="ts">
	import { Page } from '$screen/domain/entities'
	import { screenState } from '$screen/infra/stores/svelte'
	import { SudokuGame } from '$sudoku/infra/components/svelte'

	import { StartScreen } from './start-screen'
</script>

<main>
	{#if Page.isHome($screenState.route)}
		<StartScreen />
	{:else if Page.isGame($screenState.route)}
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
