<script lang="ts">
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'

	import Icon from '../icon.svelte'
</script>

<button type="button" on:click={() => med.dispatch(SCREEN_ACTIONS.close)}><Icon id="quit" /></button>

<style>
	button {
		--border: var(--alternative-border);

		width: var(--icon-size);
		height: var(--icon-size);
		color: inherit;
		background-color: rgb(var(--alternative-border));
		border: none;
		border: 2px solid rgb(var(--border));
		border-radius: 12px;
	}

	button:focus {
		--border: var(--focus-border);
	}

	button:hover {
		filter: var(--focus-brightness);
	}
</style>
