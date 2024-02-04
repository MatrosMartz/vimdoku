<script>
	import { Button, ButtonMenu, Dialog, Icon } from '~/share/infra/components/svelte'
	import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { DialogKind, MainScreenKind } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	$: show = $screenState.dialog.kind === DialogKind.Pause

	/**
	 * Continue game, click handler.
	 */
	function continueHandler() {
		med.dispatch(SCREEN_ACTIONS.close)
	}

	/**
	 * Save game, click handler.
	 */
	function saveHandler() {
		med.dispatch(SUDOKU_ACTIONS.save)
	}

	/**
	 * Return to home, click handler.
	 */
	function homeHandler() {
		med.dispatch(SCREEN_ACTIONS.openMain, { mainScreen: MainScreenKind.Start })
	}

	/**
	 * Edit preferences, click handler.
	 */
	function prefsHandler() {
		med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.PrefEdit })
	}
</script>

<Dialog type="modal" {show}>
	<div class="content">
		<h2>Pause</h2>
		<ButtonMenu direction="column">
			<Button justify="start" on:click={continueHandler}><Icon id="play" /> <span>Continue</span></Button>
			<Button justify="start" on:click={saveHandler}><Icon id="save" /> <span>Save</span></Button>
			<Button justify="start" on:click={prefsHandler}><Icon id="pref" /> <span>Preferences</span></Button>
			<Button justify="start" on:click={homeHandler}><Icon id="home" /> <span>Home</span></Button>
		</ButtonMenu>
	</div>
</Dialog>

<style>
	.content {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		align-items: center;
		justify-content: center;
		width: 70vmin;
		min-width: max-content;
		height: max-content;
		min-height: 60vh;
		padding: 1em;
		overflow: hidden;
		background-color: rgb(var(--dialog-background));
		border-radius: 8px;
	}

	h2 {
		display: flex;
		align-items: center;
		padding-inline: 1rem;
	}
</style>
