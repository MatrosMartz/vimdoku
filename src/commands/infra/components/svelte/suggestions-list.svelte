<script lang="ts">
	import { suggsState } from '$cmd/infra/stores/svelte'

	import Suggestion from './suggestion.svelte'
</script>

<section>
	<ul>
		{#each $suggsState as suggestion (suggestion.id)}
			<Suggestion {suggestion} />
		{/each}
	</ul>
</section>

<style>
	section {
		overflow: hidden;
		border-radius: 8px;
	}

	ul {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
		list-style: none;
	}
</style>
