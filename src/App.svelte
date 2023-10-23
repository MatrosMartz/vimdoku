<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { CmdDialogTypes, DialogKinds, ScreenActions } from '$screen/domain/models'
	import { CommandDialog, PreferencesDialog } from '$screen/infra/components/svelte'

	function keydownHandler(ev: KeyboardEvent) {
		const isVimDialog = ev.target instanceof HTMLElement && ev.target.classList.contains('vim-dialog')
		if (ev.key === 'Escape' && isVimDialog) ev.preventDefault()

		if (ev.key === ':')
			mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd, opts: { type: CmdDialogTypes.Full } })
		if (ev.key === 'Escape') mediator.dispatch(ScreenActions.Exit)
	}
</script>

<CommandDialog />
<PreferencesDialog />

<svelte:window on:keydown={keydownHandler} />
