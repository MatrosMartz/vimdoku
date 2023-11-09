<script>
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { boardSvelte } from '$cmd/infra/stores'
	import { SudokuActions } from '$sudoku/domain/models'

	$: disabledResume = $boardSvelte == null

	function resumeHandler() {
		mediator.dispatch(SudokuActions.Resume)
	}
</script>

<ButtonMenu>
	<Button>Start new game.</Button>
	<Button reason="no saved game." disabled={disabledResume} on:click={resumeHandler}>Resume game.</Button>
</ButtonMenu>
