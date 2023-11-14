<script>
	import GameMenu from './game-menu.svelte'
	import SelectGame from './select-game.svelte'
	import { startType } from './start-screen.store'
	import TitleGame from './title-game.svelte'
</script>

<section class="monospace start-screen">
	<TitleGame />
	{#if $startType === 'start'}
		<GameMenu />
	{:else}
		<SelectGame />
	{/if}
</section>

<style>
	.start-screen {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		width: 93vw;
		max-width: 55rem;
		padding: 2.2rem 2ch;
		margin: auto;
		color: rgb(204 184 221);
		background-color: var(--editor-background);
		border-radius: 4px;
		box-shadow: 0 6px 20px rgb(12 7 17);
	}
</style>
