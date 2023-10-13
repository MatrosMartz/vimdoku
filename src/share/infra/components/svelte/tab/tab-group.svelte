<script lang="ts">
	import { createSelectedContext } from './tab.context'

	export let selected: string

	createSelectedContext(selected, value => (selected = value))
</script>

<slot />
