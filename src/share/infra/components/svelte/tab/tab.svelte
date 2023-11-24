<script lang="ts">
	import { getSelectedContext } from './tab.context'

	export let key: string

	const selected = getSelectedContext()
</script>

<li id="tab{key}" role="tab" aria-controls="panel{key}">
	<button disabled={$selected === key} tabindex="0" on:click>
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
		transition: backdrop-filter 200ms;
	}

	button:disabled {
		backdrop-filter: brightness(130%);
	}

	button:not(:disabled):focus {
		color: var(--focus-border);
		text-decoration: underline 2px;
	}

	button:not(:disabled):hover {
		filter: saturate(105%);
		backdrop-filter: brightness(110%);
	}
</style>
