<script lang="ts">
	import { Dialog } from '~/share/infra/components/svelte/dialog'
	import { CommandInput, SuggestionsList } from '$cmd/infra/components/svelte'
	import { DialogKind } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	$: show = $screenState.dialog.kind === DialogKind.Cmd
</script>

<Dialog type="modal" {show}>
	<div role="search" class="command-dialog">
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
	}
</style>
