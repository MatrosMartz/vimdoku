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

	import { i18nState } from '$i18n/infra/stores/svelte'
	import { Accessibility, ColorSchema } from '$pref/domain/models'
	import { prefsState } from '$pref/infra/stores/svelte'
	import { Header, Modals, Screen, StatusBar } from '$screen/infra/components/svelte'

	import { keydownHandler } from './keydown-handler'
	import { toggleClass } from './toggle-class'

	$: document.documentElement.lang = $i18nState.lang
	$: toggleClass(
		$prefsState.colorSchema,
		{ main: ColorSchema.DARK_MODE, default: ColorSchema.SYSTEM, media: '(prefers-color-scheme: dark)' },
		'dark'
	)
	$: toggleClass(
		$prefsState.motionReduce,
		{ main: Accessibility.LESS, default: Accessibility.SYSTEM, media: '(prefers-reduced-motion)' },
		'motion-reduce'
	)
</script>

<Header />

<Modals />
<Screen />

<StatusBar />

<svelte:window on:keydown={keydownHandler} />
