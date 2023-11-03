<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { DialogKinds, PrefDialogTypes, ScreenActions } from '$screen/domain/models'

	import { Button, ButtonMenu } from './buttons'

	function clickHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Pref, opts: { type: PrefDialogTypes.edit } })
	}
</script>

<header>
	<h1>Vimdoku</h1>
	<ButtonMenu><Button on:click={clickHandler}>open settings</Button></ButtonMenu>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		padding-inline: 4px;
	}

	h1 {
		font-weight: 600;
	}
</style>
