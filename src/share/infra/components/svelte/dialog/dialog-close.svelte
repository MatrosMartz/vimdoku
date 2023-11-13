<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { ScreenActions } from '$screen/domain/models'

	import Icon from '../icon.svelte'
</script>

<button on:click={() => mediator.dispatch(ScreenActions.Exit)}><Icon id="quit" /></button>

<style>
	button {
		--border: var(--alternative-border);

		width: 100%;
		height: 100%;
		color: inherit;
		background-color: var(--alternative-border);
		border: none;
		border: 2px solid var(--border);
		border-radius: inherit;
	}

	button:focus {
		--border: var(--focus-border);
	}

	button:hover {
		filter: brightness(80%);
	}
</style>
