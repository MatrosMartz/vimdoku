<script lang="ts">
	import { Button, ButtonMenu, Dialog, DialogClose, Icon } from '~/share/infra/components/svelte'
	import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { DialogKind } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	let type = 'unsave'

	$: show = $screenState.dialog.kind === DialogKind.Warn
	$: type = $screenState.dialog.kind === DialogKind.Warn ? $screenState.dialog.opts.type : type

	/** Game save and Exit, click handler. */
	function saveAndExitHandler() {
		med.dispatch(SUDOKU_ACTIONS.save).dispatch(SCREEN_ACTIONS.close).dispatch(SCREEN_ACTIONS.close)
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
		width: min(70vw, 20rem);
		min-width: min-content;
		overflow: hidden;
		border-radius: 16px;
	}

	.warn-header {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0.4rem;
		background-color: rgb(var(--dialog-header) / 70%);
		border-bottom: 0.4rem solid rgb(var(--alternative-border));
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
