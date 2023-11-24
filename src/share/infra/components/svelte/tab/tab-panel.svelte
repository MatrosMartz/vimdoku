<script lang="ts">
	import { getSelectedContext } from './tab.context'

	export let key: string

	const selected = getSelectedContext()
</script>

<div id="panel{key}" role="tabpanel" aria-labelledby="tab{key}" aria-hidden={$selected !== key}>
	<slot />
</div>

<style>
	div {
		padding: 2rem 2rem 1rem;
		overflow: hidden scroll;
	}

	div[aria-hidden='true'] {
		display: none;
	}
</style>
