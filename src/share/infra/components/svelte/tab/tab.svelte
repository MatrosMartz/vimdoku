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
		border-bottom: 2px solid var(--border);
		transition:
			color 500ms,
			filter 500ms,
			border 250ms;
	}

	button:disabled {
		background-color: rgb(27 23 32);
	}

	button:focus {
		backdrop-filter: brightness(85%) saturate(80%);
		outline: none;
	}

	button:focus,
	button:hover {
		color: var(--secondary-color);
	}

	button:focus,
	button:hover:not(:disabled) {
		--border: currentcolor;

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
</style>
