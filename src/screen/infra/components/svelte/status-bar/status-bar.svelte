<script lang="ts">
	import { Icon } from '~/share/infra/components/svelte'
	import { mediator } from '$cmd/infra/services'
	import { modesSvelte, screenSvelte } from '$cmd/infra/stores'
	import { CmdDialogTypes, DialogKinds, PrefDialogTypes, ScreenActions } from '$screen/domain/models'

	function cmdHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd, opts: { type: CmdDialogTypes.Full } })
	}
	function prefHandler() {
		mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Pref, opts: { type: PrefDialogTypes.edit } })
	}
</script>

<footer class="monospace">
	<section>
		<button class="icon dialog" on:click={cmdHandler}><Icon id="cmd" /></button>
		<p class="mode">{$modesSvelte.toUpperCase()}</p>
		<button class="icon">
			<Icon id="errors" />
			<span>0</span>
		</button>
	</section>
	<section>
		<p class="timer">00:00:00</p>
		<p class="screen">{$screenSvelte.main}</p>
		<button class="icon dialog" on:click={prefHandler}><Icon id="pref" /></button>
	</section>
</footer>

<style>
	footer {
		position: fixed;
		inset: auto 0 0;
		z-index: 9999;
		display: flex;
		justify-content: space-between;
		width: 100%;
		background-color: rgb(21 19 25);
	}

	section {
		display: flex;
	}

	p {
		display: inline-flex;
		align-items: center;
		height: 100%;
	}

	.icon {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		height: 44px;
		font-family: inherit;
		font-size: inherit;
		color: inherit;
		background-color: var(--input-background);
		border: none;
	}

	p,
	.icon:has(span) {
		padding-inline: 0.5rem;
	}

	.icon:focus,
	.icon:hover {
		filter: brightness(125%);
		outline: none;
	}

	.icon.dialog {
		background-color: rgb(39 31 63);
	}

	.mode {
		background-color: var(--input-border);
	}

	.mode::before {
		padding-right: 1ch;
		content: '--';
	}

	.mode::after {
		padding-left: 1ch;
		content: '--';
	}
</style>
