<script lang="ts">
	import { writable } from 'svelte/store'

	import { createSelectedContext } from './tab.context'

	export let tabState: string

	const tabStore = writable(tabState)

	$: tabStore.set(tabState)

	createSelectedContext(tabStore)
</script>

<slot />
