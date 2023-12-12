<script>
	import { derived } from 'svelte/store'

	import { Dialog } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'
	import { errorsState, timerState } from '$sudoku/infra/stores/svelte'

	import { SelectGame } from './start-screen'

	$: dialogState = derived(screenState, ({ dialog }) => dialog.kind === DialogKinds.Win)

	function gobackHandler() {
		med.dispatch(ScreenActions.Exit)
	}
</script>

<Dialog type="modal" {dialogState}>
	<div class="content">
		<h2>You are win!</h2>
		<section>
			<p><strong>Errors</strong> <span>{$errorsState}</span></p>
			<p><strong>Time</strong> <span>{$timerState}</span></p>
			<p><strong>Difficulty</strong> <span>Some</span></p>
		</section>
		<SelectGame on:goback={gobackHandler} />
	</div>
</Dialog>

<style>
	.content {
		display: flex;
		flex-direction: column;
		width: 80vw;
		max-width: 600px;
		height: 90vh;
		overflow: hidden;
		background-color: var(--dialog-background);
		border-radius: 8px;
	}
</style>
