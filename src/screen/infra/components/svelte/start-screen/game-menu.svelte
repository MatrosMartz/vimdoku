<script lang="ts">
	import { Button, ButtonMenu } from '~/share/infra/components/svelte'
	import type { TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { Modal } from '$screen/domain/entities'
	import { savedState } from '$sudoku/infra/stores/svelte'

	$: disabled = !$savedState

	$: tooltipProps = {
		id: 'resume-disable-reason',
		text: $i18nState.get('gameBtn-resume-disabledReason', 'no saved game.'),
	} satisfies TooltipProps

	/** Open select game dialog, new game btn click handler. */
	function newGameHandler() {
		med.dispatch(SCREEN_ACTIONS.openModal, { modal: Modal.createSelGame() })
	}

	/** Resume Game, resume btn click handler. */
	function resumeHandler() {
		med.dispatch(SUDOKU_ACTIONS.resume)
	}
</script>

<ButtonMenu direction="auto">
	<Button on:click={newGameHandler}>{$i18nState.get('gameBtn-new-text', 'New game')}</Button>
	<Button {disabled} {tooltipProps} on:click={resumeHandler}
		>{$i18nState.get('gameBtn-resume-text', 'Resume game')}</Button
	>
</ButtonMenu>
