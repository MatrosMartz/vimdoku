<script lang="ts">
	import { onDestroy } from 'svelte'

	import { Icon } from '~/share/infra/components/svelte'
	import { tooltip } from '~/share/infra/components/svelte/tooltip'
	import { med } from '$cmd/infra/services'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'
	import { errorsState, posState, savedState, timerState } from '$sudoku/infra/stores/svelte'

	import SelectMode from './select-mode.svelte'

	$: tooltipProps = {
		id: 'describe-pos',
		text: `${$i18nState.get('statusBar-posDesc-head', 'Row')} ${$posState.y + 1}${$i18nState.get(
			'statusBar-posDesc-body',
			', Col'
		)} ${$posState.x + 1}${$i18nState.get('statusBar-posDesc-tail', '.')}`,
	}

	let errorsShake = false
	let animationTimeoutId: ReturnType<typeof setTimeout> | null = null

	const errorsUnsubscribe = errorsState.subscribe(() => {
		if (animationTimeoutId != null) clearTimeout(animationTimeoutId)
		errorsShake = true
		animationTimeoutId = setTimeout(() => (errorsShake = false), 500)
	})

	function cmdHandler() {
		med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd })
	}
	function prefHandler() {
		med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.PrefEdit })
	}

	onDestroy(() => {
		errorsUnsubscribe()
	})
</script>

<footer class="status-bar monospace">
	<section>
		<button class="icon dialog" on:click={cmdHandler}><Icon id="cmd" /></button>
		<SelectMode />
		<button class="icon sync">
			<Icon id="sync" />
			<span>{$i18nState.get(`sync-${$savedState}`, $savedState ? 'Saved' : 'Unsaved')}</span>
		</button>
		<button class="icon error" class:shake={errorsShake}>
			<Icon id="errors" />
			<span>{$errorsState}</span>
		</button>
	</section>
	<section>
		<div class="position">
			<p use:tooltip={tooltipProps}>
				{$posState.y + 1},{$posState.x + 1}
			</p>
		</div>
		<p class="timer">{$timerState}</p>
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

	.sync {
		color: var(--unverified-color);
	}

	:global(:not(.motion-reduce)) .shake {
		animation: shake 300ms infinite;
	}

	@keyframes shake {
		0% {
			transform: rotate(0);
		}

		25% {
			transform: rotate(10deg);
		}

		50% {
			transform: rotate(0);
		}

		75% {
			transform: rotate(-10deg);
		}

		100% {
			transform: rotate(0);
		}
	}

	.position {
		position: relative;
	}
</style>
