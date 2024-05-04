<script lang="ts">
	import '@fontsource-variable/nunito/wght.css'
	import '@fontsource-variable/nunito/wght-italic.css'
	import '@fontsource-variable/red-hat-mono/wght.css'
	import '@fontsource-variable/red-hat-mono/wght-italic.css'

	import { onDestroy, onMount } from 'svelte'

	import { med } from '$cmd/infra/services'
	import { IDLE_LANG } from '$i18n/domain/const'
	import { i18nState } from '$i18n/infra/stores/svelte'
	import { Header, Modals, Screen, StatusBar } from '$page/infra/components/svelte'
	import { Accessibility, ColorSchema } from '$pref/domain/models'
	import { prefsState } from '$pref/infra/stores/svelte'

	import { keydownHandler } from './keydown-handler'
	import { toggleClass } from './toggle-class'

	$: document.documentElement.lang = $i18nState.lang ?? IDLE_LANG
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

	onMount(async () => await med.load())

	onDestroy(async () => await med.unload())
</script>

<Header />

<Modals />
<Screen />

<StatusBar />

<svelte:window on:keydown={keydownHandler} />
