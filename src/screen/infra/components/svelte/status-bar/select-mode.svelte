<script lang="ts">
	import { tooltip, type TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { Modal, Page } from '$screen/domain/entities'
	import { screenState } from '$screen/infra/stores/svelte'
	import { MODE_KEYS, type ModeKind, MODES } from '$sudoku/domain/models'
	import { modeState } from '$sudoku/infra/stores/svelte'

	let listbox: HTMLUListElement
	let index = Math.max(MODES.indexOf($modeState), 0)

	$: disabled = !Page.isGame($screenState.page)
	$: expanded = Modal.isModes($screenState.modal)
	$: locale = $i18nState.ns('share')
	$: tooltipProps = {
		id: 'disabled-mode-selector-reason',
		text: locale.statusBar_modesDisabledReason('The insertion mode can only be changed on the game screen.'),
	} satisfies TooltipProps

	/** Generic open Listbox. */
	function openListbox() {
		med.dispatch(SCREEN_ACTIONS.openModal, { modal: Modal.createModes() })
	}

	/** Generic close Listbox. */
	function closeListbox() {
		med.dispatch(SCREEN_ACTIONS.close)
	}

	/** Set new value. */
	function setValue() {
		med.dispatch(SUDOKU_ACTIONS.changeMode, { mode: MODES.at(index)! })
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
		index = MODES.length - 1
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
			index = Math.min(index + 1, MODES.length - 1)
		},
		Home: goToFirst,
		End: goToLast,
		' ': setValue,
		PageUp() {
			index = Math.max(index - 10, 0)
		},
		PageDown() {
			index = Math.min(index + 10, MODES.length - 1)
		},
	}

	/**
	 * Blur or focus out combobox handler.
	 * @param ev Focus event.
	 */
	function blurHandler({ relatedTarget }: FocusEvent) {
		const isListOption = relatedTarget instanceof HTMLElement && listbox.contains(relatedTarget)

		if (isListOption) return

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
						MODES.findIndex(modes => modes.startsWith(ev.key))
					)
				} else if (ev.altKey) {
					if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') closeAndSet()
				} else EXPANDED_CODE_MAP[ev.key]?.()
			} else CLOSED_CODE_MAP[ev.key]?.()
		}, 0)
	}

	/**
	 * Select new Mode, change handler.
	 * @param ev The input event.
	 */
	function modeHandler(ev: { currentTarget: HTMLInputElement }): void
	function modeHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const mode = currentTarget.value as ModeKind
		index = Math.max(MODES.indexOf(mode), 0)

		med.dispatch(SUDOKU_ACTIONS.changeMode, { mode })
	}
</script>

<div class="mode-accordion" class:expanded>
	<button
		id="mode-selector-combobox"
		role="combobox"
		aria-expanded={expanded}
		aria-haspopup="listbox"
		aria-controls="lisbox-mode"
		aria-activedescendant="opt-mode-{$modeState}"
		aria-disabled={disabled}
		type="button"
		tabindex="0"
		class="status-icon mode"
		on:click={() => {
			if (!disabled) {
				if (expanded) closeListbox()
				else openListbox()
			}
		}}
		on:blur={blurHandler}
		on:keydown={keydownHandler}
		use:tooltip={disabled ? tooltipProps : null}
	>
		{locale[`modes_${$modeState}`]($modeState.toLowerCase())}
	</button>
	<div class="mode-selector-container">
		<ul bind:this={listbox} id="listbox-mode" role="listbox" tabindex="-1" class="listbox">
			{#each MODES.unwrap() as mode, i (mode)}
				<li class="listbox-item" class:current={i === index}>
					<label for="opt-mode-{mode}" class="listbox-label">
						<input
							id="opt-mode-{mode}"
							name="opt-mode"
							role="option"
							aria-selected={mode === $modeState}
							type="radio"
							disabled={!expanded}
							tabindex="-1"
							value={mode}
							class="listbox-option"
							on:change={modeHandler}
							on:click={() => (expanded = false)}
							use:tooltip={{ id: `mode-${mode}-input-key-describe`, text: `<${MODE_KEYS[mode]}>` }}
						/>
						<span>{locale[`modes_${mode}`](mode.toUpperCase())}</span>
					</label>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.mode-accordion {
		position: relative;
		height: var(--icon-size);
		color: rgb(var(--value-color));
	}

	.mode-selector-container {
		height: 100%;
		clip-path: polygon(0 50%, 100% 50%, 100% -500%, 0 -500%);
	}

	#listbox-mode {
		position: relative;
		bottom: 0;
		z-index: 0;
		display: grid;
		background-color: rgb(var(--status-bar-background));
		border-bottom: none;
		border-radius: 8px 8px 0 0;
		transition: transform 750ms;
		transform: translateY(100%);
	}

	.mode-accordion.expanded #listbox-mode {
		transform: translateY(-100%);
	}

	.listbox-option {
		position: absolute;
		appearance: none;
	}

	.listbox-label {
		position: relative;
		display: grid;
		gap: 0.5rem;
		place-items: center;
		width: 100%;
		height: var(--icon-size);
		padding-inline: 0.75rem;
		opacity: 0.6;
	}

	.listbox-label:has(.listbox-option:hover) {
		filter: var(--focus-brightness);
		backdrop-filter: var(--focus-brightness);
	}

	.listbox-label:has(.listbox-option:focus) {
		text-decoration: underline;
		opacity: 1;
	}

	.listbox-item {
		border: 2px solid transparent;
	}

	.listbox-item:first-child {
		border-radius: 8px 8px 0 0;
	}

	.listbox-item.current {
		border-color: rgb(var(--focus-border));
	}

	.listbox-label span {
		grid-column: 1 / 2;
		width: 100%;
		text-align: center;
	}

	.mode {
		position: absolute;
		z-index: 10;
		width: 100%;
		padding-left: 0.4rem;
		background-color: rgb(var(--status-bar-background));
		transition: border-top-left-radius 500ms;
	}

	.expanded .mode {
		border-top-left-radius: 0;
	}

	.mode[aria-disabled='true'] {
		opacity: 0.75;
	}

	@media (width >= 480px) {
		.mode {
			border-radius: 16px 0 0 16px;
		}
	}
</style>
