<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import { tooltip, type TooltipProps } from '../tooltip'

	export let tooltipProps: TooltipProps | null = null
	export let disabled = false
	export let type: 'button' | 'submit' | 'reset' = 'button'
	export let justify: 'center' | 'end' | 'start' | 'between' = 'center'

	const dispatch = createEventDispatcher<{ click: MouseEvent }>()

	/**
	 * Create click component event, click handler.
	 * @param ev The mouse event.
	 */
	function clickHandler(ev: MouseEvent) {
		if (!disabled) dispatch('click', ev)
	}
</script>

<li>
	<button
		aria-disabled={disabled}
		{type}
		class="justify-{justify}"
		on:click={clickHandler}
		use:tooltip={disabled ? tooltipProps : null}
	>
		<slot />
	</button>
</li>

<style>
	li {
		position: relative;
		height: min-content;
	}

	button {
		display: flex;
		gap: 1ch;
		align-items: center;
		width: calc(2rem + 15ch);
		min-width: max-content;
		height: 50px;
		padding-inline: 1rem;
		font-weight: 500;
		color: inherit;
		background-color: rgb(var(--input-background));
		border: 2px solid transparent;
		border-radius: 8px;
		transition:
			background-color 200ms ease-out,
			box-shadow 200ms ease-out;
	}

	button:hover {
		filter: var(--focus-brightness);
	}

	button:focus {
		border: 2px solid rgb(var(--focus-border));
	}

	button[aria-disabled='true'] {
		filter: opacity(60%);
	}

	button:not([aria-disabled='true']):active {
		background-color: rgb(var(--alternative-border));
		border: 2px solid rgb(var(--focus-border));
	}
</style>
