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

<header class="status-bar vimdoku-header monospace">
	<section>
		<button class="status-icon icon-dialog" on:click={openDialog(DialogKind.Cmd)}><Icon id="cmd" /></button>
	</section>
	<section class="vimdoku-title">
		<h1>Vimdoku</h1>
	</section>
	<section>
		<button class="status-icon icon-dialog" on:click={openDialog(inGame ? DialogKind.Pause : DialogKind.PrefEdit)}
			><Icon id={inGame ? 'pause' : 'pref'} /></button
		>
	</section>
</header>

<style>
	.vimdoku-header {
		top: 0;
		margin: 0 auto 1.5rem;
		background-color: rgb(var(--status-bar-background) / 50%);
		backdrop-filter: blur(3px);
	}

	.icon-dialog {
		margin: 0.4rem;
	}

	.vimdoku-title {
		height: calc(var(--icon-size) + 0.8rem);
		padding: 0 2.5rem;
		border-bottom: 3px solid rgb(var(--alternative-border));
	}

	@media (width >= 480px) {
		.vimdoku-header {
			width: 85%;
			max-width: 40rem;
			border-radius: 0 0 16px 16px;
		}
	}

	@media (width >= 768px) {
		.vimdoku-header {
			margin-bottom: 2.5rem;
		}
	}
</style>
