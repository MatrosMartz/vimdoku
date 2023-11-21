<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { tooltip } from '~/share/infra/components/svelte/tooltip'
	import { mediator } from '$cmd/infra/services'
	import { posState, screenState } from '$cmd/infra/stores/svelte'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'

	import SelectMode from './select-mode.svelte'

	$: tooltipProps = { id: 'describe-pos', text: `Row ${$posState.y}, Col ${$posState.x}` }

	function cmdHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd })
	}
	function prefHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.PrefEdit })
	}
</script>

<footer class="status-bar monospace">
	<section>
		<button class="icon dialog" on:click={cmdHandler}><Icon id="cmd" /></button>
		<SelectMode />
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
	.status-bar {
		position: fixed;
		inset: auto 0 0;
		z-index: 9999;
		display: flex;
		justify-content: space-between;
		width: 100%;
		background-color: var(--status-bar-background);
	}

	section {
		display: flex;
	}

	p {
		display: inline-flex;
		align-items: center;
		height: 100%;
	}

	.error {
		color: var(--error-color);
	}

	.position {
		position: relative;
	}
</style>
