<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { tooltip } from '~/share/infra/components/svelte/tooltip'
	import { mediator } from '$cmd/infra/services'
	import { modesState, posState, screenState } from '$cmd/infra/stores/svelte'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'

	$: tooltipProps = { id: 'describe-pos', text: `Row ${$posState.y}, Col ${$posState.x}` }

	function cmdHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd })
	}
	function prefHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.PrefEdit })
	}

	function modeHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.InLn, opts: { type: 'modes' } })
	}
</script>

<footer class="monospace">
	<section>
		<button class="icon dialog" on:click={cmdHandler}><Icon id="cmd" /></button>
		<button class="icon mode" on:click={modeHandler}><span>{$modesState.toUpperCase()}</span></button>
		<button class="icon error">
			<Icon id="errors" />
			<span>0</span>
		</button>
	</section>
	<section>
		<div class="position">
			<p use:tooltip={tooltipProps}>
				{$posState.y},{$posState.x}
			</p>
		</div>
		<p class="timer">00:00:00</p>
		<p class="screen">{$screenState.main}</p>
		<button class="icon dialog" on:click={prefHandler}><Icon id="pref" /></button>
	</section>
</footer>

<style>
	footer {
		position: fixed;
		inset: auto 0 0;
		z-index: 9999;
		display: flex;
		justify-content: space-between;
		width: 100%;
		background-color: rgb(12 8 13);
	}

	section {
		display: flex;
	}

	p {
		display: inline-flex;
		align-items: center;
		height: 100%;
	}

	.icon {
		--border-color: transparent;

		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		height: 44px;
		font-family: inherit;
		font-size: inherit;
		color: inherit;
		background-color: inherit;
		border: 2px solid var(--border-color);
	}

	p,
	.icon:has(span) {
		padding-inline: 0.5rem;
	}

	.icon:hover {
		filter: brightness(125%);
		backdrop-filter: brightness(125%);
	}

	.icon:focus {
		--border-color: var(--focus-border);
	}

	.error {
		color: var(--error-color);
	}

	.icon.dialog {
		background-color: var(--alternative-border);
	}

	.mode {
		color: var(--value-color);
	}

	.mode::before,
	.mode::after {
		content: '--';
	}

	.position {
		position: relative;
	}
</style>
