<script lang="ts">
	import type { Pos } from '~/share/domain/models'
	import { PosSvc } from '~/share/domain/services'
	import { med } from '$cmd/infra/services'
	import { posState } from '$cmd/infra/stores'
	import { type Cell, SudokuActions } from '$sudoku/domain/models'

	export let data: Cell
	export let position: Pos

	let btn: HTMLElement

	$: value = data.value > 0 ? String(data.value) : ''
	$: selected = PosSvc.equalsPos($posState, position)

	$: if (selected) btn?.focus()

	function focusHandler() {
		if (PosSvc.equalsPos($posState, position)) return
		med.dispatch(SudokuActions.Move, { type: 'set', position })
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
		border-radius: 8px;
	}

	.cell.selected {
		backdrop-filter: var(--focus-brightness);
	}

	.cell:focus {
		animation: blink-cursor 1s infinite alternate;
	}

	@keyframes blink-cursor {
		from {
			backdrop-filter: brightness(100%);
		}

		to {
			backdrop-filter: var(--focus-brightness);
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
