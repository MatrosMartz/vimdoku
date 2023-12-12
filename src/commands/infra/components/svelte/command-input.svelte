<script lang="ts">
	import { DialogClose } from '~/share/infra/components/svelte'
	import { exec } from '$cmd/infra/services'
	import { DialogKinds } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	import { input } from './input.store'

	let form: HTMLFormElement

	function submitHandler() {
		if ($input != null) exec.run($input.value)
	}

	function inputHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		exec.searchAutocomplete(currentTarget.value)
	}

	$: if ($screenState.dialog.kind === DialogKinds.Cmd) form.reset()
</script>

<form bind:this={form} method="dialog" on:submit|preventDefault={submitHandler}>
	<label class="command-input">
		<input bind:this={$input} type="text" on:input={inputHandler} />
	</label>
	<span class="close">
		<DialogClose />
	</span>
</form>

<style>
	form {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.command-input {
		box-sizing: content-box;
		display: flex;
		flex-shrink: 20;
		align-items: center;
		width: 100%;
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
		background-color: var(--input-border);
	}

	.close {
		height: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border-radius: 8px;
	}
</style>
