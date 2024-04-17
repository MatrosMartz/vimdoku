<script>
	import { Dialog } from '~/share/infra/components/svelte'
	import { Modal } from '$page/domain/entities'
	import { pageState } from '$page/infra/stores/svelte'

	import SelectGame from './select-game.svelte'
</script>

<Dialog type="modal" show={Modal.SelGame.is($pageState.modal)}>
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
