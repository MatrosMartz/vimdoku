<script lang="ts">
	export let key: string
	export let selected: string
</script>

<li id="tab{key}" role="tab" aria-controls="panel{key}">
	<button
		disabled={selected === key}
		on:click={() => {
			selected = key
		}}
	>
		<slot />
	</button>
</li>

<style>
	li {
		width: 25%;
		min-width: max-content;
	}

	button {
		width: 100%;
		height: 48px;
		color: inherit;
		background-color: rgb(23 18 27);
		border: none;
	}

	button:hover {
		filter: brightness(112%);
	}

	button:disabled {
		background-color: rgb(32 25 37);
		filter: brightness(100%);
		border-bottom: 2px solid var(--input-border);
	}
</style>
