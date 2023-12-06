<script lang="ts">
	import { onMount } from 'svelte'

	import { type Sugg } from '$cmd/domain/models'
	import { exec } from '$cmd/infra/services'

	import { input } from './input.store'

	export let suggestion: Sugg

	let btn: HTMLButtonElement

	function clickHandler() {
		if ($input != null) {
			exec.searchAutocomplete(suggestion.input)
			$input.value = suggestion.input
			$input.focus()
		}
	}

	onMount(() => {
		btn.insertAdjacentElement('afterbegin', suggestion.header)
	})
</script>

<li>
	<button bind:this={btn} tabindex="0" on:click={clickHandler}>
		{#each suggestion.descriptions as desc}
			<p>{desc}</p>
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
		color: var(--primary-color);
		text-align: left;
		background-color: var(--editor-background);
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
		background-color: var(--input-shadow);
	}
</style>
