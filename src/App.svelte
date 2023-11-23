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

	import { CommandDialog, PreferencesDialog, Screen, StatusBar } from '$screen/infra/components/svelte'

	import { keydownHandler } from './keydown-handler'
	import { Header } from './share/infra/components/svelte'
</script>

<Header />

<CommandDialog />
<PreferencesDialog />
<Screen />

<StatusBar />

<svelte:window on:keydown={keydownHandler} />
