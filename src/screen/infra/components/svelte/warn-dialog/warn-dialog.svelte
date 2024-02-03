<script lang="ts">
	import { Button, ButtonMenu, Dialog, DialogClose, Icon } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { DialogKind, ScreenAction } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'
	import { SudokuAction } from '$sudoku/domain/models'

	let type = 'unsave'

	$: show = $screenState.dialog.kind === DialogKind.Warn
	$: type = $screenState.dialog.kind === DialogKind.Warn ? $screenState.dialog.opts.type : type

	/** Game save and Exit, click handler. */
	function saveAndExitHandler() {
		med.dispatch(SudokuAction.Save).dispatch(ScreenAction.Exit)
	}
</script>

<Dialog type="modal" {show}>
	<section class="content">
		<header class="warn-header">
			<h3 class="warn-title"><Icon id="warn" />{type}:</h3>
			<DialogClose />
		</header>
		<div class="warn-body">
			<ButtonMenu direction="auto">
				<Button on:click={saveAndExitHandler}>Save and exit</Button>
				<Button>Exit unsave</Button>
			</ButtonMenu>
		</div>
	</section>
</Dialog>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: max-content;
		max-width: 60vw;
		overflow: hidden;
		border-radius: 16px;
	}

	.warn-header {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0.4rem;
		background-color: rgb(var(--dialog-header) / 50%);
		border-bottom: 2px solid rgb(var(--alternative-border));
	}

	.warn-title {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding-left: 0.4rem;
		font-size: 1.2rem;
		color: rgb(var(--number-color));
	}

	.warn-body {
		padding: 1rem 0.75rem 0.75rem;
		background-color: rgb(var(--dialog-background));
	}
</style>
