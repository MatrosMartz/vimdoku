<script lang="ts">
	import type { Position } from '~/share/domain/models'
	import { mediator } from '$cmd/infra/services'
	import { type Cell, SudokuActions } from '$sudoku/domain/models'

	export let data: Cell
	export let position: Position

	$: value = data.value > 0 ? String(data.value) : ''

	function focusHandler() {
		mediator.dispatch(SudokuActions.Move, { type: 'set', position })
	}
</script>

<td><button class="cell {data.kind}" on:focus={focusHandler}>{value}</button></td>

<style>
	td,
	.cell {
		background-color: transparent;
		border: none;
		border-radius: inherit;
	}

	.cell {
		display: grid;
		place-content: center;
		width: 48px;
		aspect-ratio: 1 / 1;
		color: var(--primary-color);
		border: 2px solid transparent;
	}

	.cell:focus {
		animation: blink-cursor 1s infinite alternate;
	}

	@keyframes blink-cursor {
		from {
			border: 2px solid transparent;
		}

		to {
			border: 2px solid var(--alternative-border);
		}
	}

	.incorrect {
		color: var(--error-color);
	}

	.correct {
		color: var(--assert-color);
	}

	.initial {
		color: var(--focus-border);
	}
</style>
