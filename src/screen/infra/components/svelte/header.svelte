<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { DialogKinds, type DialogsWithoutOpts, MainScreenKinds, ScreenActions } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	function openDialog(kind: DialogsWithoutOpts) {
		return () => med.dispatch(ScreenActions.OpenDialog, { kind })
	}

	$: inGame = $screenState.main === MainScreenKinds.Game
</script>

<header class="status-bar monospace">
	<section>
		<button class="status-icon icon-dialog" on:click={openDialog(DialogKinds.Cmd)}><Icon id="cmd" /></button>
	</section>
	<section>
		<h1>Vimdoku</h1>
	</section>
	<section>
		<button class="status-icon icon-dialog" on:click={openDialog(inGame ? DialogKinds.Pause : DialogKinds.PrefEdit)}
			><Icon id={inGame ? 'pause' : 'pref'} /></button
		>
	</section>
</header>

<style>
	.status-bar {
		top: 0;
		margin-bottom: 0.5rem;
	}
</style>
