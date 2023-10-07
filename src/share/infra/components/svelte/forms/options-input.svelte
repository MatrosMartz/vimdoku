<script lang="ts" generics="T extends string">
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let options: readonly T[]
	export let value = options[0]
</script>

<label class="field">
	<span>{capitalCase(name)}:</span>

	<select {name} id={name} required bind:value>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</label>
