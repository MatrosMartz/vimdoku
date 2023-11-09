<script lang="ts">
	import { DialogClose } from '~/share/infra/components/svelte'
	import { executor } from '$cmd/infra/services'
	import { screenSvelte } from '$cmd/infra/stores'
	import { DialogKinds } from '$screen/domain/models'

	import { input } from './input.store'

	let form: HTMLFormElement

	function submitHandler() {
		if ($input != null) executor.exec($input.value)
	}

	function inputHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		executor.searchAutocomplete(currentTarget.value)
	}

	$: if ($screenSvelte.dialog.kind === DialogKinds.Cmd) form.reset()
</script>

<form method="dialog" on:submit|preventDefault={submitHandler} bind:this={form}>
	<label class="command-input">
		<input type="text" on:input={inputHandler} bind:this={$input} />
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
