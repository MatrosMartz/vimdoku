<script lang="ts">
	import { getSelectedContext } from './tab.context'

	export let key: string

	const selected = getSelectedContext()
</script>

<li id="tab{key}" role="tab" aria-controls="panel{key}">
	<button disabled={$selected === key} on:click>
		<slot />
	</button>
</li>

<style>
	li {
		width: 25%;
		min-width: max-content;
	}

	button {
		position: relative;
		width: 100%;
		height: 48px;
		color: inherit;
		background-color: transparent;
		border: none;
	}

	button:hover {
		backdrop-filter: brightness(95%) saturate(80%);
	}

	button:not(:disabled)::after {
		position: absolute;
		top: 4px;
		right: -1px;
		width: 2px;
		height: calc(100% - 8px);
		content: '';
		background-color: rgb(19 15 24 / 50%);
	}

	button:disabled {
		background-color: rgb(27 23 32);
	}
</style>
