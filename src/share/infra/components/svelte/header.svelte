<script lang="ts">
	import { mediator } from '$cmd/infra/services'
	import { DialogKinds, PrefDialogTypes, ScreenActions } from '$screen/domain/models'

	function clickHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Pref, opts: { type: PrefDialogTypes.edit } })
	}
</script>

<header>
	<h1>Vimdoku</h1>
	<button on:click={clickHandler}>open settings</button>
</header>

<style>
	h1 {
		font-weight: 700;
	}
</style>
