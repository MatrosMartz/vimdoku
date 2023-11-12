<script>
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { boardSvelte } from '$cmd/infra/stores'
	import { SudokuActions } from '$sudoku/domain/models'

	import { startType } from './start-screen.store'

	$: disabledResume = $boardSvelte == null

	function newGameHandler() {
		startType.set('select')
	}

	function resumeHandler() {
		mediator.dispatch(SudokuActions.Resume)
	}
</script>

<ButtonMenu>
	<Button on:click={newGameHandler}>Start new game.</Button>
	<Button
		tooltipProps={{ id: 'resume-disable-reason', text: 'no saved game.' }}
		disabled={disabledResume}
		on:click={resumeHandler}
	>
		Resume game.
	</Button>
</ButtonMenu>
