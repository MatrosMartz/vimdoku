<script lang="ts">
	import { boardState, prefsState } from '$cmd/infra/stores/svelte'

	import NumberLine from './number-line.svelte'
	import SudokuCell from './sudoku-cell.svelte'
	import SudokuDivisions from './sudoku-divisions.svelte'
</script>

<table class="board monospace" class:numbers={$prefsState.vim.numbers || $prefsState.vim.relativeNumbers}>
	<SudokuDivisions />
	{#if $boardState != null}
		{#each $boardState as row, y (y)}
			<tr class="row-{y}">
				{#each row as data, x (`${y},${x}`)}
					<SudokuCell {data} position={{ y, x }} />
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
		position: relative;
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		gap: 4px;
		width: fit-content;
		padding: 4px;
		margin: min(44px, 8vw) 0 0 min(44px, 8vw);
		background-color: var(--editor-background);
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
</style>
