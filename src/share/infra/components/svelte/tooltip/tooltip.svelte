<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let text: string
	export let id: string
	export let show = false

	let hidden = true

	$: if (show) hidden = false

	const dispatcher = createEventDispatcher<{ leave: null; over: null }>()

	/** Create over component event, mouse-over handler. */
	function overHandler() {
		if (show) dispatcher('over')
	}

	/** Create leave component event, mouse-leave handler. */
	function leaveHandler() {
		dispatcher('leave')
	}

	/**
	 * Close tooltip after hide animation end, animation-end handler.
	 * @param ev The animation event.
	 */
	function animationendHandler(ev: AnimationEvent): void
	function animationendHandler({ animationName }: AnimationEvent) {
		if (/tooltip-hide$/.test(animationName)) hidden = true
	}
</script>

<div
	{id}
	role="tooltip"
	class="tooltip"
	class:hidden
	class:show
	on:mouseover={overHandler}
	on:mouseleave={leaveHandler}
	on:focus={overHandler}
	on:focusout={leaveHandler}
	on:animationend={animationendHandler}
>
	<p>{text}</p>
</div>

<!-- 
	min 100% 5ch
 -->

<style>
	.tooltip {
		position: absolute;
		bottom: calc(100% + 0.5rem);
		left: 50%;
		z-index: 100;
		width: 100%;
		padding: 0.25rem 0.5rem;
		color: var(--primary-color);
		text-align: center;
		text-overflow: ellipsis;
		content: var(--reason);
		background-color: var(--tooltip-background);
		border: 1px solid var(--tooltip-border);
		border-radius: 8px;
		opacity: 0;
		transform: translateX(-50%);
		animation: tooltip-hide 250ms;
	}

	:global(.tooltip-overflow) .tooltip {
		width: 15ch;
	}

	p {
		width: max-content;
		max-width: 100%;
		text-align: initial;
		text-wrap: balance;
	}

	@keyframes tooltip-hide {
		from {
			opacity: 1;
		}
	}

	.tooltip.show {
		opacity: 1;
		animation: tooltip-show 250ms;
	}

	@keyframes tooltip-show {
		from {
			opacity: 0;
		}
	}

	.tooltip::after,
	.tooltip::before {
		position: absolute;
		inset: 100% 0 auto;
		width: 1.5rem;
		height: 0.8rem;
		margin-inline: auto;
		clip-path: polygon(0 0, 100% 0, 50% 100%);
		content: '';
		background-color: var(--tooltip-background);
	}

	.tooltip::before {
		top: calc(100% + 1px);
		width: 1.6rem;
		background-color: var(--tooltip-border);
	}

	.tooltip.hidden {
		display: none;
	}
</style>
