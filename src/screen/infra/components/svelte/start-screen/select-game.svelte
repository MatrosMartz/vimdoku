<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import { Button, ButtonMenu, OptionsInput } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { DIFFICULTIES_NAMES, DifficultyKinds, SudokuActions } from '$sudoku/domain/models'

	let value: keyof typeof DifficultyKinds = 'Beginner'

	const dispatch = createEventDispatcher<{ goback: null }>()

	function backHandler() {
		dispatch('goback')
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
