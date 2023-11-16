<script>
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { boardSavedState } from '$cmd/infra/stores/svelte'
	import { SudokuActions } from '$sudoku/domain/models'

	import { startType } from './start-screen.store'

	function newGameHandler() {
		startType.set('select')
	}

	function resumeHandler() {
		mediator.dispatch(SudokuActions.Resume)
	}
</script>

<div class="menu">
	<ButtonMenu>
		<Button on:click={newGameHandler}>New game</Button>
		<Button
			tooltipProps={{ id: 'resume-disable-reason', text: 'no saved game.' }}
			disabled={$boardSavedState}
			on:click={resumeHandler}
		>
			Resume game
		</Button>
	</ButtonMenu>
</div>

<style>
	.menu {
		padding-top: 102px;
	}
</style>
