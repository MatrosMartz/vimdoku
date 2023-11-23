<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { tooltip, type TooltipProps } from '~/share/infra/components/svelte/tooltip'
	import { mediator } from '$cmd/infra/services'
	import { modeState, screenState } from '$cmd/infra/stores/svelte'
	import { DialogKinds, MainScreenKinds, ScreenActions } from '$screen/domain/models'
	import { ModeKinds, SudokuActions } from '$sudoku/domain/models'

	$: disabled = $screenState.main !== MainScreenKinds.Game

	$: open = $screenState.dialog.kind === DialogKinds.InLn && $screenState.dialog.opts.type === 'modes'

	let timeoutId: ReturnType<typeof setTimeout> | null = null

	$: if (disabled) mediator.dispatch(ScreenActions.Exit)

	const tooltipProps: TooltipProps = {
		id: 'disabled-mode-reason',
		text: 'The insertion mode can only be changed on the game screen.',
	}

	function toggleHandler() {
		if (disabled || open) mediator.dispatch(ScreenActions.Exit)
		else mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.InLn, opts: { type: 'modes' } })
	}

	function modeHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		const mode = currentTarget.value as ModeKinds

		mediator.dispatch(SudokuActions.ChangeMode, { mode })
	}

	function focusHandler() {
		if (timeoutId != null) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
	}

	function focusoutHandler() {
		timeoutId = setTimeout(() => {
			open = false
		}, 150)
	}
</script>

<div class="mode-accordion" class:open>
	<button
		class="icon mode"
		aria-disabled={disabled}
		on:focus={focusHandler}
		on:focusout={focusoutHandler}
		on:click={toggleHandler}
		use:tooltip={disabled ? tooltipProps : null}>{$modeState.toUpperCase()}</button
	>
	<form class="mode-selector" method="get">
		{#each Object.values(ModeKinds) as mode (mode)}
			<input
				type="radio"
				name="mode"
				id="mode-{mode}"
				value={mode}
				tabindex={open ? 0 : -1}
				checked={mode === $modeState}
				on:focus={focusHandler}
				on:focusout={focusoutHandler}
				on:change={modeHandler}
			/>
			<label for="mode-{mode}"><span>{mode.toUpperCase()}</span><Icon id="check" /></label>
		{/each}
	</form>
</div>

<style>
	.mode-accordion {
		position: relative;
		height: 44px;
		color: var(--value-color);
	}

	.mode-selector {
		position: relative;
		bottom: 400%;
		z-index: 0;
		display: grid;
		grid-template-columns: 1fr;
		overflow: hidden;
		background-color: var(--status-bar-background);
		border: 1px solid rgb(31 11 59);
		border-bottom: none;
		border-radius: 8px 8px 0 0;
		transition: transform 500ms;
		transform: translateY(200%);
	}

	.mode-accordion.open .mode-selector {
		transform: translateY(0);
	}

	input {
		appearance: none;
	}

	label {
		display: grid;
		gap: 0.5rem;
		align-items: center;
		justify-items: flex-start;
		width: 100%;
		height: 44px;
		padding-inline: 0.5rem;
		opacity: 0.6;
	}

	input:hover + label {
		filter: brightness(120%);
		backdrop-filter: brightness(120%);
	}

	input:focus + label {
		text-decoration: underline;
		opacity: 1;
	}

	input + label :global(svg) {
		display: none;
		color: transparent;
	}

	input:checked + label :global(svg) {
		color: var(--input-border);
	}

	input:focus + label :global(svg) {
		color: var(--key-color);
	}

	label span {
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
		.mode-selector {
			grid-template-columns: 1fr auto;
		}

		label {
			grid-template-columns: subgrid;
			grid-column: 1 / 3;
		}

		input + label :global(svg) {
			display: initial;
		}

		.mode::before,
		.mode::after {
			display: contents;
			content: '--';
		}
	}
</style>
