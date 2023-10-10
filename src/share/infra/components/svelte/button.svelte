<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button'
</script>

<button {type} on:click>
	<slot />
</button>

<style>
	button {
		width: min(calc(2rem + 15ch), max-content);
		height: 48px;
		padding-inline: 1rem;
		overflow: hidden;
		font-weight: 500;
		color: inherit;
		background-color: var(--input-background);
		border: 2px solid var(--input-border);
		border-radius: 8px;
		outline: none;
		box-shadow: 0 0 12px var(--input-shadow);
		transition:
			background-color 200ms ease-out,
			box-shadow 200ms ease-out;
	}

	button:hover {
		--input-shadow: var(--hover-shadow);
	}

	button:active {
		--input-background: var(--alternative-border);
		--input-border: var(--alternative-border);
	}
</style>
