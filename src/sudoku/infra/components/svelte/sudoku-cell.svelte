<script lang="ts">
	import type { Pos } from '~/share/domain/models'
	import { PosSvc } from '~/share/domain/services'
	import { posState } from '~/share/infra/stores/svelte'
	import { med } from '$cmd/infra/services'
	import { type Cell, SudokuAction } from '$sudoku/domain/models'

	export let data: Cell
	export let position: Pos

	let btn: HTMLElement

	$: value = data.value > 0 ? String(data.value) : ''
	$: selected = PosSvc.equalsPos($posState, position)

	$: if (selected) btn?.focus()

	function focusHandler() {
		if (PosSvc.equalsPos($posState, position)) return
		med.dispatch(SudokuAction.Move, { type: 'set', position })
	}
</script>

<td>
	<button bind:this={btn} tabindex="-1" class="cell {data.kind}" class:selected on:focus={focusHandler}>
		<span class="value">{value}</span>
		<div class="note-icon">
			{#each data.notes as note, i}
				<span class="note-{i}">{note ?? ''}</span>
			{/each}
		</div>
	</button>
</td>

<style>
	td,
	.cell {
		font-family: inherit;
		font-size: 1em;
		background-color: transparent;
		border: none;
	}

	.cell {
		display: grid;
		place-content: center;
		width: 44px;
		max-width: 8vw;
		aspect-ratio: 1 / 1;
		color: var(--primary-color);
		background-color: var(--editor-background);
		border-radius: 8px;
	}

	.cell.selected {
		background-color: var(--blink-background);
	}

	.cell:focus {
		animation: blink-cursor 1s infinite alternate;
	}

	@keyframes blink-cursor {
		from {
			background-color: var(--editor-background);
		}

		to {
			background-color: var(--blink-background);
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

	.notes {
		display: inherit;
		color: var(--notes-color);
	}

	.unverified {
		font-style: italic;
		color: var(--unverified-color);
	}

	.note-icon {
		display: none;
		font-size: 0.6rem;
	}

	.notes .note-icon {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}
</style>
