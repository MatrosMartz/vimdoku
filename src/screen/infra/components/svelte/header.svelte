<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { DialogKind, type DialogsWithoutOpts, MainScreenKind, ScreenAction } from '$screen/domain/models'
	import { screenState } from '$screen/infra/stores/svelte'

	/**
	 * Creates a function which opens a dialogue of the kind defined.
	 * @param kind The dialog kind.
	 * @returns The click handler which opens a dialogue.
	 */
	function openDialog(kind: DialogsWithoutOpts): () => void {
		return () => med.dispatch(ScreenAction.OpenDialog, { kind })
	}

	$: inGame = $screenState.main === MainScreenKind.Game
</script>

<header class="status-bar monospace">
	<section>
		<button class="status-icon icon-dialog" on:click={openDialog(DialogKind.Cmd)}><Icon id="cmd" /></button>
	</section>
	<section>
		<h1>Vimdoku</h1>
	</section>
	<section>
		<button class="status-icon icon-dialog" on:click={openDialog(inGame ? DialogKind.Pause : DialogKind.PrefEdit)}
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
