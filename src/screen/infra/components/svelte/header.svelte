<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { med } from '$cmd/infra/services'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'

	function cmdHandler() {
		med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd })
	}

	function prefHandler() {
		med.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.PrefEdit })
	}
</script>

<header class="status-bar monospace">
	<section>
		<button class="status-icon icon-dialog" on:click={cmdHandler}><Icon id="cmd" /></button>
	</section>
	<section>
		<h1>Vimdoku</h1>
	</section>
	<section>
		<button class="status-icon icon-dialog" on:click={prefHandler}><Icon id="pref" /></button>
	</section>
</header>

<style>
	.status-bar {
		top: 0;
		margin-bottom: 0.5rem;
	}
</style>
