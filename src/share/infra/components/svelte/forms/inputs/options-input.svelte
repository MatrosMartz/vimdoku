<script generics="T extends string" lang="ts">
	import { capitalCase } from '~/share/utils'

	import { Icon } from '../..'

	export let name: string
	export let label = capitalCase(name)
	export let options: readonly T[]
	export let value = options[0]

	let index = options.indexOf(value) ?? 0
	let expanded = false
	let listbox: HTMLUListElement

	/** Generic open Listbox. */
	function openListbox() {
		expanded = true
	}

	/** Generic close Listbox. */
	function closeListbox() {
		expanded = false
	}

	/** Generic go to first option. */
	function goToFirst() {
		index = 0
	}

	/** Generic go to last option. */
	function goToLast() {
		index = options.length - 1
	}

	const CLOSED_CODE_MAP: Record<string, () => void> = {
		ArrowUp: openListbox,
		ArrowDown: openListbox,
		Home() {
			openListbox()
			goToFirst()
		},
		End() {
			openListbox()
			goToLast()
		},
		Enter() {
			openListbox()
			value = options[index]
		},
	}

	const EXPANDED_CODE_MAP: Record<string, () => void> = {
		ArrowUp() {
			index = Math.max(index - 1, 0)
		},
		ArrowDown() {
			index = Math.min(index + 1, options.length - 1)
		},
		Home: goToFirst,
		End: goToLast,
		Escape: closeListbox,
		PageUp() {
			index = Math.max(index - 10, 0)
		},
		PageDown() {
			index = Math.min(index + 10, options.length - 1)
		},
	}

	/**
	 * Blur or focus out combobox handler.
	 * @param ev Focus event.
	 */
	function blurHandler({ relatedTarget: related }: FocusEvent) {
		const isListOptionOrThisLabel =
			related instanceof HTMLElement && (listbox.contains(related) || related.getAttribute('for') === `combo-${name}`)

		if (isListOptionOrThisLabel) return

		expanded = false
	}

	/**
	 * Combobox keydown handler.
	 * @param ev Keyboard event.
	 */
	function keydownHandler(ev: KeyboardEvent) {
		if (ev.key.startsWith('Arrow')) ev.preventDefault()
		setTimeout(() => {
			if (expanded) {
				if (ev.key.length === 1) {
					index = options.findIndex(o => o.startsWith(ev.key)) ?? index
				} else if (ev.altKey) {
					if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') closeListbox()
				} else EXPANDED_CODE_MAP[ev.key]?.()
			} else CLOSED_CODE_MAP[ev.key]?.()
		}, 0)
	}
</script>

<div class="combo-container container">
	<label id="combo-label-{name}" for="combo-{name}" tabindex="-1" class="field">
		<span class="secondary">{label}</span>
		<button
			id="combo-{name}"
			role="combobox"
			aria-labelledby="combo-label-{name}"
			aria-expanded={expanded}
			aria-haspopup="listbox"
			aria-controls="listobox-{name}"
			aria-activedescendant="opt-{name}-{value}"
			type="button"
			tabindex="0"
			class="combobox text-or-number"
			on:click={() => (expanded = !expanded)}
			on:blur={blurHandler}
			on:keydown={keydownHandler}
		>
			<span class="combo-value">{value}</span><Icon id="chevron-down" />
		</button>
	</label>
	<ul
		bind:this={listbox}
		id="listbox-{name}"
		role="listbox"
		aria-labelledby="comno-label-{name}"
		tabindex="-1"
		class="listbox"
	>
		{#each options as opt (opt)}
			<li class:current={opt === options[index]}>
				<input
					id="opt-{name}-{opt}"
					name="opt-{name}"
					role="option"
					aria-selected={opt === value}
					type="radio"
					tabindex="-1"
					value={opt}
					class="listbox-option"
					bind:group={value}
					on:click={() => (expanded = false)}
				/>
				<label for="opt-{name}-{opt}"><span>{opt}</span></label>
			</li>
		{/each}
	</ul>
</div>

<style>
	.combo-container {
		position: relative;
	}

	.combobox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 4rem);
		transition: border-radius 500ms;
	}

	.combobox[aria-expanded='true'] {
		border-radius: 12px 12px 0 0;
	}

	.combobox :global(svg) {
		transition: transform 300ms;
		transform: rotate(90deg);
	}

	.combobox[aria-expanded='true'] :global(svg) {
		transform: rotate(0);
	}

	.combobox :global(*) {
		pointer-events: none;
	}

	.listbox {
		position: absolute;
		inset: 100% 2rem;
		z-index: 1;
		width: calc(100% - 4rem);
		height: min-content;
		overflow: hidden;
		border: 2px solid rgb(var(--input-border));
		border-top: none;
		border-radius: 0 0 12px 12px;
		transform: scaleY(0);
		transform-origin: top;
	}

	label:has(.combobox[aria-expanded='false']) ~ .listbox {
		animation: listbox-close 500ms;
	}

	@keyframes listbox-close {
		to {
			transform: scaleY(0);
		}

		from {
			transform: scaleY(100%);
		}
	}

	label:has(.combobox[aria-expanded='true']) ~ .listbox {
		transform: scaleY(100%);
		animation: listbox-open 500ms;
	}

	@keyframes listbox-open {
		from {
			transform: scaleY(0);
		}

		to {
			transform: scaleY(100%);
		}
	}

	.listbox li {
		height: var(--icon-size);
		list-style: none;
		background-color: rgb(var(--input-background));
		border: 2px solid transparent;
		transition: border 250ms;
	}

	.listbox li:last-child {
		border-radius: 0 0 10px 10px;
	}

	.listbox li:hover {
		filter: var(--focus-brightness);
	}

	.listbox label {
		display: flex;
		align-items: center;
		height: 100%;
		padding-inline: 1rem;
	}

	.listbox-option {
		display: block;
		appearance: none;
	}

	li.current label {
		text-decoration: underline 2px;
	}

	li.current {
		border: 2px solid rgb(var(--focus-border));
	}
</style>
