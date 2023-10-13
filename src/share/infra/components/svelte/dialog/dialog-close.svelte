<script lang="ts">
	import { getDialogContext } from './dialog.context'

	const dialog = getDialogContext()
</script>

<li>
	<button
		on:click={() => {
			dialog.close()
		}}
	>
		close
	</button>
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
