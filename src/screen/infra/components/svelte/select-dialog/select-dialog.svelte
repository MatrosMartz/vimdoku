<script>
	import { derived } from 'svelte/store'

	import { Dialog } from '~/share/infra/components/svelte'
	import { DialogClose } from '~/share/infra/components/svelte/dialog'
	import { DialogKinds } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	import SelectGame from './select-game.svelte'

	const dialogState = derived(screenState, ({ dialog }) => dialog.kind === DialogKinds.sel)
</script>

<Dialog type="modal" {dialogState}>
	<div class="content">
		<header>
			<DialogClose />
		</header>
		<SelectGame />
	</div>
</Dialog>

<style>
	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 60vmin;
		min-width: max-content;
		height: 60vmin;
		min-height: max-content;
		padding: 48px 1rem;
		overflow: hidden;
		background-color: var(--dialog-background);
		border-radius: 8px;
	}

	header {
		position: absolute;
		top: 0;
		display: flex;
		align-items: end;
		width: 100%;
		height: 44px;
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
	}
</style>
