<script lang="ts">
	import { Dialog } from '~/share/infra/components/svelte/dialog'
	import { CommandInput, SuggestionsList } from '$cmd/infra/components/svelte'
	import { Modal } from '$page/domain/entities'
	import { pageState } from '$page/infra/stores/svelte'
</script>

<Dialog type="modal" show={Modal.Cmd.is($pageState.modal)}>
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
		box-shadow: 0 6px 20px rgb(var(--card-shadow) / 75%);
	}
</style>
