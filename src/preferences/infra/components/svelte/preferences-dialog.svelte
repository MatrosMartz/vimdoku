<script lang="ts">
	import { TabGroup } from '~/share/infra/components/svelte/tab'
	import type { TabSchema } from '~/share/infra/components/svelte/tab/tab-interface'

	import PreferencesDisplay from './preferences-display.svelte'
	import PreferencesForm from './preferences-form.svelte'

	const tabs: TabSchema[] = [
		{ key: 'all', label: 'Show', panel: PreferencesDisplay },
		{ key: 'edit', label: 'Edit', panel: PreferencesForm },
	]
</script>

<dialog open>
	<TabGroup {tabs} selected="all" />
</dialog>

<style>
	dialog {
		inset: 0;
		display: flex;
		flex-direction: column;
		width: 80vw;
		max-width: 600px;
		height: 90vh;
		margin: auto;
		overflow: hidden;
		color: inherit;
		background-color: hsl(280deg 17% 14%);
		border: none;
		border-radius: 8px;
	}

	dialog::backdrop {
		background-color: brown;
	}
</style>
