<script lang="ts">
	import { getSelectedContext } from './tab.context'

	export let key: string

	const selected = getSelectedContext()
</script>

<li id="tab{key}" role="tab" aria-controls="panel{key}">
	<button tabindex="0" disabled={$selected === key} on:click>
		<slot />
	</button>
</li>

<style>
	li {
		width: 25%;
		min-width: max-content;
	}

	button {
		--border: transparent;

		position: relative;
		width: 100%;
		height: 48px;
		color: inherit;
		background-color: transparent;
		border: none;
		transition:
			color 500ms,
			backdrop-filter 200ms;
	}

	button:disabled {
		backdrop-filter: brightness(130%);
	}

	button:not(:disabled):hover,
	button:not(:disabled):focus {
		color: var(--secondary-color);
		backdrop-filter: brightness(110%);
		outline: none;
	}
</style>
