<script lang="ts">
	import { DialogClose } from '~/share/infra/components/svelte'
	import { SCREEN_ACTIONS } from '$cmd/domain/services'
	import { exec, med } from '$cmd/infra/services'
	import { Modal } from '$screen/domain/entities'
	import { screenState } from '$screen/infra/stores/svelte'

	import { input } from './input.store'

	let form: HTMLFormElement

	/** Handles the submission of the form. */
	function submitHandler() {
		med.dispatch(SCREEN_ACTIONS.close)
		if ($input != null) exec.run($input.value)
	}

	/**
	 * Handle the writing in the input.
	 * @param ev The input event.
	 */
	function inputHandler({ currentTarget }: Event & { currentTarget: HTMLInputElement }) {
		exec.searchAutocomplete(currentTarget.value)
	}

	$: if (Modal.isCmd($screenState.modal)) form.reset()
</script>

<form bind:this={form} class="command-search" method="dialog" on:submit|preventDefault={submitHandler}>
	<label class="command-input">
		<input bind:this={$input} type="text" on:input={inputHandler} />
	</label>
	<span class="close">
		<DialogClose />
	</span>
</form>

<style>
	.command-search {
		display: flex;
		gap: 1rem;
		justify-content: center;
		padding: 0.4rem;
		background-color: rgb(var(--dialog-header) / 70%);
		border-radius: 16px;
	}

	.command-input {
		display: flex;
		flex-shrink: 20;
		align-items: center;
		width: 100%;
		height: var(--icon-size);
		overflow: hidden;
		font: 1rem monospace;
	}

	.command-input::before {
		height: 1lh;
		font-size: inherit;
		content: ':';
	}

	input {
		width: 100%;
		height: 1lh;
		overflow: hidden;
		font: inherit;
		color: inherit;
		caret-color: currentcolor;
		resize: none;
		background-color: transparent;
		border: none;
		outline: none;
	}

	input::selection {
		background-color: rgb(var(--input-border));
	}

	.close {
		height: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border-radius: 8px;
	}
</style>
