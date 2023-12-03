<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import type { TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { med } from '$cmd/infra/services'
	import { boardSavedState, i18nState } from '$cmd/infra/stores/svelte'
	import { SudokuActions } from '$sudoku/domain/models'

	import { startType } from './start-screen.store'

	$: disabled = !$boardSavedState

	$: tooltipProps = {
		id: 'resume-disable-reason',
		text: $i18nState.get('gameBtn-resume-disabledReason', 'no saved game.'),
	} satisfies TooltipProps

	function newGameHandler() {
		startType.set('select')
	}

	function resumeHandler() {
		med.dispatch(SudokuActions.Resume)
	}
</script>

<div class="menu">
	<ButtonMenu>
		<Button on:click={newGameHandler}>{$i18nState.get('gameBtn-new-text', 'New game')}</Button>
		<Button {disabled} {tooltipProps} on:click={resumeHandler}
			>{$i18nState.get('gameBtn-resume-text', 'Resume game')}</Button
		>
	</ButtonMenu>
</div>

<style>
	.menu {
		padding-top: 102px;
	}
</style>
