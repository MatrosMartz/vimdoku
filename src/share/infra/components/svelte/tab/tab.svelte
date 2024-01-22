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
		height: calc(var(--icon-size) + 0.4rem);
		color: inherit;
		background-color: transparent;
		border: none;
		border-radius: 8px 8px 0 0;
		transition: backdrop-filter 200ms;
	}

	button:disabled {
		background-color: rgb(var(--alternative-border));
	}

	button:not(:disabled):focus {
		color: rgb(var(--focus-border));
		text-decoration: underline 2px;
	}

	button:not(:disabled):hover {
		filter: saturate(105%);
		backdrop-filter: brightness(105%);
	}

	:global(.dark) button:not(:disabled):hover {
		backdrop-filter: brightness(110%);
	}
</style>
