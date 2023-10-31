<script lang="ts">
	import { executor, mediator } from '$cmd/infra/services'
	import { ScreenActions } from '$screen/domain/models'

	function submitHandler({ currentTarget }: { currentTarget: HTMLFormElement }) {
		mediator.dispatch(ScreenActions.Exit)
		currentTarget.reset()
	}

	function inputHandler({ currentTarget }: { currentTarget: HTMLInputElement }) {
		executor.searchAutocomplete(currentTarget.value)
	}
</script>

<form method="dialog" on:submit|preventDefault={submitHandler}>
	<label class="command-input">
		<input type="text" on:input={inputHandler} />
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
