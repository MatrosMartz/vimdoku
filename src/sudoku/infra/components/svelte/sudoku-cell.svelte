<script lang="ts">
	import type { Position } from '~/share/domain/models'
	import { PositionService } from '~/share/domain/services'
	import { mediator } from '$cmd/infra/services'
	import { posState } from '$cmd/infra/stores'
	import { type Cell, SudokuActions } from '$sudoku/domain/models'

	export let data: Cell
	export let position: Position

	let btn: HTMLElement

	$: value = data.value > 0 ? String(data.value) : ''
	$: selected = PositionService.equalsPos($posState, position)

	$: if (selected) btn?.focus()

	function focusHandler() {
		if (PositionService.equalsPos($posState, position)) return
		mediator.dispatch(SudokuActions.Move, { type: 'set', position })
	}
</script>

<td
	><button bind:this={btn} tabindex="-1" class="cell {data.kind}" class:selected on:focus={focusHandler}>{value}</button
	></td
>

<style>
	td,
	.cell {
		font-family: inherit;
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
	}

	.cell.selected {
		backdrop-filter: brightness(150%);
	}

	.cell:focus {
		animation: blink-cursor 1s infinite alternate;
	}

	@keyframes blink-cursor {
		from {
			backdrop-filter: brightness(100%);
		}

		to {
			backdrop-filter: brightness(150%);
		}
	}

	.incorrect {
		color: var(--error-color);
		text-decoration: underline wavy;
	}

	.correct {
		color: var(--assert-color);
	}

	.initial {
		font-weight: 700;
		color: var(--number-color);
	}
</style>
