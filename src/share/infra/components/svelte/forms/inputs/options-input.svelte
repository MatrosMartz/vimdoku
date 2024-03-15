<script generics="T extends string" lang="ts">
	import { onMount } from 'svelte'

	import type { OptionField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	import { Icon } from '../..'

	interface IconsProps {
		type?: 'icon' | 'flag' | 'logo'
		id: string
	}

	export let name: string
	export let label = capitalCase(name)
	export let settings: Omit<OptionField<T>, 'type'>
	export let value = settings.default
	export let icons: Record<T, IconsProps> | null = null
	export let i18n: Record<T, string> | null = null

	let index = Math.max(settings.opts.indexOf(value), 0)
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

	/** Set new value. */
	function setValue() {
		value = settings.opts[index]
	}

	/** Close Listbox and set the selected value for the new value. */
	function closeAndSet() {
		setValue()
		closeListbox()
	}

	/** Generic go to first option. */
	function goToFirst() {
		index = 0
	}

	/** Generic go to last option. */
	function goToLast() {
		index = settings.opts.length - 1
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
		Enter: setValue,
		Tab: setValue,
	}

	const EXPANDED_CODE_MAP: Record<string, () => void> = {
		ArrowUp() {
			index = Math.max(index - 1, 0)
		},
		ArrowDown() {
			index = Math.min(index + 1, settings.opts.length - 1)
		},
		Home: goToFirst,
		End: goToLast,
		Escape: closeListbox,
		' ': setValue,
		PageUp() {
			index = Math.max(index - 10, 0)
		},
		PageDown() {
			index = Math.min(index + 10, settings.opts.length - 1)
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
				if (ev.key !== ' ' && ev.key.length === 1) {
					index = Math.max(
						0,
						settings.opts.findIndex(o => o.startsWith(ev.key))
					)
				} else if (ev.altKey) {
					if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') closeAndSet()
				} else EXPANDED_CODE_MAP[ev.key]?.()
			} else CLOSED_CODE_MAP[ev.key]?.()
		}, 0)
	}

	onMount(() => {
		const el = document.getElementById(`opt-${name}-${settings.default}`)
		if (el instanceof HTMLInputElement) el.defaultChecked = true
	})
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
			<span class="combo-value">{i18n?.[value] ?? capitalCase(value)}</span><Icon id="chevron-down" />
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
		{#each settings.opts as opt, i (opt)}
			<li class="listbox-item" class:current={i === index}>
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
				<label for="opt-{name}-{opt}" class="listbox-label">
					<span>{i18n?.[opt] ?? capitalCase(opt)}</span>
					{#if icons != null}
						<span class="icon">
							<Icon {...icons[opt]} />
						</span>
					{/if}
				</label>
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
		transition: transform 500ms;
		transform-origin: top;
	}

	label:has(.combobox[aria-expanded='false']) ~ .listbox {
		transform: scaleY(0);
	}

	label:has(.combobox[aria-expanded='true']) ~ .listbox {
		transform: scaleY(100%);
	}

	.listbox-item {
		height: var(--icon-size);
		list-style: none;
		background-color: rgb(var(--input-background));
		border: 2px solid transparent;
		transition: border 250ms;
	}

	.listbox-item:last-child {
		border-radius: 0 0 10px 10px;
	}

	.listbox-item:hover {
		filter: var(--focus-brightness);
	}

	.listbox-label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		padding-inline: 1rem;
	}

	.icon {
		display: grid;
		place-content: center;
		width: 2em;
		height: 2em;
		filter: opacity(50%);
		border-radius: 50%;
		transition: filter 200ms;
		transform: translateX(20%);
	}

	.listbox-option {
		display: block;
		appearance: none;
	}

	.current .listbox-label .icon {
		filter: opacity(100%);
	}

	.listbox-option:checked ~ .listbox-label .icon {
		border: 2px solid rgb(var(--focus-border));
	}

	.listbox-item.current {
		border: 2px solid rgb(var(--focus-border));
	}
</style>
