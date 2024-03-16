<script>
	import { Dialog } from '~/share/infra/components/svelte'
	import { ModalEntity } from '$screen/domain/entities'
	import { screenState } from '$screen/infra/stores/svelte'

	import SelectGame from './select-game.svelte'
</script>

<Dialog type="modal" show={ModalEntity.isSelGame($screenState.modal)}>
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
		background-color: rgb(var(--dialog-background));
		border-radius: 16px;
	}
</style>
