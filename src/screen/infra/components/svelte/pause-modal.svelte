<script>
	import { Button, ButtonMenu, Dialog, Icon } from '~/share/infra/components/svelte'
	import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { Modal, Route } from '$screen/domain/entities'
	import { screenState } from '$screen/infra/stores/svelte'

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
		med.dispatch(SCREEN_ACTIONS.goTo, { route: Route.createHome() })
	}

	/**
	 * Edit preferences, click handler.
	 */
	function prefsHandler() {
		med.dispatch(SCREEN_ACTIONS.openModal, { modal: Modal.createPref('edit') })
	}
</script>

<Dialog type="modal" show={Modal.isPause($screenState.modal)}>
	<div class="content">
		<header class="pause-header">
			<h3 class="pause-title">Pause</h3>
		</header>
		<div class="pause-body">
			<ButtonMenu direction="column">
				<Button justify="start" on:click={continueHandler}><Icon id="play" /> <span>Continue</span></Button>
				<Button justify="start" on:click={saveHandler}><Icon id="save" /> <span>Save</span></Button>
				<Button justify="start" on:click={prefsHandler}><Icon id="pref" /> <span>Preferences</span></Button>
				<Button justify="start" on:click={homeHandler}><Icon id="home" /> <span>Home</span></Button>
			</ButtonMenu>
		</div>
	</div>
</Dialog>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: min(50vw, 20rem);
		min-width: max-content;
		overflow: hidden;
		border-radius: 16px;
	}

	.pause-header {
		display: flex;
		justify-content: center;
		width: 100%;
		padding: 0.4rem;
		background-color: rgb(var(--dialog-header) / 70%);
		border-bottom: 0.4rem solid rgb(var(--alternative-border));
	}

	.pause-title {
		display: flex;
		align-items: center;
		height: var(--icon-size);
		padding-block: 0.4rem;
		font-size: 1.2rem;
		color: rgb(var(--number-color));
	}

	.pause-body {
		display: grid;
		place-content: center;
		width: 100%;
		padding-block: 1.5rem;
		background-color: rgb(var(--dialog-background));
	}
</style>
