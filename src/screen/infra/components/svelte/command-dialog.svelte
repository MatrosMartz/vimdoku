<script lang="ts">
	import { derived } from 'svelte/store'

	import { Dialog } from '~/share/infra/components/svelte/dialog'
	import { CommandInput, SuggestionsList } from '$cmd/infra/components/svelte'
	import { DialogKinds } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	const dialogState = derived(screenState, ({ dialog }) => dialog.kind === DialogKinds.Cmd)
</script>

<Dialog type="modal" {dialogState}>
	<div class="command-dialog">
		<CommandInput />
		<SuggestionsList />
	</div>
</Dialog>

<style>
	.command-dialog {
		box-sizing: content-box;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 80vw;
		max-width: 60ch;
		height: 80vh;
		padding: 1rem;
	}
</style>
