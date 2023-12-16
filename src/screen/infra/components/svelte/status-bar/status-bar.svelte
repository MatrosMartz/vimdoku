<script lang="ts">
	import { onDestroy } from 'svelte'

	import { Icon } from '~/share/infra/components/svelte'
	import { tooltip } from '~/share/infra/components/svelte/tooltip'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { errorsState, posState, savedState, timerState } from '$sudoku/infra/stores/svelte'

	import SelectMode from './select-mode.svelte'

	let errorsShake = false
	let animationTimeoutId: ReturnType<typeof setTimeout> | null = null

	$: tooltipProps = {
		id: 'describe-pos',
		text: `${$i18nState.get('statusBar-posDesc-head', 'Row')} ${$posState.y + 1}${$i18nState.get(
			'statusBar-posDesc-body',
			', Col'
		)} ${$posState.x + 1}${$i18nState.get('statusBar-posDesc-tail', '.')}`,
	}

	const errorsUnsubscribe = errorsState.subscribe(() => {
		if (animationTimeoutId != null) clearTimeout(animationTimeoutId)
		errorsShake = true
		animationTimeoutId = setTimeout(() => (errorsShake = false), 500)
	})

	onDestroy(() => {
		errorsUnsubscribe()
	})
</script>

<footer class="status-bar monospace">
	<section>
		<SelectMode />
		<button class="status-icon sync">
			<Icon id="sync" />
			<span class="portrait-hidden">{$i18nState.get(`sync-${$savedState}`, $savedState ? 'Saved' : 'Unsaved')}</span>
		</button>
		<button class="status-icon error" class:shake={errorsShake}>
			<Icon id="errors" />
			<span>{$errorsState}</span>
		</button>
	</section>
	<section class="item-separation">
		<div class="position">
			<p use:tooltip={tooltipProps}>
				{$posState.y + 1},{$posState.x + 1}
			</p>
		</div>
		<p class="timer">{$timerState}</p>
	</section>
</footer>

<style>
	.status-bar {
		position: fixed;
		bottom: 0;
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

	.position {
		position: relative;
	}
</style>
