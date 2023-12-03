<script lang="ts">
	import { Button, ButtonMenu, OptionsInput } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$cmd/infra/stores'
	import { DIFFICULTIES_NAMES, DifficultyKinds, SudokuActions } from '$sudoku/domain/models'

	import { startType } from './start-screen.store'

	let value: keyof typeof DifficultyKinds = 'Beginner'

	function backHandler() {
		startType.set('start')
	}

	function submitHandler() {
		med.dispatch(SudokuActions.Start, { difficulty: DifficultyKinds[value] })
	}
</script>

<form method="dialog" on:submit|preventDefault={submitHandler}>
	<OptionsInput
		name="difficulty-selector"
		label={$i18nState.get('gameBtn-selectDifficulty', 'Select difficulty')}
		options={DIFFICULTIES_NAMES}
		bind:value
	/>

	<ButtonMenu>
		<Button on:click={backHandler}>{$i18nState.get('gameBtn-goBack', 'Go back')}</Button>
		<Button type="submit">{$i18nState.get('gameBtn-start', 'Start new game')}</Button>
	</ButtonMenu>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	form :global(.field) {
		flex-basis: 0;
	}
</style>
