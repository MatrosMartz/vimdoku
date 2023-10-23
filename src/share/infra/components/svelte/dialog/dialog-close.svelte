<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { ScreenActions } from '$screen/domain/models'
</script>

<li>
	<button on:click={() => mediator.dispatch(ScreenActions.Exit)}>close</button>
</li>

<style>
	li button {
		position: absolute;
		right: 0;
		height: 100%;
		aspect-ratio: 1 / 1;
		border: none;
	}
</style>
