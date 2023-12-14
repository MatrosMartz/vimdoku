<script>
	import GameMenu from './game-menu.svelte'
	import TitleGame from './title-game.svelte'
</script>

<section class="monospace start-screen">
	<TitleGame />
	<GameMenu />
</section>

<style>
	.start-screen {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		width: 93%;
		max-width: 55rem;
		padding: 2.2rem 2ch;
		color: var(--primary-color);
		background-color: var(--editor-background);
		border-radius: 4px;
		box-shadow: 0 6px 20px var(--editor-background);
		container: start-screen / inline-size;
	}
</style>
