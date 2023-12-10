<script lang="ts">
	import '@fontsource/poppins/100.css'
	import '@fontsource/poppins/200.css'
	import '@fontsource/poppins/300.css'
	import '@fontsource/poppins/400.css'
	import '@fontsource/poppins/500.css'
	import '@fontsource/poppins/600.css'
	import '@fontsource/poppins/700.css'
	import '@fontsource/poppins/100-italic.css'
	import '@fontsource/poppins/200-italic.css'
	import '@fontsource/poppins/300-italic.css'
	import '@fontsource/poppins/400-italic.css'
	import '@fontsource/poppins/500-italic.css'
	import '@fontsource/poppins/600-italic.css'
	import '@fontsource/poppins/700-italic.css'
	import '@fontsource-variable/jetbrains-mono'
	import '@fontsource-variable/jetbrains-mono/wght-italic.css'

	import { prefsState } from '$cmd/infra/stores'
	import { Schema } from '$pref/domain/models'
	import { CommandDialog, PreferencesDialog, Screen, StatusBar, WinDialog } from '$screen/infra/components/svelte'

	import { keydownHandler } from './keydown-handler'
	import { Header } from './share/infra/components/svelte'

	$: document.documentElement.lang = $prefsState.language
	$: if (
		$prefsState.colorSchema === Schema.DARK_MODE ||
		($prefsState.colorSchema === Schema.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches)
	)
		document.documentElement.classList.add('dark')
	else document.documentElement.classList.remove('dark')
</script>

<Header />

<CommandDialog />
<PreferencesDialog />
<WinDialog />
<Screen />

<StatusBar />

<svelte:window on:keydown={keydownHandler} />
