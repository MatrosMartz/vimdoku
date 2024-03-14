<script lang="ts">
	import { onMount } from 'svelte'

	import type { TextField } from '~/share/domain/models'
	import { capitalCase } from '~/share/utils'

	export let name: string
	export let label = capitalCase(name)
	export let settings: TextField
	export let defaultValue: string
	export let value = defaultValue

	const placeholder = value

	let input: HTMLInputElement

	onMount(() => {
		input.defaultValue = defaultValue
	})
</script>

<label class="field container">
	<span class="secondary">{label}</span>
	<input bind:this={input} id={name} {name} {placeholder} class="text-or-number" {...settings} required bind:value />
</label>
