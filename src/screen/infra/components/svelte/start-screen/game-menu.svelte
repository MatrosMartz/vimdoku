<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import type { TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'
	import { SudokuActions } from '$sudoku/domain/models'
	import { savedState } from '$sudoku/infra/stores/svelte'

	$: disabled = !$savedState

	$: tooltipProps = {
		id: 'resume-disable-reason',
		text: $i18nState.get('gameBtn-resume-disabledReason', 'no saved game.'),
	} satisfies TooltipProps

	function newGameHandler() {
		med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.sel })
	}

	function resumeHandler() {
		med.dispatch(SudokuActions.Resume)
	}
</script>

<ButtonMenu>
	<Button on:click={newGameHandler}>{$i18nState.get('gameBtn-new-text', 'New game')}</Button>
	<Button {disabled} {tooltipProps} on:click={resumeHandler}
		>{$i18nState.get('gameBtn-resume-text', 'Resume game')}</Button
	>
</ButtonMenu>
