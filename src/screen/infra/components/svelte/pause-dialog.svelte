<script>
	import { Button, ButtonMenu, Dialog, Icon } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { DialogKind, MainScreenKind, ScreenAction } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'
	import { SudokuAction } from '$sudoku/domain/models'

	$: show = $screenState.dialog.kind === DialogKind.Pause

	function continueHandler() {
		med.dispatch(ScreenAction.Exit)
	}

	function saveHandler() {
		med.dispatch(SudokuAction.Save)
	}

	function homeHandler() {
		med.dispatch(ScreenAction.OpenScreen, { screen: MainScreenKind.Start })
	}

	function prefsHandler() {
		med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.PrefEdit })
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
		gap: 1rem;
		align-items: center;
		justify-content: center;
		width: 60vmin;
		min-width: max-content;
		padding: 48px 1rem;
		overflow: hidden;
		background-color: var(--dialog-background);
		border-radius: 8px;
	}

	h2 {
		display: flex;
		align-items: center;
		padding-inline: 1rem;
	}
</style>
