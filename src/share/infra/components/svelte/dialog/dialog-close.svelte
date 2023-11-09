<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { ScreenActions } from '$screen/domain/models'

	import Icon from '../icon.svelte'
</script>

<button on:click={() => mediator.dispatch(ScreenActions.Exit)}><Icon id="quit" /></button>

<style>
	button {
		width: 100%;
		height: 100%;
		color: inherit;
		background-color: rgb(86 57 83);
		border: none;
	}

	button:focus,
	button:hover {
		filter: brightness(80%);
		outline: none;
	}
</style>
