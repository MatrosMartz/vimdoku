<script>
	import { derived } from 'svelte/store'

	import { Dialog } from '~/share/infra/components/svelte'
	import { DialogKinds } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	import SelectGame from './select-game.svelte'

	const dialogState = derived(screenState, ({ dialog }) => dialog.kind === DialogKinds.sel)
</script>

<Dialog type="modal" {dialogState}>
	<div class="content">
		<SelectGame />
	</div>
</Dialog>

<style>
	.content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		justify-content: center;
		width: 60vmin;
		min-width: max-content;
		padding: 48px 1rem;
		overflow: hidden;
		background-color: var(--dialog-background);
		border-radius: 8px;
	}
</style>
