<script lang="ts">
	import type { Pos } from '~/share/domain/models'
	import { Icon } from '~/share/infra/components/svelte'
	import type { Tuple } from '~/share/types'
	import { boardState, posState } from '$cmd/infra/stores/svelte'
	import type { ValidNumbers } from '$sudoku/domain/models'

	$: notes = $boardState![$posState.y][$posState.x].notes ?? Array(9).fill(null)

	$: empty = notes.every(note => note == null)

	function getNote(pos: Pos, notes: Tuple<ValidNumbers | null, 9>) {
		return notes[pos.x + pos.y * 3] ?? ''
	}
</script>

<article class:empty>
	<h3><Icon id="note" />Notes:</h3>
	<table>
		<tr>
			<td><span class="note">{getNote({ x: 0, y: 0 }, notes)}</span></td>
			<td><span class="note">{getNote({ x: 0, y: 1 }, notes)}</span></td>
			<td><span class="note">{getNote({ x: 0, y: 2 }, notes)}</span></td>
		</tr>
		<tr>
			<td><span class="note">{getNote({ x: 1, y: 0 }, notes)}</span></td>
			<td><span class="note">{getNote({ x: 1, y: 1 }, notes)}</span></td>
			<td><span class="note">{getNote({ x: 1, y: 2 }, notes)}</span></td>
		</tr>
		<tr>
			<td><span class="note">{getNote({ x: 2, y: 0 }, notes)}</span></td>
			<td><span class="note">{getNote({ x: 2, y: 1 }, notes)}</span></td>
			<td><span class="note">{getNote({ x: 2, y: 2 }, notes)}</span></td>
		</tr>
	</table>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 8px;
		color: var(--notes-color);
	}

	h3 {
		display: flex;
		align-items: center;
		color: inherit;
	}

	.empty h3 {
		opacity: 0.7;
	}

	table {
		width: max-content;
		background-color: var(--status-bar-background);
		border-radius: 8px;
	}

	span {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		max-width: 8vw;
		aspect-ratio: 1 / 1;
		line-height: normal;
	}
</style>
