<script lang="ts">
	import { tooltip, type TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { SCREEN_ACTIONS, SUDOKU_ACTIONS } from '$cmd/domain/services'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { DialogKind, MainScreenKind } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'
	import { MODE_KEYS, ModeKind } from '$sudoku/domain/models'
	import { modeState } from '$sudoku/infra/stores/svelte'

	$: disabled = $screenState.main !== MainScreenKind.Game

	$: open = $screenState.dialog.kind === DialogKind.InLn && $screenState.dialog.opts.type === 'modes'

	$: if (disabled) med.dispatch(SCREEN_ACTIONS.close)
	$: if (open) setTimeout(() => document.getElementById(`mode-${modeState.data}`)?.focus(), 500)

	$: tooltipProps = {
		id: 'disabled-mode-reason',
		text: $i18nState.get('statusBar-modesDisabledReason', 'The insertion mode can only be changed on the game screen.'),
	} satisfies TooltipProps

	/**
	 * Open or close Modes accordion, click handler.
	 */
	function toggleHandler() {
		if (disabled || open) med.dispatch(SCREEN_ACTIONS.close)
		else med.dispatch(SCREEN_ACTIONS.openDialog, { kind: DialogKind.InLn, opts: { type: 'modes' } })
	}

	/**
	 * Select new Mode, change handler.
	 * @param ev The input event.
	 */
	function modeHandler(ev: { currentTarget: HTMLInputElement }): void
	function modeHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const mode = currentTarget.value as ModeKind

		med.dispatch(SUDOKU_ACTIONS.changeMode, { mode })
	}

	/**
	 * Close if blur input, blur handler.
	 * @param ev The focus event.
	 */
	function closeHandler(ev: FocusEvent): void
	function closeHandler({ relatedTarget }: FocusEvent) {
		const relatedIsModeSelector = relatedTarget instanceof HTMLElement && relatedTarget.id === 'mode-selector-header'
		const relatedIsModeInput = relatedTarget instanceof HTMLInputElement && relatedTarget.name === 'mode'
		if (!(relatedIsModeInput || relatedIsModeSelector)) med.dispatch(SCREEN_ACTIONS.close)
	}

	/**
	 * Return focus of the game, Keyup handler.
	 * @param ev The Keyboard event.
	 */
	function keyupHandler(ev: KeyboardEvent) {
		if (ev.key === 'Enter') med.dispatch(SCREEN_ACTIONS.close)
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
		on:click={toggleHandler}
		use:tooltip={disabled ? tooltipProps : null}
		>{$i18nState.get(`modes-${$modeState}`, $modeState.toUpperCase())}</button
	>
	<div class="mode-selector-container">
		<form id="mode-selector-panel" role="region" aria-labelledby="mode-selector-header" method="get">
			{#each Object.values(ModeKind) as mode (mode)}
				<label for="mode-{mode}">
					<input
						id="mode-{mode}"
						name="mode"
						aria-disabled={!open}
						type="radio"
						disabled={!open}
						tabindex={open ? 0 : -1}
						value={mode}
						checked={mode === $modeState}
						on:change={modeHandler}
						on:keyup={keyupHandler}
						on:blur={closeHandler}
						use:tooltip={{ id: `mode-${mode}-input-key-describe`, text: `<${MODE_KEYS[mode]}>` }}
					/>
					<span>{$i18nState.get(`modes-${mode}`, mode.toUpperCase())}</span>
				</label>
			{/each}
		</form>
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

	#mode-selector-panel {
		position: relative;
		bottom: 0;
		z-index: 0;
		display: grid;
		background-color: rgb(var(--status-bar-background));
		border: 1px solid rgb(var(--tooltip-border));
		border-bottom: none;
		border-radius: 8px 8px 0 0;
		transition: transform 750ms;
		transform: translateY(100%);
	}

	.mode-accordion.open #mode-selector-panel {
		transform: translateY(-100%);
	}

	input {
		position: absolute;
		appearance: none;
	}

	label {
		position: relative;
		display: grid;
		gap: 0.5rem;
		place-items: center;
		width: 100%;
		height: var(--icon-size);
		padding-inline: 0.75rem;
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

	label span {
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

	.open .mode {
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
