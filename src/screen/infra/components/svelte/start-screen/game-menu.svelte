<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import type { TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { med } from '$cmd/infra/services'
	import { boardSavedState } from '$cmd/infra/stores/svelte'
	import { SudokuActions } from '$sudoku/domain/models'

	import { startType } from './start-screen.store'

	$: disabled = !$boardSavedState

	const tooltipProps: TooltipProps = { id: 'resume-disable-reason', text: 'no saved game.' }

	function newGameHandler() {
		startType.set('select')
	}

	function resumeHandler() {
		med.dispatch(SudokuActions.Resume)
	}
</script>

<div class="menu">
	<ButtonMenu>
		<Button on:click={newGameHandler}>New game</Button>
		<Button {disabled} {tooltipProps} on:click={resumeHandler}>Resume game</Button>
	</ButtonMenu>
</div>

<style>
	.menu {
		padding-top: 102px;
	}
</style>
