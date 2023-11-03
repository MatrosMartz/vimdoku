<script lang="ts">
	import type { Readable } from 'svelte/store'

	import { createSelectedContext } from './tab.context'

	export let tabState: Readable<string>

	createSelectedContext(tabState)
</script>

<slot />
