<script lang="ts">
	import { boardState } from '$cmd/infra/stores/svelte'

	import SudokuCell from './sudoku-cell.svelte'
	import SudokuDivisions from './sudoku-divisions.svelte'
</script>

<table class="board monospace">
	<SudokuDivisions />
	{#if $boardState != null}
		{#each $boardState as row, y (y)}
			<tr class="row-{y}">
				{#each row as cell, x (`${y},${x}`)}
					<SudokuCell data={cell} position={{ y, x }} />
				{/each}
			</tr>
		{/each}
	{/if}
</table>

<style>
	.board {
		position: relative;
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		gap: 4px;
		width: fit-content;
		padding: 8px;
		background-color: var(--editor-background);
		border-radius: 8px;
	}

	tr {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / 10;
		border-radius: inherit;
	}
</style>
