<script lang="ts">
	import { Route } from '$page/domain/entities'
	import { pageState } from '$page/infra/stores/svelte'
	import { SudokuGame } from '$sudoku/infra/components/svelte'

	import HelpPage from './help-page.svelte'
	import NotFoundPage from './not-found-page.svelte'
	import { StartScreen } from './start-screen'

	$: ({ route } = $pageState)
</script>

<main>
	{#if Route.Home.is(route)}
		<StartScreen />
	{:else if Route.Game.is(route)}
		<SudokuGame />
	{:else if Route.Help.is(route)}
		<HelpPage subPath={route.subRoute} />
	{:else if Route.NotFound.is(route)}
		<NotFoundPage path={route.path} />
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
