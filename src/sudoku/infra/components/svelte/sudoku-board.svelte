<script lang="ts">
	import { Pos } from '~/share/domain/entities'
	import { prefsState } from '$pref/infra/stores/svelte'
	import { boardState } from '$sudoku/infra/stores/svelte'

	import NumberLine from './number-line.svelte'
	import SudokuCell from './sudoku-cell.svelte'
	import SudokuDivisions from './sudoku-divisions.svelte'
</script>

<table class="board monospace" class:numbers={$prefsState.numbers || $prefsState.relativeNumbers}>
	<SudokuDivisions />
	{#if $boardState != null}
		{#each $boardState as row, y (y)}
			<tr class="row-{y}">
				{#each row as data, x (`${y},${x}`)}
					<SudokuCell {data} pos={new Pos({ y, x })} />
				{/each}
			</tr>
		{/each}
	{/if}
	{#if $prefsState.numbers || $prefsState.relativeNumbers}
		<div aria-hidden="true" class="lines-container">
			<NumberLine direction="horizontal" />
			<NumberLine direction="vertical" />
		</div>
	{/if}
</table>

<style>
	.board {
		--cell-size: 44px;

		position: relative;
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		gap: 4px;
		width: fit-content;
		padding: 4px;
		margin: min(calc(var(--cell-size) * 0.6), 5vw) 0 0 min(var(--cell-size), 8vw);
		background-color: rgb(var(--editor-background));
		filter: opacity(90%);
		border: 2px solid transparent;
		border-radius: 8px;
		transition:
			border-color 500ms,
			filter 20ms;
	}

	.board:has(*:focus) {
		filter: opacity(100%);
		border-color: rgb(var(--focus-border));
	}

	.board:has(*:focus) :global(.number-line) {
		border-color: rgb(var(--focus-border));
	}

	.board.numbers {
		border-top: none;
		border-left: none;
		border-radius: 0 0 8px;
	}

	tr {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / 10;
		border-radius: inherit;
	}

	.lines-container {
		position: absolute;
		display: initial;
	}

	@media (width >= 768px) and (orientation: portrait) {
		.board {
			--cell-size: 7vw;
		}
	}
</style>
