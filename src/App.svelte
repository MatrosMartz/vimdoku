<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { CmdDialogTypes, DialogKinds, ScreenActions } from '$screen/domain/models'
	import { CommandDialog, PreferencesDialog } from '$screen/infra/components/svelte'

	function keydownHandler(ev: KeyboardEvent) {
		if (ev.key === ':' && mediator.get('screen').dialog.kind !== DialogKinds.Cmd) {
			ev.preventDefault()
			mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd, opts: { type: CmdDialogTypes.Full } })
		}
		if (ev.key === 'Escape') {
			if (mediator.get('screen').dialog.kind !== DialogKinds.None) ev.preventDefault()
			mediator.dispatch(ScreenActions.Exit)
		}
	}
</script>

<CommandDialog />
<PreferencesDialog />

<svelte:window on:keydown={keydownHandler} />
