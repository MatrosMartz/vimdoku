<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { ScreenActions } from '$screen/domain/models'

	import Icon from '../icon.svelte'
</script>

<li>
	<button on:click={() => mediator.dispatch(ScreenActions.Exit)}><Icon id="quit" /></button>
</li>

<style>
	li {
		position: absolute;
		right: 0;
		height: 100%;
		aspect-ratio: 1 / 1;
	}

	button {
		width: 100%;
		height: 100%;
		color: inherit;
		background-color: transparent;
		border: none;
	}

	button:hover {
		backdrop-filter: brightness(80%);
	}
</style>
