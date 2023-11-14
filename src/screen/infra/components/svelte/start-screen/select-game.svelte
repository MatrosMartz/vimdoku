<script lang="ts">
	import { Button, ButtonMenu, OptionsInput } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { DIFFICULTIES_NAMES, DifficultyKinds, SudokuActions } from '$sudoku/domain/models'

	import { startType } from './start-screen.store'

	let value: keyof typeof DifficultyKinds = 'Beginner'

	function backHandler() {
		startType.set('start')
	}

	function submitHandler() {
		mediator.dispatch(SudokuActions.Start, { difficulty: DifficultyKinds[value] })
	}
</script>

<form method="dialog" on:submit|preventDefault={submitHandler}>
	<OptionsInput name="difficulty" options={DIFFICULTIES_NAMES} bind:value />

	<ButtonMenu>
		<Button on:click={backHandler}>Go back</Button>
		<Button type="submit">Start</Button>
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
