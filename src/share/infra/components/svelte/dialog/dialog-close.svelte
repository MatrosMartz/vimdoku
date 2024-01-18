<script lang="ts">
	import { med } from '$cmd/infra/services'
	import { ScreenAction } from '$screen/domain/models'

	import Icon from '../icon.svelte'
</script>

<button type="button" on:click={() => med.dispatch(ScreenAction.Exit)}><Icon id="quit" /></button>

<style>
	button {
		--border: var(--alternative-border);

		width: 100%;
		height: 100%;
		color: inherit;
		background-color: rgb(var(--alternative-border));
		border: none;
		border: 2px solid rgb(var(--border));
		border-radius: inherit;
	}

	button:focus {
		--border: var(--focus-border);
	}

	button:hover {
		filter: var(--focus-brightness);
	}
</style>
