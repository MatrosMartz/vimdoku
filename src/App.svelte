<script lang="ts">
	import '@fontsource-variable/nunito/wght.css'
	import '@fontsource-variable/nunito/wght-italic.css'
	import '@fontsource-variable/red-hat-mono/wght.css'
	import '@fontsource-variable/red-hat-mono/wght-italic.css'

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
