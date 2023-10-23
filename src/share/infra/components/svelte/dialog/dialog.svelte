<script lang="ts">
	import type { Readable } from 'svelte/store'

	export let dialogState: Readable<boolean>

	let dialog: HTMLDialogElement

	$: hide = !$dialogState

	$: if ($dialogState) dialog.showModal()

	function AnimationendHandler({ animationName }: AnimationEvent) {
		if (/backdrop-hide$/.test(animationName)) dialog.close()
	}
</script>

<dialog class="vim-dialog" class:hide bind:this={dialog} on:animationend={AnimationendHandler}>
	<div class="content">
		<slot />
	</div>
</dialog>

<style>
	dialog {
		inset: 0;
		margin: auto;
		color: inherit;
		background: none;
		border: none;
	}

	dialog[open] {
		animation: show 500ms ease-in-out;
	}

	@keyframes show {
		from {
			opacity: 0;
			transform: translateY(-50%);
		}
	}

	dialog.hide {
		animation: hide 500ms ease-in-out;
	}

	@keyframes hide {
		to {
			opacity: 0;
			transform: translateY(-50%);
		}
	}

	dialog::backdrop {
		background-color: rgb(61 25 71 / 10%);
		backdrop-filter: blur(15px);
	}

	dialog[open]::backdrop {
		animation: backdrop-show 500ms ease-in-out;
	}

	@keyframes backdrop-show {
		from {
			opacity: 0;
		}
	}

	dialog.hide::backdrop {
		animation: backdrop-hide 500ms ease-in-out;
	}

	@keyframes backdrop-hide {
		to {
			opacity: 0;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		width: 80vw;
		max-width: 600px;
		height: 90vh;
		overflow: hidden;
		background-color: hsl(280deg 17% 14%);
		border-radius: 8px;
	}
</style>
