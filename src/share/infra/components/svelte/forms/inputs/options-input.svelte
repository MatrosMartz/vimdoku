<script generics="T extends string" lang="ts">
	import { onMount } from 'svelte'

	import { capitalCase } from '~/share/utils'

	export let name: string
	export let label = capitalCase(name)
	export let options: readonly T[]
	export let defaultValue = options[0]
	export let value = options[0]

	let select: HTMLSelectElement

	onMount(() => (select.selectedIndex = options.indexOf(defaultValue)))
</script>

<label class="field">
	<span class="secondary">{label}</span>

	<select bind:this={select} id={name} {name} required bind:value>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</label>
