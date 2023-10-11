<script lang="ts">
	import TabIndex from './tab-index.svelte'
	import type { TabSchema } from './tab-interface'

	export let tabs: Array<Omit<TabSchema, 'panel'>>
	export let selected: string
</script>

<ul role="tablist">
	{#each tabs as { key, label }}
		{#if typeof label === 'string'}
			<TabIndex bind:selected {key}>
				{label}
			</TabIndex>
		{:else}
			<TabIndex bind:selected {key}>
				<svelte:component this={label} />
			</TabIndex>
		{/if}
	{/each}
</ul>

<style>
	ul {
		display: flex;
		list-style: none;
		box-shadow: 0 0 16px rgb(19 15 24 / 75%);
	}

	ul :global(li:last-of-type button) {
		border-top-right-radius: 8px;
	}
</style>
