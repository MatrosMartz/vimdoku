<script lang="ts">
	import { Button, ButtonMenu, OptionsInput } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { ScreenAction } from '$screen/domain/models'
	import { DIFFICULTIES_NAMES, DifficultyKind, SudokuAction } from '$sudoku/domain/models'

	let value: keyof typeof DifficultyKind = 'Beginner'

	/**
	 * Go back screen, click handler.
	 */
	function backHandler() {
		med.dispatch(ScreenAction.Exit)
	}

	/**
	 * Start new game, submit handler.
	 */
	function submitHandler() {
		med.dispatch(SudokuAction.Start, { difficulty: DifficultyKind[value] })
	}
</script>

<form method="dialog" on:submit|preventDefault={submitHandler}>
	<OptionsInput
		name="difficulty-selector"
		label={$i18nState.get('gameBtn-selectDifficulty', 'Select difficulty')}
		options={DIFFICULTIES_NAMES}
		bind:value
	/>

	<ButtonMenu direction="auto-reverse">
		<Button on:click={backHandler}>{$i18nState.get('gameBtn-goBack', 'Go back')}</Button>
		<Button type="submit">{$i18nState.get('gameBtn-start', 'Start new game')}</Button>
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
