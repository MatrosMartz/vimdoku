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

	import { Accessibility, Schema } from '$pref/domain/models'
	import { prefsState } from '$pref/infra/stores/svelte'
	import {
		CommandDialog,
		Header,
		PreferencesDialog,
		Screen,
		StatusBar,
		WinDialog,
	} from '$screen/infra/components/svelte'

	import { keydownHandler } from './keydown-handler'
	import { toggleClass } from './toggleClass'

	$: document.documentElement.lang = $prefsState.language
	$: toggleClass(
		$prefsState.colorSchema,
		{ main: Schema.DARK_MODE, default: Schema.SYSTEM, media: '(prefers-color-scheme: dark)' },
		'dark'
	)
	$: toggleClass(
		$prefsState.motionReduce,
		{ main: Accessibility.LESS, default: Accessibility.SYSTEM, media: '(prefers-reduced-motion)' },
		'motion-reduce'
	)
</script>

<Header />

<CommandDialog />
<PreferencesDialog />
<WinDialog />
<Screen />

<StatusBar />

<svelte:window on:keydown={keydownHandler} />
