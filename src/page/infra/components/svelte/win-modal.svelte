<script>
	import { Dialog } from '~/share/infra/components/svelte'
	import { Modal } from '$page/domain/entities'
	import { pageState } from '$page/infra/stores/svelte'
	import { errorsState, timerState } from '$sudoku/infra/stores/svelte'

	import { SelectGame } from './select-dialog'
</script>

<Dialog type="modal" show={Modal.Win.is($pageState.modal)}>
	<div class="content">
		<h2>You are win!</h2>
		<section>
			<p><strong>Errors</strong> <span>{$errorsState}</span></p>
			<p><strong>Time</strong> <span>{$timerState}</span></p>
			<p><strong>Difficulty</strong> <span>Some</span></p>
		</section>
		<SelectGame />
	</div>
</Dialog>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 80vw;
		max-width: 600px;
		height: 90vh;
		overflow: hidden;
		background-color: rgb(var(--dialog-background));
		border-radius: 8px;
	}
</style>
