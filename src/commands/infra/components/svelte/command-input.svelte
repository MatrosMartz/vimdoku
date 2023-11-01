<script lang="ts">
	import { executor, mediator } from '$cmd/infra/services'
	import { screenSvelte } from '$cmd/infra/stores'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'

	import { input } from './input.store'

	let form: HTMLFormElement

	function submitHandler() {
		mediator.dispatch(ScreenActions.Exit)
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
</form>

<style>
	form {
		display: flex;
		justify-content: center;
	}

	.command-input {
		box-sizing: content-box;
		display: flex;
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
</style>
