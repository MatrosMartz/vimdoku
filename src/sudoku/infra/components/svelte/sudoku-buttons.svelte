<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { SudokuActions } from '$sudoku/domain/models'

	function clickHandler() {
		med.dispatch(SudokuActions.Check)
	}
</script>

<ButtonMenu>
	<Button on:click={clickHandler}>Check</Button>
</ButtonMenu>
