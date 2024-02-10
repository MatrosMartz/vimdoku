<script lang="ts">
	import { onMount } from 'svelte'

	import { type Sugg } from '$cmd/domain/entities'
	import { exec } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'

	import { input } from './input.store'

	export let suggestion: Sugg<HTMLHeadElement>

	let btn: HTMLButtonElement

	/** Complete search with the suggestion value, click handler. */
	function clickHandler() {
		if ($input == null) return

		exec.searchAutocomplete(suggestion.value)
		$input.value = suggestion.value
		$input.focus()
	}

	onMount(() => {
		btn.insertAdjacentElement('afterbegin', suggestion.header)
	})
</script>

<li>
	<button bind:this={btn} tabindex="0" on:click={clickHandler}>
		{#each suggestion.desc as desc}
			<p>{desc(i18nState.data)}</p>
		{/each}
	</button>
</li>

<style>
	li {
		position: relative;
	}

	button {
		width: 100%;
		min-height: 48px;
		padding: 12px 1rem;
		color: rgb(var(--primary-color));
		text-align: left;
		background-color: rgb(var(--tooltip-background));
		border: none;
		transition: filter 200ms;
	}

	button:hover {
		filter: var(--focus-brightness);
	}

	button:focus {
		filter: brightness(80%) saturate(2) contrast(1.1);
	}

	li:not(:last-of-type)::after {
		position: absolute;
		inset: auto 0 -1px;
		z-index: 10;
		width: 95%;
		height: 2px;
		margin-inline: auto;
		content: '';
		background-color: rgb(var(--dialog-header) / 75%);
	}
</style>
