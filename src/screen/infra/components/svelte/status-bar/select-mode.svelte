<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { tooltip, type TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { med } from '$cmd/infra/services'
	import { modeState, posState, screenState } from '$cmd/infra/stores/svelte'
	import { DialogKinds, MainScreenKinds, ScreenActions } from '$screen/domain/models'
	import { ModeKinds, MODES_KEYS, SudokuActions } from '$sudoku/domain/models'

	$: disabled = $screenState.main !== MainScreenKinds.Game

	$: open = $screenState.dialog.kind === DialogKinds.InLn && $screenState.dialog.opts.type === 'modes'

	let timeoutId: ReturnType<typeof setTimeout> | null = null

	$: if (disabled) med.dispatch(ScreenActions.Exit)
	$: if (open) document.getElementById(`mode-${modeState.data}`)?.focus()

	const tooltipProps: TooltipProps = {
		id: 'disabled-mode-reason',
		text: 'The insertion mode can only be changed on the game screen.',
	}

	function toggleHandler() {
		if (disabled || open) med.dispatch(ScreenActions.Exit)
		else med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.InLn, opts: { type: 'modes' } })
	}

	function modeHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const mode = currentTarget.value as ModeKinds

		med.dispatch(SudokuActions.ChangeMode, { mode })
	}

	function focusHandler() {
		if (timeoutId != null) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
	}

	function focusoutHandler() {
		if (open) timeoutId = setTimeout(() => med.dispatch(ScreenActions.Exit), 150)
	}

	function keyupHandler({ key }: KeyboardEvent) {
		if (key === 'Enter') med.dispatch(SudokuActions.Move, { type: 'set', position: posState.data })
	}
</script>

<div aria-expanded={open} class="mode-accordion" class:open>
	<button
		aria-label="Select mode"
		aria-controls="mode-selector"
		aria-disabled={disabled}
		class="icon mode"
		on:focus={focusHandler}
		on:focusout={focusoutHandler}
		on:click={toggleHandler}
		use:tooltip={disabled ? tooltipProps : null}>{$modeState.toUpperCase()}</button
	>
	<form id="mode-selector" method="get">
		{#each Object.values(ModeKinds) as mode (mode)}
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
					use:tooltip={{ id: `mode-${mode}-input-key-describe`, text: `<${MODES_KEYS[mode]}>` }}
				/>
				<span>{mode.toUpperCase()}</span><Icon id="check" />
			</label>
		{/each}
	</form>
</div>

<style>
	.mode-accordion {
		position: relative;
		height: 44px;
		color: var(--value-color);
	}

	#mode-selector {
		position: relative;
		bottom: 0;
		z-index: 0;
		display: grid;
		grid-template-columns: 1fr;
		background-color: var(--status-bar-background);
		border: 1px solid rgb(31 11 59);
		border-bottom: none;
		border-radius: 8px 8px 0 0;
		transition: transform 500ms;
		transform: translateY(100%);
	}

	.mode-accordion.open #mode-selector {
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
		filter: brightness(120%);
		backdrop-filter: brightness(120%);
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
		filter: opacity(60%);
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
