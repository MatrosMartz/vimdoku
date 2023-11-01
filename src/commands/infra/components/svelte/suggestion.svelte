<script lang="ts">
	import { onMount } from 'svelte'

	import { type Suggestion } from '$cmd/domain/models'

	export let suggestion: Suggestion

	let btn: HTMLButtonElement

	onMount(() => {
		btn.insertAdjacentElement('afterbegin', suggestion.header)
	})
</script>

<li>
	<button tabindex="0" bind:this={btn}>
		<p>{suggestion.desc}</p>
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
		color: rgb(204 184 221);
		text-align: left;
		background-color: rgb(12 7 17);
		border: none;
		transition: filter 200ms;
	}

	button:hover {
		filter: brightness(0.9) saturate(2) contrast(1.1);
	}

	button:focus {
		filter: brightness(1.1) saturate(1.6) contrast(0.97);
		outline: none;
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
