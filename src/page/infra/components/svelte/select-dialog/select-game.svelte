<script lang="ts">
	import { Button, ButtonMenu, OptionsInput } from '~/share/infra/components/svelte'
	import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { Difficulty } from '$sudoku/domain/const'

	let value = Difficulty.Kind.easy

	/**
	 * Go back screen, click handler.
	 */
	function backHandler() {
		med.dispatch(SCREEN_ACTIONS.back)
	}

	/**
	 * Start new game, submit handler.
	 */
	function submitHandler() {
		med.dispatch(SUDOKU_ACTIONS.start, { difficulty: value })
	}
</script>

<form method="dialog" on:submit|preventDefault={submitHandler}>
	<OptionsInput
		name="difficulty-selector"
		getLabelsBy="key"
		label={$i18nState.ns('share').gameBtn_selectDifficulty('Select difficulty')}
		settings={{ opts: Difficulty.KINDS, default: Difficulty.Kind.easy }}
		bind:value
	/>

	<ButtonMenu direction="auto-reverse">
		<Button on:click={backHandler}>{$i18nState.ns('share').gameBtn_goBack('Go back')}</Button>
		<Button type="submit">{$i18nState.ns('share').gameBtn_start('Start new game')}</Button>
	</ButtonMenu>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 70vw;
	}

	form :global(.field) {
		flex-basis: 0;
	}
</style>
