<script lang="ts">
	import SelectGame from './select-game.svelte'
	import StartHub from './start-hub.svelte'
	import { startType } from './start-screen.store'
</script>

<section class="monospace start-screen">
	{#if $startType === 'hub'}
		<StartHub />
	{:else}
		<SelectGame />
	{/if}
</section>

<style>
	.start-screen {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		justify-content: center;
		width: 93vw;
		max-width: 55rem;
		min-height: 70vh;
		padding: 1.5rem 2ch;
		margin: auto;
		color: rgb(204 184 221);
		background-color: var(--editor-background);
		border-radius: 4px;
		box-shadow: 0 6px 20px rgb(12 7 17);
	}
</style>
