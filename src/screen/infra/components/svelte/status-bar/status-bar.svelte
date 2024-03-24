<script lang="ts">
	import { onDestroy } from 'svelte'

	import { Icon } from '~/share/infra/components/svelte'
	import { tooltip } from '~/share/infra/components/svelte/tooltip'
	import { posState } from '~/share/infra/stores/svelte'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { errorsState, savedState, timerState } from '$sudoku/infra/stores/svelte'

	import SelectMode from './select-mode.svelte'

	let errorsShake = false
	let animationTimeoutId: ReturnType<typeof setTimeout> | null = null

	$: tooltipProps = {
		id: 'describe-pos',
		text: $i18nState.ns('share').statusBar_posDesc('Row {|row|}, Col {|col|}.', {
			row: String($posState.y + 1),
			col: String($posState.x + 1),
		}),
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
			<span class="portrait-hidden"
				>{$i18nState.ns('share')[`sync_${$savedState}`]($savedState ? 'Saved' : 'Unsaved')}</span
			>
		</button>
		<button class="status-icon error" class:shake={errorsShake}>
			<Icon id="errors" />
			<span>{$errorsState}</span>
		</button>
	</section>
	<section class="item-separation">
		<div class="position tooltip-overflow">
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

	@media (width >= 480px) {
		.status-bar {
			width: 80%;
			max-width: 32rem;
			margin: 0 auto 0.8rem;
			border-radius: 16px;
		}
	}

	.error {
		color: rgb(var(--error-color));
	}

	.sync {
		color: rgb(var(--unverified-color));
	}

	:global(:not(.motion-reduce)) .shake {
		animation: shake 300ms infinite;
	}

	.position {
		position: relative;
	}
</style>
