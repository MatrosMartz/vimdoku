<script lang="ts">
	import { Button, ButtonMenu, OptionsInput } from '~/share/infra/components/svelte'
	import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { DIFFICULTIES_NAMES, DifficultyKind } from '$sudoku/domain/models'

	let value: keyof typeof DifficultyKind = 'Beginner'

	/**
	 * Go back screen, click handler.
	 */
	function backHandler() {
		med.dispatch(SCREEN_ACTIONS.close)
	}

	/**
	 * Start new game, submit handler.
	 */
	function submitHandler() {
		med.dispatch(SUDOKU_ACTIONS.start, { difficulty: DifficultyKind[value] })
	}
</script>

<form method="dialog" on:submit|preventDefault={submitHandler}>
	<OptionsInput
		name="difficulty-selector"
		label={$i18nState.get('gameBtn-selectDifficulty', 'Select difficulty')}
		settings={{ opts: DIFFICULTIES_NAMES, default: 'Easy' }}
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
