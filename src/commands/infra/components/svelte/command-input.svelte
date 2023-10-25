<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { ScreenActions } from '$screen/domain/models'

	function submitHandler({ currentTarget }: { currentTarget: HTMLFormElement }) {
		mediator.dispatch(ScreenActions.Exit)
		currentTarget.reset()
	}
</script>

<form method="dialog" on:submit|preventDefault={submitHandler}>
	<label class="command">
		<input type="text" />
	</label>
</form>

<style>
	form {
		display: flex;
		justify-content: center;
		padding: 1rem;
	}

	.command {
		box-sizing: content-box;
		display: flex;
		align-items: center;
		overflow: hidden;
		font: 1rem monospace;
	}

	.command::before {
		height: 1lh;
		font-size: inherit;
		content: ':';
	}

	input {
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
