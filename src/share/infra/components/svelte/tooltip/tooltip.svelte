<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let text: string
	export let id: string
	export let show = false

	let hidden = true

	$: if (show) hidden = false

	const dispatcher = createEventDispatcher<{ leave: null; over: null }>()

	function overHandler() {
		if (show) dispatcher('over')
	}

	function leaveHandler() {
		dispatcher('leave')
	}

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
	{text}
</div>

<style>
	.tooltip {
		position: absolute;
		bottom: calc(100% + 0.5rem);
		left: 50%;
		width: 20ch;
		max-width: 45ch;
		padding: 0.5rem 1rem;
		color: var(--primary-color);
		text-align: center;
		text-overflow: ellipsis;
		content: var(--reason);
		background-color: rgb(6 0 15);
		border: 1px solid rgb(31 11 59);
		border-radius: 8px;
		opacity: 0;
		transform: translateX(-50%);
		animation: tooltip-hide 250ms;
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
		background-color: rgb(6 0 15);
	}

	.tooltip::before {
		top: calc(100% + 1px);
		width: 1.6rem;
		background-color: rgb(31 11 59);
	}

	.tooltip.hidden {
		display: none;
	}
</style>
