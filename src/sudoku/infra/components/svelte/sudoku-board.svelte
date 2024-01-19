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
					<SudokuCell {data} position={new Pos({ y, x })} />
				{/each}
			</tr>
		{/each}
	{/if}
	<div aria-hidden="true" class="lines-container">
		<NumberLine direction="horizontal" />
		<NumberLine direction="vertical" />
	</div>
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
		border-radius: 8px;
	}

	.board.numbers {
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
		display: none;
	}

	.board.numbers .lines-container {
		display: initial;
	}

	@media (width >= 768px) and (orientation: portrait) {
		.board {
			--cell-size: 7vw;
		}
	}
</style>
