<script lang="ts">
	import '@fontsource/poppins/400.css'
	import '@fontsource/poppins/500.css'
	import '@fontsource/poppins/600.css'
	import '@fontsource/poppins/700.css'
	import '@fontsource/poppins/400-italic.css'
	import '@fontsource/poppins/500-italic.css'
	import '@fontsource/poppins/600-italic.css'
	import '@fontsource/poppins/700-italic.css'
	import '@fontsource-variable/jetbrains-mono'
	import '@fontsource-variable/jetbrains-mono/wght-italic.css'

	import { mediator } from '$cmd/infra/services'
	import { screenState } from '$cmd/infra/stores/svelte'
	import { DialogKinds, ScreenActions } from '$screen/domain/models'
	import { CommandDialog, PreferencesDialog, Screen, StatusBar } from '$screen/infra/components/svelte'

	import { Header } from './share/infra/components/svelte'

	function keydownHandler(ev: KeyboardEvent) {
		if (ev.key === ':' && screenState.data.dialog.kind !== DialogKinds.Cmd) {
			ev.preventDefault()
			mediator.dispatch(ScreenActions.OpenDialog, { kind: DialogKinds.Cmd })
		}
		if (ev.key === 'Escape') {
			if (screenState.data.dialog.kind !== DialogKinds.None) ev.preventDefault()
			mediator.dispatch(ScreenActions.Exit)
		}
	}
</script>

<Header />

<CommandDialog />
<PreferencesDialog />
<Screen />

<StatusBar />

<svelte:window on:keydown={keydownHandler} />
