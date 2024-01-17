<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { tooltip, type TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { posState } from '~/share/infra/stores/svelte'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { DialogKind, MainScreenKind, ScreenAction } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'
	import { MODE_KEYS, ModeKind, SudokuAction } from '$sudoku/domain/models'
	import { modeState } from '$sudoku/infra/stores/svelte'

	$: disabled = $screenState.main !== MainScreenKind.Game

	$: open = $screenState.dialog.kind === DialogKind.InLn && $screenState.dialog.opts.type === 'modes'

	let openAccordionTimeoutId: ReturnType<typeof setTimeout> | null = null

	$: if (disabled) med.dispatch(ScreenAction.Exit)
	$: if (open) document.getElementById(`mode-${modeState.data}`)?.focus()

	$: tooltipProps = {
		id: 'disabled-mode-reason',
		text: $i18nState.get('statusBar-modesDisabledReason', 'The insertion mode can only be changed on the game screen.'),
	} satisfies TooltipProps

	/**
	 * Open or close Modes accordion, click handler.
	 */
	function toggleHandler() {
		if (disabled || open) med.dispatch(ScreenAction.Exit)
		else med.dispatch(ScreenAction.OpenDialog, { kind: DialogKind.InLn, opts: { type: 'modes' } })
	}

	/**
	 * Select new Mode, change handler.
	 * @param ev The input event.
	 */
	function modeHandler(ev: { currentTarget: HTMLInputElement }): void
	function modeHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const mode = currentTarget.value as ModeKind

		med.dispatch(SudokuAction.ChangeMode, { mode })
	}

	/**
	 * Clear timeout, focus handler.
	 */
	function focusHandler() {
		if (openAccordionTimeoutId != null) {
			clearTimeout(openAccordionTimeoutId)
			openAccordionTimeoutId = null
		}
	}

	/**
	 * Create timeout, focus-out handler.
	 */
	function focusoutHandler() {
		if (open) openAccordionTimeoutId = setTimeout(() => med.dispatch(ScreenAction.Exit), 150)
	}

	/**
	 * Return focus of the game, Keyup handler.
	 * @param ev The Keyboard event.
	 */
	function keyupHandler(ev: KeyboardEvent): void
	function keyupHandler({ key }: KeyboardEvent) {
		if (key === 'Enter') med.dispatch(SudokuAction.Move, { type: 'set', position: posState.data })
	}
</script>

<div class="mode-accordion" class:open>
	<button
		id="mode-selector-header"
		aria-expanded={open}
		aria-label="Select mode"
		aria-controls="mode-selector-panel"
		aria-disabled={disabled}
		class="status-icon mode"
		on:focus={focusHandler}
		on:focusout={focusoutHandler}
		on:click={toggleHandler}
		use:tooltip={disabled ? tooltipProps : null}
		>{$i18nState.get(`modes-${$modeState}`, $modeState.toUpperCase())}</button
	>
	<div id="mode-selector-panel" role="region" aria-labelledby="mode-selector-header">
		<form method="get">
			{#each Object.values(ModeKind) as mode (mode)}
				<label for="mode-{mode}">
					<input
						id="mode-{mode}"
						name="mode"
						type="radio"
						tabindex={open ? 0 : -1}
						value={mode}
						checked={mode === $modeState}
						on:focus={focusHandler}
						on:focusout={focusoutHandler}
						on:change={modeHandler}
						on:keyup={keyupHandler}
						use:tooltip={{ id: `mode-${mode}-input-key-describe`, text: `<${MODE_KEYS[mode]}>` }}
					/>
					<span>{$i18nState.get(`modes-${mode}`, mode.toUpperCase())}</span><Icon id="check" />
				</label>
			{/each}
		</form>
	</div>
</div>

<style>
	.mode-accordion {
		position: relative;
		height: 44px;
		color: var(--value-color);
	}

	#mode-selector-panel form {
		position: relative;
		bottom: 0;
		z-index: 0;
		display: grid;
		grid-template-columns: 1fr;
		background-color: var(--status-bar-background);
		border: 1px solid var(--tooltip-border);
		border-bottom: none;
		border-radius: 8px 8px 0 0;
		transition: transform 500ms;
		transform: translateY(100%);
	}

	.mode-accordion.open #mode-selector-panel form {
		transform: translateY(-100%);
	}

	input {
		appearance: none;
	}

	label {
		position: relative;
		display: grid;
		gap: 0.5rem;
		place-items: center flex-start;
		width: 100%;
		height: 44px;
		padding-inline: 0.5rem;
		opacity: 0.6;
	}

	label:has(input:hover) {
		filter: var(--focus-brightness);
		backdrop-filter: var(--focus-brightness);
	}

	label:has(input:focus) {
		text-decoration: underline;
		opacity: 1;
	}

	label :global(svg) {
		display: none;
		color: transparent;
	}

	label:has(input:checked) :global(svg) {
		color: var(--input-border);
	}

	label:has(input:focus) :global(svg) {
		color: var(--key-color);
	}

	label span {
		grid-column: 1 / 2;
		width: 100%;
		text-align: center;
	}

	.mode {
		position: absolute;
		z-index: 10;
		width: 100%;
		background-color: var(--status-bar-background);
	}

	.mode[aria-disabled='true'] {
		opacity: 0.75;
	}

	@media (width >= 768px) {
		#mode-selector {
			grid-template-columns: 1fr auto;
		}

		label {
			grid-template-columns: subgrid;
			grid-column: 1 / 3;
		}

		label :global(svg) {
			display: initial;
		}

		.mode::before,
		.mode::after {
			display: contents;
			content: '--';
		}
	}
</style>
