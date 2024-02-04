<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import { SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'

	/** Check sudoku, check click handler. */
	function clickHandler() {
		med.dispatch(SUDOKU_ACTIONS.verify)
	}
</script>

<ButtonMenu>
	<Button on:click={clickHandler}>Check</Button>
</ButtonMenu>
