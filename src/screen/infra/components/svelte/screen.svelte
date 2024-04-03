<script lang="ts">
	import { Route } from '$screen/domain/entities'
	import { screenState } from '$screen/infra/stores/svelte'
	import { SudokuGame } from '$sudoku/infra/components/svelte'

	import HelpPage from './help-page.svelte'
	import NotFoundPage from './not-found-page.svelte'
	import { StartScreen } from './start-screen'
</script>

<main>
	{#if Route.isHome($screenState.route)}
		<StartScreen />
	{:else if Route.isGame($screenState.route)}
		<SudokuGame />
	{:else if Route.isHelp($screenState.route)}
		<HelpPage subPath={$screenState.route.subRoute} />
	{:else if Route.isNotFound($screenState.route)}
		<NotFoundPage path={$screenState.route.path} />
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
