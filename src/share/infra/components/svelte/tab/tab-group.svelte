<script lang="ts">
	import type { TabSchema } from './tab-interface'
	import TabList from './tab-list.svelte'

	export let tabs: TabSchema[]

	export let selected: string
</script>

<TabList tabs={tabs.map(({ label, key }) => ({ label, key }))} bind:selected />

{#each tabs as { panel, key }}
	<div id="panel{key}" aria-labelledby="tab{key}" role="tabpanel" aria-hidden={selected !== key}>
		<svelte:component this={panel} />
	</div>
{/each}

<style>
	div {
		padding: 2rem 2rem 1rem;
		overflow: hidden scroll;
	}

	div[aria-hidden='true'] {
		display: none;
	}
</style>
