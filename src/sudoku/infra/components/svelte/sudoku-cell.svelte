<script lang="ts">
	import type { Pos } from '~/share/domain/entities'
	import { posState } from '~/share/infra/stores/svelte'
	import { Prtcl } from '~/share/utils'
	import { SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import type { Cell } from '$sudoku/domain/entities'

	export let data: Cell.Cell
	export let pos: Pos.Pos

	let btn: HTMLElement

	$: value = data.value > 0 ? String(data.value) : ''
	$: selected = Prtcl.equals(pos, $posState)

	$: if (selected) btn?.focus()

	/** Change position after focus cell, focus handler. */
	function focusHandler() {
		if (selected) return
		med.dispatch(SUDOKU_ACTIONS.move, { type: 'set', pos })
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
		width: var(--cell-size);
		max-width: 8vw;
		aspect-ratio: 1 / 1;
		color: rgb(var(--primary-color));
		background-color: rgb(var(--editor-background));
		border-radius: 8px;
	}

	.cell.selected {
		background-color: rgb(var(--blink-background));
	}

	.cell:focus {
		animation: blink-cursor 1s infinite alternate;
	}

	@keyframes blink-cursor {
		from {
			background-color: rgb(var(--editor-background));
		}

		to {
			background-color: rgb(var(--blink-background));
		}
	}

	.incorrect {
		color: rgb(var(--error-color));
		text-decoration: underline wavy;
	}

	.correct {
		color: rgb(var(--assert-color));
	}

	.initial {
		font-weight: 700;
		color: rgb(var(--number-color));
	}

	.notes {
		display: inherit;
		color: rgb(var(--notes-color));
	}

	.unverified {
		font-style: italic;
		color: rgb(var(--unverified-color));
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
